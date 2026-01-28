import { BACKEND_BASE_URL } from "@/config";

/**
 * Generic API call function with error handling and JSON support.
 * @param path - API path (e.g., "/health")
 * @param init - Optional fetch RequestInit options
 * @returns Parsed JSON response or text
 */
export async function callApi<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = `${BACKEND_BASE_URL}${path}`;

  // If body is a plain object, stringify it and set Content-Type
  let finalInit = init;
  if (init?.body && typeof init.body === "object" && !(init.body instanceof FormData) && !(init.body instanceof Blob)) {
    finalInit = {
      ...init,
      body: JSON.stringify(init.body),
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    };
  }

  const response = await fetch(url, finalInit);

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  }

  return response.text() as Promise<T>;
}
