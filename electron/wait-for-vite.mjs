/**
 * Wait for Vite dev server to be ready
 *
 * Simple replacement for wait-on that actually works on Mac.
 * Uses native fetch (Node 18+) to poll the server.
 */

const VITE_URL = 'http://127.0.0.1:5100';
const POLL_INTERVAL = 500; // ms
const TIMEOUT = 30000; // 30 seconds

async function checkServer() {
  try {
    const response = await fetch(VITE_URL, {
      method: 'HEAD',
      signal: AbortSignal.timeout(2000) // 2 second timeout per request
    });
    return response.ok || response.status === 304;
  } catch {
    return false;
  }
}

async function waitForVite() {
  const startTime = Date.now();

  console.log(`Waiting for Vite server at ${VITE_URL}...`);

  while (Date.now() - startTime < TIMEOUT) {
    if (await checkServer()) {
      console.log('Vite server is ready!');
      process.exit(0);
    }

    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
  }

  console.error(`Timeout: Vite server not ready after ${TIMEOUT / 1000} seconds`);
  process.exit(1);
}

waitForVite();
