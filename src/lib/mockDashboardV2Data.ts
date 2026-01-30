// Types for Dashboard v2 - Conducted Interviews master-detail layout

export interface InterviewTemplate {
  id: string;
  title: string;
  createdAt: string;
  completedCount: number;
}

export interface ConductedRun {
  id: string;
  interviewId: string;
  participantFirstName: string;
  participantLastName: string;
  participantEmail: string;
  conductedAt: string;
  summary: string;
  sentimentLabel: "positive" | "neutral" | "negative";
}

// Helper to normalize sentiment
export const normalizeSentiment = (
  label: string | undefined
): "positive" | "neutral" | "negative" => {
  const normalized = label?.toLowerCase();
  if (normalized === "positive") return "positive";
  if (normalized === "negative") return "negative";
  return "neutral";
};

// Mock data: Interview templates (left column)
export const mockInterviewTemplates: InterviewTemplate[] = [
  {
    id: "int_001",
    title: "User Onboarding Experience",
    createdAt: "2025-01-20T12:00:00Z",
    completedCount: 4,
  },
  {
    id: "int_002",
    title: "Product Pricing Survey",
    createdAt: "2025-01-18T09:30:00Z",
    completedCount: 3,
  },
  {
    id: "int_003",
    title: "Feature Feedback Session",
    createdAt: "2025-01-15T14:00:00Z",
    completedCount: 2,
  },
  {
    id: "int_004",
    title: "Customer Satisfaction Check-in",
    createdAt: "2025-01-10T11:00:00Z",
    completedCount: 2,
  },
  {
    id: "int_005",
    title: "Beta Tester Feedback",
    createdAt: "2025-01-08T16:00:00Z",
    completedCount: 5,
  },
  {
    id: "int_006",
    title: "Post-Launch Survey",
    createdAt: "2025-01-05T10:00:00Z",
    completedCount: 8,
  },
  {
    id: "int_007",
    title: "Enterprise Client Interviews",
    createdAt: "2025-01-03T14:30:00Z",
    completedCount: 3,
  },
  {
    id: "int_008",
    title: "UX Research - Mobile App",
    createdAt: "2024-12-28T09:00:00Z",
    completedCount: 6,
  },
  {
    id: "int_009",
    title: "Competitor Analysis Feedback",
    createdAt: "2024-12-20T11:00:00Z",
    completedCount: 4,
  },
  {
    id: "int_010",
    title: "New Feature Discovery",
    createdAt: "2024-12-15T15:00:00Z",
    completedCount: 7,
  },
  {
    id: "int_011",
    title: "Quarterly User Check-in",
    createdAt: "2024-12-10T08:00:00Z",
    completedCount: 12,
  },
  {
    id: "int_012",
    title: "Churn Prevention Survey",
    createdAt: "2024-12-05T14:00:00Z",
    completedCount: 5,
  },
  {
    id: "int_013",
    title: "Product Market Fit Analysis",
    createdAt: "2024-12-01T10:00:00Z",
    completedCount: 9,
  },
  {
    id: "int_014",
    title: "Support Experience Feedback",
    createdAt: "2024-11-25T11:30:00Z",
    completedCount: 4,
  },
  {
    id: "int_015",
    title: "Onboarding V2 Test",
    createdAt: "2024-11-20T09:00:00Z",
    completedCount: 6,
  },
  {
    id: "int_016",
    title: "Integration Partners Feedback",
    createdAt: "2024-11-15T14:00:00Z",
    completedCount: 3,
  },
  {
    id: "int_017",
    title: "Annual User Survey 2024",
    createdAt: "2024-11-10T10:00:00Z",
    completedCount: 15,
  },
  {
    id: "int_018",
    title: "Dashboard Redesign Feedback",
    createdAt: "2024-11-05T16:00:00Z",
    completedCount: 8,
  },
];

// Mock data: Conducted runs (right column) - grouped by interview
export const mockConductedRuns: ConductedRun[] = [
  // int_001 - User Onboarding Experience (4 responses)
  {
    id: "run_001",
    interviewId: "int_001",
    participantFirstName: "Sarah",
    participantLastName: "Johnson",
    participantEmail: "sarah.johnson@example.com",
    conductedAt: "2025-01-28T14:30:00Z",
    summary:
      "Sarah expressed strong satisfaction with the onboarding process. She particularly appreciated the guided tutorials and responsive support team. Minor suggestion to improve mobile navigation was noted.",
    sentimentLabel: "positive",
  },
  {
    id: "run_002",
    interviewId: "int_001",
    participantFirstName: "Anna",
    participantLastName: "Kowalski",
    participantEmail: "anna.k@freelance.pl",
    conductedAt: "2025-01-22T09:45:00Z",
    summary:
      "Anna shared her onboarding experience as a freelancer. The process was smooth overall, though she mentioned the documentation could be clearer.",
    sentimentLabel: "neutral",
  },
  {
    id: "run_003",
    interviewId: "int_001",
    participantFirstName: "Sophie",
    participantLastName: "Miller",
    participantEmail: "sophie.m@consulting.uk",
    conductedAt: "2025-01-18T13:15:00Z",
    summary:
      "Sophie appreciated the clean interface but had trouble finding advanced settings. She suggested adding a search function within the settings menu.",
    sentimentLabel: "neutral",
  },
  {
    id: "run_004",
    interviewId: "int_001",
    participantFirstName: "David",
    participantLastName: "Lee",
    participantEmail: "david.lee@startup.io",
    conductedAt: "2025-01-15T10:00:00Z",
    summary:
      "David found the onboarding quick and efficient. He was impressed with the interactive walkthroughs and would recommend the platform to colleagues.",
    sentimentLabel: "positive",
  },

  // int_002 - Product Pricing Survey (3 responses)
  {
    id: "run_005",
    interviewId: "int_002",
    participantFirstName: "Michael",
    participantLastName: "Chen",
    participantEmail: "m.chen@techcorp.io",
    conductedAt: "2025-01-27T10:15:00Z",
    summary:
      "Michael provided neutral feedback about the product pricing. He finds the value proposition reasonable but would like to see more flexible payment options for small teams.",
    sentimentLabel: "neutral",
  },
  {
    id: "run_006",
    interviewId: "int_002",
    participantFirstName: "Lisa",
    participantLastName: "Park",
    participantEmail: "lisa.park@design.io",
    conductedAt: "2025-01-24T11:30:00Z",
    summary:
      "Lisa provided detailed feedback on the UI redesign. She loves the new color scheme but suggested improving button contrast for accessibility.",
    sentimentLabel: "positive",
  },
  {
    id: "run_007",
    interviewId: "int_002",
    participantFirstName: "Maria",
    participantLastName: "Garcia",
    participantEmail: "maria.garcia@startup.mx",
    conductedAt: "2025-01-20T16:00:00Z",
    summary:
      "Maria found the pricing tier confusing for growing startups. She recommended adding a mid-tier option between basic and enterprise plans.",
    sentimentLabel: "neutral",
  },

  // int_003 - Feature Feedback Session (2 responses)
  {
    id: "run_008",
    interviewId: "int_003",
    participantFirstName: "James",
    participantLastName: "Wilson",
    participantEmail: "j.wilson@enterprise.com",
    conductedAt: "2025-01-23T15:00:00Z",
    summary:
      "James expressed frustration with the export functionality. He needs bulk export options and better CSV formatting for his team's workflow.",
    sentimentLabel: "negative",
  },
  {
    id: "run_009",
    interviewId: "int_003",
    participantFirstName: "Kevin",
    participantLastName: "Brown",
    participantEmail: "kbrown@agency.co",
    conductedAt: "2025-01-19T10:30:00Z",
    summary:
      "Kevin loves the new dashboard analytics. He specifically mentioned the real-time charts and custom date range filters as game-changers for his reporting.",
    sentimentLabel: "positive",
  },

  // int_004 - Customer Satisfaction Check-in (2 responses)
  {
    id: "run_010",
    interviewId: "int_004",
    participantFirstName: "Robert",
    participantLastName: "Taylor",
    participantEmail: "robert.taylor@corp.net",
    conductedAt: "2025-01-21T14:20:00Z",
    summary:
      "Robert is very satisfied with the customer support team. He praised the quick response times and helpful troubleshooting guidance.",
    sentimentLabel: "positive",
  },
  {
    id: "run_011",
    interviewId: "int_004",
    participantFirstName: "Emma",
    participantLastName: "Davis",
    participantEmail: "emma.davis@retail.com",
    conductedAt: "2025-01-17T09:00:00Z",
    summary:
      "Emma had mixed feelings about recent updates. While she appreciates new features, the learning curve has been steep for her team.",
    sentimentLabel: "neutral",
  },

  // int_005 - Beta Tester Feedback (5 responses)
  {
    id: "run_012",
    interviewId: "int_005",
    participantFirstName: "Alex",
    participantLastName: "Turner",
    participantEmail: "alex.t@beta.test",
    conductedAt: "2025-01-26T11:00:00Z",
    summary:
      "Alex found several bugs in the new feature but overall is excited about the direction. Provided detailed reproduction steps for the development team.",
    sentimentLabel: "neutral",
  },
  {
    id: "run_013",
    interviewId: "int_005",
    participantFirstName: "Jordan",
    participantLastName: "Martinez",
    participantEmail: "jordan.m@dev.io",
    conductedAt: "2025-01-25T14:30:00Z",
    summary:
      "Jordan is impressed with the performance improvements. The app feels much snappier and the new caching system is working well.",
    sentimentLabel: "positive",
  },
  {
    id: "run_014",
    interviewId: "int_005",
    participantFirstName: "Casey",
    participantLastName: "Wong",
    participantEmail: "casey.wong@tech.co",
    conductedAt: "2025-01-24T09:15:00Z",
    summary:
      "Casey encountered critical issues with data sync. Lost work twice due to sync conflicts. Requesting priority fix before public release.",
    sentimentLabel: "negative",
  },
  {
    id: "run_015",
    interviewId: "int_005",
    participantFirstName: "Riley",
    participantLastName: "Thompson",
    participantEmail: "riley.t@startup.io",
    conductedAt: "2025-01-23T16:45:00Z",
    summary:
      "Riley loves the new collaboration features. The real-time editing works smoothly and the presence indicators are helpful for team coordination.",
    sentimentLabel: "positive",
  },
  {
    id: "run_016",
    interviewId: "int_005",
    participantFirstName: "Morgan",
    participantLastName: "Blake",
    participantEmail: "morgan.b@agency.net",
    conductedAt: "2025-01-22T10:00:00Z",
    summary:
      "Morgan provided comprehensive feedback on the API changes. The new endpoints are intuitive and documentation is much improved.",
    sentimentLabel: "positive",
  },

  // int_006 - Post-Launch Survey (8 responses - showing 4)
  {
    id: "run_017",
    interviewId: "int_006",
    participantFirstName: "Chris",
    participantLastName: "Anderson",
    participantEmail: "chris.a@company.com",
    conductedAt: "2025-01-20T13:00:00Z",
    summary:
      "Chris is delighted with the launch. Everything works as expected and the transition from beta was seamless for the entire team.",
    sentimentLabel: "positive",
  },
  {
    id: "run_018",
    interviewId: "int_006",
    participantFirstName: "Taylor",
    participantLastName: "Reed",
    participantEmail: "taylor.r@enterprise.io",
    conductedAt: "2025-01-19T15:30:00Z",
    summary:
      "Taylor experienced some initial confusion with the new navigation but adapted quickly. Overall satisfied with the improvements.",
    sentimentLabel: "neutral",
  },
  {
    id: "run_019",
    interviewId: "int_006",
    participantFirstName: "Sam",
    participantLastName: "Foster",
    participantEmail: "sam.foster@retail.net",
    conductedAt: "2025-01-18T11:00:00Z",
    summary:
      "Sam reported billing issues post-launch. The new pricing wasn't applied correctly to their account. Awaiting support resolution.",
    sentimentLabel: "negative",
  },
  {
    id: "run_020",
    interviewId: "int_006",
    participantFirstName: "Pat",
    participantLastName: "Morgan",
    participantEmail: "pat.m@consulting.co",
    conductedAt: "2025-01-17T14:00:00Z",
    summary:
      "Pat appreciates the performance gains but misses some features that were removed. Would like to see them return in future updates.",
    sentimentLabel: "neutral",
  },

  // int_007 - Enterprise Client Interviews (3 responses)
  {
    id: "run_021",
    interviewId: "int_007",
    participantFirstName: "Jennifer",
    participantLastName: "Scott",
    participantEmail: "j.scott@bigcorp.com",
    conductedAt: "2025-01-16T10:00:00Z",
    summary:
      "Jennifer needs SSO integration urgently. Current authentication flow doesn't meet enterprise security requirements. Blocking wider adoption.",
    sentimentLabel: "negative",
  },
  {
    id: "run_022",
    interviewId: "int_007",
    participantFirstName: "Brandon",
    participantLastName: "Clark",
    participantEmail: "brandon.c@global.io",
    conductedAt: "2025-01-15T14:30:00Z",
    summary:
      "Brandon is happy with the dedicated support channel. Response times are excellent and the account manager is very helpful.",
    sentimentLabel: "positive",
  },
  {
    id: "run_023",
    interviewId: "int_007",
    participantFirstName: "Nicole",
    participantLastName: "Adams",
    participantEmail: "nicole.a@enterprise.net",
    conductedAt: "2025-01-14T09:00:00Z",
    summary:
      "Nicole requested custom reporting capabilities. The standard dashboards don't meet their compliance reporting needs.",
    sentimentLabel: "neutral",
  },
];

// Helper to get runs for a specific interview
export const getRunsForInterview = (interviewId: string): ConductedRun[] => {
  return mockConductedRuns.filter((run) => run.interviewId === interviewId);
};

// Helper to format date with timezone label
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
