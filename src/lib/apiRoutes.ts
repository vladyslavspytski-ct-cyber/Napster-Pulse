export const API_ROUTES = {
  health: "/health",
  signedUrl: "/elevenlabs/signed-url",
  signedUrlByKey: (key: string, interviewId: string) =>
    `/elevenlabs/signed-url/key/${key}/interview-id/${interviewId}`,
  interviews: "/interviews",
  interviewsList: (params: { limit?: number; offset?: number; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
    if (params.offset !== undefined) searchParams.set("offset", String(params.offset));
    if (params.search) searchParams.set("search", params.search);
    const query = searchParams.toString();
    return `/interviews${query ? `?${query}` : ""}`;
  },
  interviewAttempts: (
    interviewId: string,
    params: { limit?: number; offset?: number; search?: string },
  ) => {
    const searchParams = new URLSearchParams();
    if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
    if (params.offset !== undefined) searchParams.set("offset", String(params.offset));
    if (params.search) searchParams.set("search", params.search);
    const query = searchParams.toString();
    return `/interview/${interviewId}/attempts${query ? `?${query}` : ""}`;
  },
  createInterview: "/interview",
  activateInterview: (id: string) => `/interview/${id}/activate`,
  interviewByKey: (key: string) => `/interview-by-key/${key}`,
} as const;
