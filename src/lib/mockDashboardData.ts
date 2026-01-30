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
    id: "resp_005",
    interview_id: "int_002",
    conversation_id: "conv_mno345",
    agent_id: "agent_xyz",
    status: "completed",
    participant_first_name: "Lisa",
    participant_last_name: "Park",
    participant_email: "lisa.park@design.io",
    call_duration_secs: 312,
    termination_reason: "completed",
    main_language: "en",
    call_successful: true,
    transcript_summary:
      "Lisa provided detailed feedback on the UI redesign. She loves the new color scheme but suggested improving button contrast for accessibility.",
    call_summary_title: "UI Redesign Feedback",
    analysis: {
      data_collection_results_list: [
        { data_collection_id: "sentiment_label", value: "positive" },
      ],
    },
    started_at: "2025-01-24T11:30:00Z",
    created_at: "2025-01-24T11:35:12Z",
    interview_title: "Product Pricing Survey",
  },
  {
    id: "resp_006",
    interview_id: "int_003",
    conversation_id: "conv_pqr678",
    agent_id: "agent_xyz",
    status: "completed",
    participant_first_name: "James",
    participant_last_name: "Wilson",
    participant_email: "j.wilson@enterprise.com",
    call_duration_secs: 567,
    termination_reason: "completed",
    main_language: "en",
    call_successful: true,
    transcript_summary:
      "James expressed frustration with the export functionality. He needs bulk export options and better CSV formatting for his team's workflow.",
    call_summary_title: "Export Feature Complaints",
    analysis: {
      data_collection_results_list: [
        { data_collection_id: "sentiment_label", value: "negative" },
      ],
    },
    started_at: "2025-01-23T15:00:00Z",
    created_at: "2025-01-23T15:09:27Z",
    interview_title: "Feature Feedback Session",
  },
  {
    id: "resp_007",
    interview_id: "int_001",
    conversation_id: "conv_stu901",
    agent_id: "agent_xyz",
    status: "completed",
    participant_first_name: "Anna",
    participant_last_name: "Kowalski",
    participant_email: "anna.k@freelance.pl",
    call_duration_secs: 289,
    termination_reason: "completed",
    main_language: "en",
    call_successful: true,
    transcript_summary:
      "Anna shared her onboarding experience as a freelancer. The process was smooth overall, though she mentioned the documentation could be clearer.",
    call_summary_title: "Freelancer Onboarding",
    analysis: {
      data_collection_results_list: [
        { data_collection_id: "sentiment_label", value: "neutral" },
      ],
    },
    started_at: "2025-01-22T09:45:00Z",
    created_at: "2025-01-22T09:49:49Z",
    interview_title: "User Onboarding Experience",
  },
  {
    id: "resp_008",
    interview_id: "int_004",
    conversation_id: "conv_vwx234",
    agent_id: "agent_xyz",
    status: "completed",
    participant_first_name: "Robert",
    participant_last_name: "Taylor",
    participant_email: "robert.taylor@corp.net",
    call_duration_secs: 423,
    termination_reason: "completed",
    main_language: "en",
    call_successful: true,
    transcript_summary:
      "Robert is very satisfied with the customer support team. He praised the quick response times and helpful troubleshooting guidance.",
    call_summary_title: "Support Team Praise",
    analysis: {
      data_collection_results_list: [
        { data_collection_id: "sentiment_label", value: "positive" },
      ],
    },
    started_at: "2025-01-21T14:20:00Z",
    created_at: "2025-01-21T14:27:03Z",
    interview_title: "Customer Satisfaction Check-in",
  },
  {
    id: "resp_009",
    interview_id: "int_002",
    conversation_id: "conv_yza567",
    agent_id: "agent_xyz",
    status: "completed",
    participant_first_name: "Maria",
    participant_last_name: "Garcia",
    participant_email: "maria.garcia@startup.mx",
    call_duration_secs: 198,
    termination_reason: "completed",
    main_language: "en",
    call_successful: true,
    transcript_summary:
      "Maria found the pricing tier confusing for growing startups. She recommended adding a mid-tier option between basic and enterprise plans.",
    call_summary_title: "Pricing Tier Confusion",
    analysis: {
      data_collection_results_list: [
        { data_collection_id: "sentiment_label", value: "neutral" },
      ],
    },
    started_at: "2025-01-20T16:00:00Z",
    created_at: "2025-01-20T16:03:18Z",
    interview_title: "Product Pricing Survey",
  },
  {
    id: "resp_010",
    interview_id: "int_003",
    conversation_id: "conv_bcd890",
    agent_id: "agent_xyz",
    status: "completed",
    participant_first_name: "Kevin",
    participant_last_name: "Brown",
    participant_email: "kbrown@agency.co",
    call_duration_secs: 534,
    termination_reason: "completed",
    main_language: "en",
    call_successful: true,
    transcript_summary:
      "Kevin loves the new dashboard analytics. He specifically mentioned the real-time charts and custom date range filters as game-changers for his reporting.",
    call_summary_title: "Dashboard Analytics Love",
    analysis: {
      data_collection_results_list: [
        { data_collection_id: "sentiment_label", value: "positive" },
      ],
    },
    started_at: "2025-01-19T10:30:00Z",
    created_at: "2025-01-19T10:38:54Z",
    interview_title: "Feature Feedback Session",
  },
  {
    id: "resp_011",
    interview_id: "int_001",
    conversation_id: "conv_efg123",
    agent_id: "agent_xyz",
    status: "completed",
    participant_first_name: "Sophie",
    participant_last_name: "Miller",
    participant_email: "sophie.m@consulting.uk",
    call_duration_secs: 376,
    termination_reason: "completed",
    main_language: "en",
    call_successful: true,
    transcript_summary:
      "Sophie appreciated the clean interface but had trouble finding advanced settings. She suggested adding a search function within the settings menu.",
    call_summary_title: "Settings Navigation Issue",
    analysis: {
      data_collection_results_list: [
        { data_collection_id: "sentiment_label", value: "neutral" },
      ],
    },
    started_at: "2025-01-18T13:15:00Z",
    created_at: "2025-01-18T13:21:16Z",
    interview_title: "User Onboarding Experience",
  },
  {
    id: "resp_012",
    interview_id: "int_004",
    conversation_id: "conv_hij456",
    agent_id: "agent_xyz",
    status: "failed",
    participant_first_name: "Thomas",
    participant_last_name: "Anderson",
    participant_email: "t.anderson@matrix.io",
    call_duration_secs: 23,
    termination_reason: "user_hangup",
    main_language: "en",
    call_successful: false,
    transcript_summary: "",
    call_summary_title: "Incomplete Call",
    analysis: {
      data_collection_results_list: [],
    },
    started_at: "2025-01-17T11:00:00Z",
    created_at: "2025-01-17T11:00:23Z",
    interview_title: "Customer Satisfaction Check-in",
  },
];

// Mock data for Saved Interviews (expanded for pagination)
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
  {
    id: "int_005",
    title: "Beta Tester Feedback",
    questions_count: 6,
    is_active: true,
    public_url: "https://interu.app/i/mno345",
    created_at: "2025-01-08T15:30:00Z",
  },
  {
    id: "int_006",
    title: "Annual Product Review",
    questions_count: 10,
    is_active: false,
    public_url: "https://interu.app/i/pqr678",
    created_at: "2025-01-05T10:00:00Z",
  },
  {
    id: "int_007",
    title: "UX Research Interview",
    questions_count: 8,
    is_active: true,
    public_url: "https://interu.app/i/stu901",
    created_at: "2025-01-03T14:45:00Z",
  },
  {
    id: "int_008",
    title: "Support Experience Survey",
    questions_count: 4,
    is_active: true,
    public_url: "https://interu.app/i/vwx234",
    created_at: "2024-12-28T09:00:00Z",
  },
  {
    id: "int_009",
    title: "New Feature Discovery",
    questions_count: 5,
    is_active: false,
    public_url: "https://interu.app/i/yza567",
    created_at: "2024-12-22T16:30:00Z",
  },
  {
    id: "int_010",
    title: "Mobile App Feedback",
    questions_count: 6,
    is_active: true,
    public_url: "https://interu.app/i/bcd890",
    created_at: "2024-12-18T11:15:00Z",
  },
  {
    id: "int_011",
    title: "Enterprise Client Interview",
    questions_count: 9,
    is_active: true,
    public_url: "https://interu.app/i/efg123",
    created_at: "2024-12-15T13:00:00Z",
  },
  {
    id: "int_012",
    title: "Accessibility Audit Feedback",
    questions_count: 7,
    is_active: false,
    public_url: "https://interu.app/i/hij456",
    created_at: "2024-12-10T08:30:00Z",
  },
  {
    id: "int_013",
    title: "API Integration Survey",
    questions_count: 5,
    is_active: true,
    public_url: "https://interu.app/i/klm789",
    created_at: "2024-12-05T17:00:00Z",
  },
  {
    id: "int_014",
    title: "Quarterly NPS Survey",
    questions_count: 3,
    is_active: true,
    public_url: "https://interu.app/i/nop012",
    created_at: "2024-12-01T10:00:00Z",
  },
  {
    id: "int_015",
    title: "Competitor Analysis Interviews",
    questions_count: 8,
    is_active: false,
    public_url: "https://interu.app/i/qrs345",
    created_at: "2024-11-25T14:30:00Z",
  },
];
