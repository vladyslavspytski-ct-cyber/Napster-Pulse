const BACKEND_SIGNED_URL_ENDPOINT =
  "https://91fa0c1f-27e4-4865-b0e6-1480aa4fb32b-00-d6703fvz3gp.worf.replit.dev/signed-url";

/**
 * Fetches a signed URL from the backend for the given agent ID.
 * Handles both plain text and JSON responses.
 */
export async function getSignedUrl(agentId: string): Promise<string> {
  try {
    const response = await fetch(`${BACKEND_SIGNED_URL_ENDPOINT}?agentId=${agentId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch signed URL: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "";

    // Handle JSON response
    if (contentType.includes("application/json")) {
      const data = await response.json();

      if (typeof data === "object" && data.signedUrl) {
        return data.signedUrl;
      }
      // If data itself is the URL string wrapped in JSON
      if (typeof data === "string") {
        return data;
      }
      throw new Error("Invalid JSON response: missing signedUrl field");
    }

    // Handle plain text response
    const text = await response.text();
    if (!text || text.trim().length === 0) {
      throw new Error("Empty signed URL received from backend");
    }

    return text.trim();
  } catch (error) {
    console.error("[ElevenLabs] Error fetching signed URL:", error);
    throw error;
  }
}

/**
 * Event types for conversation status changes
 */
export type ConversationStatus = "connected" | "disconnected" | "error";

export type ConversationEventHandler = {
  onStatusChange?: (status: ConversationStatus) => void;
  onError?: (error: Error) => void;
  onAssistantMessage?: (message: string) => void;
  onUserMessage?: (message: string) => void;
};

/**
 * Options for starting a conversation session
 */
export interface StartSessionOptions {
  /** Override the agent's first message */
  firstMessage?: string;
  /** Dynamic variables to pass to the agent (e.g., questions) */
  dynamicVariables?: Record<string, string>;
}

/**
 * ElevenLabs Conversation wrapper for browser-based WebRTC sessions
 */
export class ElevenLabsConversation {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private inputAnalyser: AnalyserNode | null = null;
  private outputAnalyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private eventHandlers: ConversationEventHandler;
  private inputDataArray: Uint8Array | null = null;
  private outputDataArray: Uint8Array | null = null;
  private audioWorkletNode: ScriptProcessorNode | null = null;
  private nextPlayTime: number = 0;

  constructor(eventHandlers: ConversationEventHandler = {}) {
    this.eventHandlers = eventHandlers;
  }

  /**
   * Start the conversation session with a signed URL
   * @param signedUrl - The signed WebSocket URL from the backend
   * @param mediaStream - The user's microphone stream
   * @param options - Optional configuration (firstMessage override, dynamic variables) or string for backwards compatibility
   */
  async startSession(signedUrl: string, mediaStream: MediaStream, options?: StartSessionOptions | string): Promise<void> {
    // Support legacy string parameter for backwards compatibility
    const opts: StartSessionOptions = typeof options === 'string'
      ? { firstMessage: options }
      : (options || {});

    console.log("[ElevenLabs] Starting session with options:", opts);

    try {
      // Store the media stream
      this.mediaStream = mediaStream;

      // Initialize audio context and analysers
      this.audioContext = new AudioContext();

      // Resume audio context if suspended (required by browsers)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Initialize next play time to current time
      this.nextPlayTime = this.audioContext.currentTime;

      // Input analyser (microphone)
      this.inputAnalyser = this.audioContext.createAnalyser();
      this.inputAnalyser.fftSize = 256;
      const inputBufferLength = this.inputAnalyser.frequencyBinCount;
      this.inputDataArray = new Uint8Array(inputBufferLength);

      // Connect microphone to input analyser
      const source = this.audioContext.createMediaStreamSource(mediaStream);
      source.connect(this.inputAnalyser);

      // Output analyser (speaker)
      this.outputAnalyser = this.audioContext.createAnalyser();
      this.outputAnalyser.fftSize = 256;
      const outputBufferLength = this.outputAnalyser.frequencyBinCount;
      this.outputDataArray = new Uint8Array(outputBufferLength);

      // Connect to ElevenLabs WebSocket
      this.ws = new WebSocket(signedUrl);

      this.ws.onopen = () => {
        console.log("[ElevenLabs] WebSocket opened");

        // Send conversation_initiation_client_data if we have overrides or dynamic variables
        const hasFirstMessage = !!opts.firstMessage;
        const hasDynamicVars = opts.dynamicVariables && Object.keys(opts.dynamicVariables).length > 0;

        if ((hasFirstMessage || hasDynamicVars) && this.ws) {
          const initiationMessage: Record<string, unknown> = {
            type: "conversation_initiation_client_data",
          };

          // Add first message override
          if (hasFirstMessage) {
            initiationMessage.conversation_config_override = {
              agent: {
                first_message: opts.firstMessage
              }
            };
          }

          // Add dynamic variables
          if (hasDynamicVars) {
            initiationMessage.dynamic_variables = opts.dynamicVariables;
            console.log("[ElevenLabs] Dynamic variable keys:", Object.keys(opts.dynamicVariables!));
            console.log("[ElevenLabs] Dynamic variables payload:", opts.dynamicVariables);
          }

          console.log("[ElevenLabs] Sending initiation_client_data BEFORE audio streaming");
          console.log("[ElevenLabs] Full initiation message:", JSON.stringify(initiationMessage, null, 2));
          this.ws.send(JSON.stringify(initiationMessage));
        }

        console.log("[ElevenLabs] Starting audio streaming AFTER initiation sent");
        this.eventHandlers.onStatusChange?.("connected");
        this.startAudioStreaming();
      };

      this.ws.onclose = (event) => {
        console.log("[ElevenLabs] WebSocket closed:", event.code, event.reason);
        this.eventHandlers.onStatusChange?.("disconnected");
      };

      this.ws.onerror = (event) => {
        console.error("[ElevenLabs] WebSocket error:", event);
        const error = new Error("WebSocket connection error");
        this.eventHandlers.onError?.(error);
        this.eventHandlers.onStatusChange?.("error");
      };

      this.ws.onmessage = async (event) => {
        // Handle incoming messages from ElevenLabs
        if (event.data instanceof Blob) {
          try {
            const buffer = await event.data.arrayBuffer();
            await this.playAudioChunk(buffer);
          } catch (err) {
            console.error("Error processing audio blob:", err);
          }
        } else if (typeof event.data === 'string') {
          // Handle JSON or text messages
          try {
            const message = JSON.parse(event.data);

            // Handle audio events
            if (message.type === 'audio' && message.audio_event?.audio_base_64) {
              // Decode base64 to ArrayBuffer
              const base64Audio = message.audio_event.audio_base_64;
              const binaryString = atob(base64Audio);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }

              // Play the decoded audio
              await this.playAudioChunk(bytes.buffer);
            }

            // Handle assistant response events
            if (message.type === 'agent_response' && message.agent_response_event?.agent_response) {
              this.eventHandlers.onAssistantMessage?.(message.agent_response_event.agent_response);
            }

            // Handle assistant response correction events
            if (message.type === 'agent_response_correction' && message.agent_response_correction_event?.agent_response_correction) {
              this.eventHandlers.onAssistantMessage?.(message.agent_response_correction_event.agent_response_correction);
            }
          } catch (err) {
            // Ignore non-JSON messages
          }
        }
      };

    } catch (error) {
      console.error("[ElevenLabs] Error starting conversation:", error);
      const err = error instanceof Error ? error : new Error("Failed to start conversation");
      this.eventHandlers.onError?.(err);
      throw err;
    }
  }

  private async startAudioStreaming(): Promise<void> {
    if (!this.audioContext || !this.mediaStream || !this.ws) {
      return;
    }

    // Create audio source from microphone
    const source = this.audioContext.createMediaStreamSource(this.mediaStream);

    // Create script processor for audio processing (buffer size 4096)
    // Note: ScriptProcessorNode is deprecated but still widely supported
    const bufferSize = 4096;
    const processor = this.audioContext.createScriptProcessor(bufferSize, 1, 1);

    this.audioWorkletNode = processor;

    processor.onaudioprocess = (event) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        return;
      }

      // Get input audio data (mono channel)
      const inputData = event.inputBuffer.getChannelData(0);

      // Resample from current sample rate to 16kHz and convert to PCM16
      const pcmData = this.resampleAndConvertToPCM16(
        inputData,
        this.audioContext!.sampleRate,
        16000
      );

      // Send PCM data as base64-encoded JSON message
      if (pcmData.length > 0) {
        // Convert Int16Array to base64
        const bytes = new Uint8Array(pcmData.buffer);
        const base64 = btoa(String.fromCharCode(...bytes));

        // Create the message in ElevenLabs format
        const message = {
          user_audio_chunk: base64
        };

        this.ws.send(JSON.stringify(message));
      }
    };

    // Connect: microphone -> processor -> destination (needed for processing to work)
    source.connect(processor);
    processor.connect(this.audioContext.destination);
  }

  /**
   * Resample audio from sourceSampleRate to targetSampleRate and convert to PCM16
   */
  private resampleAndConvertToPCM16(
    audioData: Float32Array,
    sourceSampleRate: number,
    targetSampleRate: number
  ): Int16Array {
    // Calculate resampling ratio
    const ratio = sourceSampleRate / targetSampleRate;
    const newLength = Math.round(audioData.length / ratio);
    const result = new Float32Array(newLength);

    // Simple linear interpolation resampling
    for (let i = 0; i < newLength; i++) {
      const srcIndex = i * ratio;
      const srcIndexFloor = Math.floor(srcIndex);
      const srcIndexCeil = Math.min(srcIndexFloor + 1, audioData.length - 1);
      const t = srcIndex - srcIndexFloor;

      // Linear interpolation
      result[i] = audioData[srcIndexFloor] * (1 - t) + audioData[srcIndexCeil] * t;
    }

    // Convert Float32 [-1, 1] to Int16 [-32768, 32767]
    const pcm16 = new Int16Array(newLength);
    for (let i = 0; i < newLength; i++) {
      const s = Math.max(-1, Math.min(1, result[i])); // Clamp
      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }

    return pcm16;
  }

  private async playAudioChunk(buffer: ArrayBuffer): Promise<void> {
    if (!this.audioContext || !this.outputAnalyser) return;

    try {
      // Ensure audio context is running
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // The server sends PCM16 audio at 16kHz
      const int16Array = new Int16Array(buffer);

      // Convert PCM16 to Float32 for Web Audio API
      const float32Array = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        // Convert Int16 [-32768, 32767] to Float32 [-1, 1]
        float32Array[i] = int16Array[i] / (int16Array[i] < 0 ? 0x8000 : 0x7FFF);
      }

      // Create audio buffer at 16kHz (server's sample rate)
      const audioBuffer = this.audioContext.createBuffer(
        1, // mono
        float32Array.length,
        16000 // 16kHz sample rate
      );

      // Copy data to audio buffer
      audioBuffer.getChannelData(0).set(float32Array);

      // Create buffer source and play
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;

      // Connect through analyser for volume monitoring
      source.connect(this.outputAnalyser);
      this.outputAnalyser.connect(this.audioContext.destination);

      // Schedule playback to queue audio chunks seamlessly
      const currentTime = this.audioContext.currentTime;
      const startTime = Math.max(currentTime, this.nextPlayTime);

      source.start(startTime);

      // Update next play time
      this.nextPlayTime = startTime + audioBuffer.duration;
    } catch (error) {
      console.error("Error playing audio chunk:", error);
    }
  }

  /**
   * Get current input (microphone) volume level (0-1)
   */
  getInputVolume(): number {
    if (!this.inputAnalyser || !this.inputDataArray) return 0;

    const dataArray = new Uint8Array(this.inputAnalyser.frequencyBinCount);
    this.inputAnalyser.getByteFrequencyData(dataArray);

    // Calculate average volume
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;

    // Normalize to 0-1 range
    return Math.min(average / 128, 1);
  }

  /**
   * Get current output (speaker) volume level (0-1)
   */
  getOutputVolume(): number {
    if (!this.outputAnalyser || !this.outputDataArray) return 0;

    const dataArray = new Uint8Array(this.outputAnalyser.frequencyBinCount);
    this.outputAnalyser.getByteFrequencyData(dataArray);

    // Calculate average volume
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;

    // Normalize to 0-1 range
    return Math.min(average / 128, 1);
  }

  /**
   * End the conversation session and cleanup resources
   */
  async endSession(): Promise<void> {
    // Disconnect audio worklet node
    if (this.audioWorkletNode) {
      this.audioWorkletNode.disconnect();
      this.audioWorkletNode = null;
    }

    // Close WebSocket
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    // Stop media stream tracks
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    // Close audio context
    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }

    // Clear analysers
    this.inputAnalyser = null;
    this.outputAnalyser = null;
    this.inputDataArray = null;
    this.outputDataArray = null;

    this.eventHandlers.onStatusChange?.("disconnected");
  }
}
