export const API_ROUTES = {
  health: "/health",
  signedUrl: "/elevenlabs/signed-url",
  interviews: "/interviews",
  createInterview: "/interview",
  interviewByKey: (key: string) => `/interview-by-key/${key}`,
} as const;
