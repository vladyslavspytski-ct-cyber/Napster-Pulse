export const API_ROUTES = {
  login: "/login",
  logout: "/logout",
  register: "/register",
  health: "/health",
  // User account
  me: "/me",
  mePassword: "/me/password",
  signedUrl: "/elevenlabs/signed-url",
  // Interview Architect agent signed URL (uses agentKey "interview-architect")
  interviewArchitectSignedUrl: "/elevenlabs/signed-url?agentKey=interview-architect",
  // Interview Architect questions sync endpoint (POST to update questions)
  architectQuestionsSync: "/ws/questions",
  // Interview templates
  templates: "/templates",
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
  completedInterviewsList: (params: { limit?: number; offset?: number; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
    if (params.offset !== undefined) searchParams.set("offset", String(params.offset));
    if (params.search) searchParams.set("search", params.search);
    const query = searchParams.toString();
    return `/completed-interviews${query ? `?${query}` : ""}`;
  },
  interviewAttempts: (
    interviewId: string,
    params: { limit?: number; offset?: number; search?: string; sentiment?: string },
  ) => {
    const searchParams = new URLSearchParams();
    if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
    if (params.offset !== undefined) searchParams.set("offset", String(params.offset));
    if (params.search) searchParams.set("search", params.search);
    if (params.sentiment && params.sentiment !== "all") searchParams.set("sentiment", params.sentiment);
    const query = searchParams.toString();
    return `/interview/${interviewId}/attempts${query ? `?${query}` : ""}`;
  },
  createInterview: "/interview",
  generateIntroduction: "/interview/generate-introduction",
  activateInterview: (id: string) => `/interview/${id}/activate`,
  deleteInterview: (id: string) => `/interview/${id}`,
  interviewByKey: (key: string) => `/interview-by-key/${key}`,
} as const;
