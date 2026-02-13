/**
 * Shared mock templates data for both UX variants.
 * Shape matches the backend Template type from useTemplates.ts.
 */

export interface MockTemplateQuestion {
  id: string;
  text: string;
  order: number;
}

export interface MockTemplate {
  id: string;
  title: string;
  scenario: string;
  seq: number;
  questions: MockTemplateQuestion[];
}

function q(id: string, text: string, order: number): MockTemplateQuestion {
  return { id, text, order };
}

export const MOCK_TEMPLATES: MockTemplate[] = [
  {
    id: "mt-1",
    title: "Senior Frontend Developer",
    scenario: "Assess React/TypeScript proficiency, system design thinking, and team collaboration skills.",
    seq: 1,
    questions: [
      q("mt-1-q1", "Walk me through a complex React component you've built recently.", 1),
      q("mt-1-q2", "How do you approach performance optimization in a large SPA?", 2),
      q("mt-1-q3", "Describe your experience with TypeScript generics and utility types.", 3),
      q("mt-1-q4", "How do you handle state management at scale?", 4),
      q("mt-1-q5", "Tell me about a time you mentored a junior developer.", 5),
      q("mt-1-q6", "How do you approach component testing strategies?", 6),
    ],
  },
  {
    id: "mt-2",
    title: "Backend Engineer (Go/Python)",
    scenario: "Evaluate backend architecture skills, API design, and database optimization experience.",
    seq: 2,
    questions: [
      q("mt-2-q1", "How do you design a RESTful API from scratch?", 1),
      q("mt-2-q2", "Describe your experience with concurrent programming.", 2),
      q("mt-2-q3", "How do you approach database schema design?", 3),
      q("mt-2-q4", "What's your strategy for handling high-traffic endpoints?", 4),
      q("mt-2-q5", "Tell me about a production incident you helped resolve.", 5),
    ],
  },
  {
    id: "mt-3",
    title: "Product Manager",
    scenario: "Evaluate strategic thinking, stakeholder management, and roadmap prioritization skills.",
    seq: 3,
    questions: [
      q("mt-3-q1", "How do you prioritize features on a product roadmap?", 1),
      q("mt-3-q2", "Describe a product you launched from ideation to delivery.", 2),
      q("mt-3-q3", "How do you gather and synthesize user feedback?", 3),
      q("mt-3-q4", "Tell me about a difficult trade-off you had to make.", 4),
      q("mt-3-q5", "How do you measure product success?", 5),
    ],
  },
  {
    id: "mt-4",
    title: "UX Designer",
    scenario: "Assess design process, user research skills, and prototyping proficiency.",
    seq: 4,
    questions: [
      q("mt-4-q1", "Walk me through your design process for a recent project.", 1),
      q("mt-4-q2", "How do you conduct and synthesize user research?", 2),
      q("mt-4-q3", "Describe your approach to design system creation.", 3),
      q("mt-4-q4", "How do you handle stakeholder feedback that conflicts with user needs?", 4),
      q("mt-4-q5", "What accessibility considerations do you prioritize?", 5),
    ],
  },
  {
    id: "mt-5",
    title: "Customer Discovery Interview",
    scenario: "Understand user pain points, workflows, and unmet needs for product ideation.",
    seq: 5,
    questions: [
      q("mt-5-q1", "Walk me through a typical day in your role.", 1),
      q("mt-5-q2", "What are the most frustrating parts of your current workflow?", 2),
      q("mt-5-q3", "How do you currently solve this problem?", 3),
      q("mt-5-q4", "What would an ideal solution look like for you?", 4),
      q("mt-5-q5", "How much time/money does this problem cost you?", 5),
    ],
  },
  {
    id: "mt-6",
    title: "HR Exit Interview",
    scenario: "Gather candid feedback from departing employees to improve retention and culture.",
    seq: 6,
    questions: [
      q("mt-6-q1", "How are you feeling about your transition?", 1),
      q("mt-6-q2", "What initially attracted you to this role, and how did your experience compare?", 2),
      q("mt-6-q3", "If you could change one thing about your day-to-day experience, what would it be?", 3),
      q("mt-6-q4", "How would you describe your relationship with your direct manager?", 4),
      q("mt-6-q5", "What could we have done differently to keep you on the team?", 5),
      q("mt-6-q6", "What advice would you give to your successor?", 6),
    ],
  },
  {
    id: "mt-7",
    title: "Quarterly Performance Review",
    scenario: "Structured quarterly review covering goals, achievements, and development areas.",
    seq: 7,
    questions: [
      q("mt-7-q1", "What were your key accomplishments this quarter?", 1),
      q("mt-7-q2", "Which goals did you fall short on and why?", 2),
      q("mt-7-q3", "What skills have you developed recently?", 3),
      q("mt-7-q4", "How effective has your collaboration been with the team?", 4),
      q("mt-7-q5", "What are your priorities for next quarter?", 5),
    ],
  },
  {
    id: "mt-8",
    title: "Manager 1:1 Check-in",
    scenario: "Address disengagement, surface blockers, and foster open communication.",
    seq: 8,
    questions: [
      q("mt-8-q1", "How are you doing this week—not just work, but overall?", 1),
      q("mt-8-q2", "What's been your biggest win since we last talked?", 2),
      q("mt-8-q3", "What's getting in the way of you doing your best work right now?", 3),
      q("mt-8-q4", "How are you feeling about your career trajectory here?", 4),
      q("mt-8-q5", "Is there anything I'm doing—or not doing—that's making your job harder?", 5),
    ],
  },
  {
    id: "mt-9",
    title: "New Patient Intake",
    scenario: "Comprehensive patient intake interview covering history, symptoms, and lifestyle.",
    seq: 9,
    questions: [
      q("mt-9-q1", "What brings you in today?", 1),
      q("mt-9-q2", "Can you describe your symptoms in detail?", 2),
      q("mt-9-q3", "When did you first notice these symptoms?", 3),
      q("mt-9-q4", "Do you have any existing medical conditions?", 4),
      q("mt-9-q5", "Are you currently taking any medications?", 5),
    ],
  },
  {
    id: "mt-10",
    title: "Journalistic Source Interview",
    scenario: "Trust-building, structured approach for sensitive source interviews with verification focus.",
    seq: 10,
    questions: [
      q("mt-10-q1", "Can you start by telling me about your background and how you came to have knowledge of this situation?", 1),
      q("mt-10-q2", "In your own words, what happened?", 2),
      q("mt-10-q3", "Do you have any documentation, emails, or records that support what you've described?", 3),
      q("mt-10-q4", "Who else can corroborate this account?", 4),
      q("mt-10-q5", "Why are you choosing to share this now?", 5),
    ],
  },
  {
    id: "mt-11",
    title: "BANT Lead Qualification",
    scenario: "Qualify leads using Budget, Authority, Need, and Timeline framework.",
    seq: 11,
    questions: [
      q("mt-11-q1", "What budget have you allocated for this type of solution?", 1),
      q("mt-11-q2", "Who else is involved in the decision-making process?", 2),
      q("mt-11-q3", "What specific problem are you trying to solve?", 3),
      q("mt-11-q4", "What's your timeline for implementing a solution?", 4),
      q("mt-11-q5", "Have you evaluated any other solutions?", 5),
    ],
  },
  {
    id: "mt-12",
    title: "Oral Examination (Education)",
    scenario: "Structured oral exam to assess subject mastery and critical thinking.",
    seq: 12,
    questions: [
      q("mt-12-q1", "Explain the core concept of the topic in your own words.", 1),
      q("mt-12-q2", "How does concept A relate to concept B?", 2),
      q("mt-12-q3", "Can you give a real-world application of this theory?", 3),
      q("mt-12-q4", "What are the limitations of this approach?", 4),
      q("mt-12-q5", "How would you design an experiment to test this hypothesis?", 5),
    ],
  },
  {
    id: "mt-13",
    title: "Day 30 Onboarding Check-in",
    scenario: "Structured check-in to assess early integration, clarity of role, and initial blockers.",
    seq: 13,
    questions: [
      q("mt-13-q1", "How clear is your understanding of your role and responsibilities?", 1),
      q("mt-13-q2", "What has surprised you most about the team or company?", 2),
      q("mt-13-q3", "Do you have the tools and resources you need to be effective?", 3),
      q("mt-13-q4", "How is your relationship with your manager developing?", 4),
      q("mt-13-q5", "What questions do you still have about the company?", 5),
    ],
  },
  {
    id: "mt-14",
    title: "DevOps / SRE Interview",
    scenario: "Probe infrastructure-as-code expertise, CI/CD pipelines, and incident response capabilities.",
    seq: 14,
    questions: [
      q("mt-14-q1", "Walk me through your ideal CI/CD pipeline.", 1),
      q("mt-14-q2", "How do you approach infrastructure as code?", 2),
      q("mt-14-q3", "Describe your experience with Kubernetes in production.", 3),
      q("mt-14-q4", "How do you handle on-call rotations and incident response?", 4),
      q("mt-14-q5", "What monitoring and alerting tools have you used?", 5),
    ],
  },
  {
    id: "mt-15",
    title: "Enterprise Discovery Call",
    scenario: "Deep-dive discovery for enterprise prospects to understand organizational needs.",
    seq: 15,
    questions: [
      q("mt-15-q1", "Tell me about your organization's current challenges.", 1),
      q("mt-15-q2", "How does your team currently handle this process?", 2),
      q("mt-15-q3", "What would success look like for your organization?", 3),
      q("mt-15-q4", "Who are the key stakeholders we should involve?", 4),
      q("mt-15-q5", "What's driving the urgency to solve this now?", 5),
    ],
  },
];

/**
 * Find a mock template by ID
 */
export function findMockTemplateById(id: string): MockTemplate | undefined {
  return MOCK_TEMPLATES.find((t) => t.id === id);
}
