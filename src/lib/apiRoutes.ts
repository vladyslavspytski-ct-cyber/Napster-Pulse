export const API_ROUTES = {
  health: "/health",
  signedUrl: "/elevenlabs/signed-url",
  signedUrlByKey: (key: string, interviewId: string) =>
    `/elevenlabs/signed-url/key/${key}/interview-id/${interviewId}`,
  interviews: "/interviews",
  createInterview: "/interview",
  activateInterview: (id: string) => `/interview/${id}/activate`,
  interviewByKey: (key: string) => `/interview-by-key/${key}`,
} as const;
