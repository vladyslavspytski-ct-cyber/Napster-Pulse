// Types matching backend fields

export interface AnalysisDataCollectionResult {
  data_collection_id: string;
  value: string;
}

export interface Analysis {
  data_collection_results_list: AnalysisDataCollectionResult[];
}

export interface InterviewResponse {
  id: string;
  interview_id: string;
  conversation_id: string;
  agent_id: string;
  status: "completed" | "failed" | "in_progress";
  participant_first_name: string;
  participant_last_name: string;
  participant_email: string;
  call_duration_secs: number;
  termination_reason: string;
  main_language: string;
  call_successful: boolean;
  transcript_summary: string;
  call_summary_title: string;
  analysis: Analysis;
  started_at: string;
  created_at: string;
  // Optional: linked interview title if available
  interview_title?: string;
}

export interface SavedInterview {
  id: string;
  title: string;
  questions_count: number;
  is_active: boolean;
  public_url: string;
  created_at: string;
}

// Helper to extract sentiment from analysis
export const extractSentiment = (analysis: Analysis): { label: string; score?: number } => {
  const results = analysis.data_collection_results_list;
  const labelItem = results.find((r) => r.data_collection_id === "sentiment_label");
  const scoreItem = results.find((r) => r.data_collection_id === "sentiment_score");

  return {
    label: labelItem?.value || "unknown",
    score: scoreItem?.value ? parseFloat(scoreItem.value) : undefined,
  };
};

// Helper to get summary with fallback
export const getSummary = (response: InterviewResponse): string => {
  if (response.transcript_summary) {
    return response.transcript_summary;
  }
  const summaryItem = response.analysis.data_collection_results_list.find(
    (r) => r.data_collection_id === "summary"
  );
  return summaryItem?.value || "No summary available.";
};

// Mock data for Conducted Interviews
export const mockInterviewResponses: InterviewResponse[] = [
  {
    id: "resp_001",
    interview_id: "int_001",
    conversation_id: "conv_abc123",
    agent_id: "agent_xyz",
    status: "completed",
    participant_first_name: "Sarah",
    participant_last_name: "Johnson",
    participant_email: "sarah.johnson@example.com",
    call_duration_secs: 342,
    termination_reason: "completed",
    main_language: "en",
    call_successful: true,
    transcript_summary:
      "Sarah expressed strong satisfaction with the onboarding process. She particularly appreciated the guided tutorials and responsive support team. Minor suggestion to improve mobile navigation was noted.",
    call_summary_title: "Positive Onboarding Feedback",
    analysis: {
      data_collection_results_list: [
        { data_collection_id: "sentiment_label", value: "positive" },
        { data_collection_id: "sentiment_score", value: "0.85" },
      ],
    },
    started_at: "2025-01-28T14:30:00Z",
    created_at: "2025-01-28T14:35:42Z",
    interview_title: "User Onboarding Experience",
  },
  {
    id: "resp_002",
    interview_id: "int_002",
    conversation_id: "conv_def456",
    agent_id: "agent_xyz",
    status: "completed",
    participant_first_name: "Michael",
    participant_last_name: "Chen",
    participant_email: "m.chen@techcorp.io",
    call_duration_secs: 256,
    termination_reason: "completed",
    main_language: "en",
    call_successful: true,
    transcript_summary:
      "Michael provided neutral feedback about the product pricing. He finds the value proposition reasonable but would like to see more flexible payment options for small teams.",
    call_summary_title: "Pricing Feedback Discussion",
    analysis: {
      data_collection_results_list: [
        { data_collection_id: "sentiment_label", value: "neutral" },
        { data_collection_id: "sentiment_score", value: "0.52" },
      ],
    },
    started_at: "2025-01-27T10:15:00Z",
    created_at: "2025-01-27T10:19:16Z",
    interview_title: "Product Pricing Survey",
  },
  {
    id: "resp_003",
    interview_id: "int_001",
    conversation_id: "conv_ghi789",
    agent_id: "agent_xyz",
    status: "failed",
    participant_first_name: "Emma",
    participant_last_name: "Williams",
    participant_email: "emma.w@gmail.com",
    call_duration_secs: 45,
    termination_reason: "connection_error",
    main_language: "en",
    call_successful: false,
    transcript_summary: "",
    call_summary_title: "Incomplete Session",
    analysis: {
      data_collection_results_list: [],
    },
    started_at: "2025-01-26T16:45:00Z",
    created_at: "2025-01-26T16:45:45Z",
    interview_title: "User Onboarding Experience",
  },
  {
    id: "resp_004",
    interview_id: "int_003",
    conversation_id: "conv_jkl012",
    agent_id: "agent_xyz",
    status: "completed",
    participant_first_name: "David",
    participant_last_name: "Martinez",
    participant_email: "david.martinez@startup.co",
    call_duration_secs: 489,
    termination_reason: "completed",
    main_language: "en",
    call_successful: true,
    transcript_summary:
      "David shared concerns about the learning curve for new features. He suggested adding contextual tooltips and a searchable knowledge base. Overall, he remains committed to the platform despite these challenges.",
    call_summary_title: "Feature Usability Concerns",
    analysis: {
      data_collection_results_list: [
        { data_collection_id: "sentiment_label", value: "mixed" },
        { data_collection_id: "sentiment_score", value: "0.45" },
      ],
    },
    started_at: "2025-01-25T09:00:00Z",
    created_at: "2025-01-25T09:08:09Z",
    interview_title: "Feature Feedback Session",
  },
];

// Mock data for Saved Interviews
export const mockSavedInterviews: SavedInterview[] = [
  {
    id: "int_001",
    title: "User Onboarding Experience",
    questions_count: 5,
    is_active: true,
    public_url: "https://interu.app/i/abc123",
    created_at: "2025-01-20T12:00:00Z",
  },
  {
    id: "int_002",
    title: "Product Pricing Survey",
    questions_count: 3,
    is_active: true,
    public_url: "https://interu.app/i/def456",
    created_at: "2025-01-18T09:30:00Z",
  },
  {
    id: "int_003",
    title: "Feature Feedback Session",
    questions_count: 7,
    is_active: false,
    public_url: "https://interu.app/i/ghi789",
    created_at: "2025-01-15T14:00:00Z",
  },
  {
    id: "int_004",
    title: "Customer Satisfaction Check-in",
    questions_count: 4,
    is_active: true,
    public_url: "https://interu.app/i/jkl012",
    created_at: "2025-01-10T11:00:00Z",
  },
];
