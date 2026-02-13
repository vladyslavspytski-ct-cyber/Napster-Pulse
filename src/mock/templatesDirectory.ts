export interface DirectoryTemplate {
  id: string;
  title: string;
  scenario: string;
  questionCount: number;
  tags?: string[];
  questions: string[];
}

export interface Subcategory {
  id: string;
  name: string;
  templates: DirectoryTemplate[];
}

export interface Category {
  id: string;
  name: string;
  icon: string; // lucide icon name hint
  subcategories: Subcategory[];
}

function t(
  id: string,
  title: string,
  scenario: string,
  questionCount: number,
  tags: string[],
  questions: string[],
): DirectoryTemplate {
  return { id, title, scenario, questionCount, tags, questions };
}

export const TEMPLATE_CATEGORIES: Category[] = [
  {
    id: "hiring",
    name: "Hiring",
    icon: "briefcase",
    subcategories: [
      {
        id: "hiring-technical",
        name: "Technical Roles",
        templates: [
          t("h1", "Senior Frontend Developer", "Assess React/TypeScript proficiency, system design thinking, and team collaboration skills.", 8, ["react", "typescript", "senior"], [
            "Walk me through a complex React component you've built recently.",
            "How do you approach performance optimization in a large SPA?",
            "Describe your experience with TypeScript generics and utility types.",
            "How do you handle state management at scale?",
            "Tell me about a time you mentored a junior developer.",
          ]),
          t("h2", "Backend Engineer (Go/Python)", "Evaluate backend architecture skills, API design, and database optimization experience.", 7, ["golang", "python", "backend"], [
            "How do you design a RESTful API from scratch?",
            "Describe your experience with concurrent programming.",
            "How do you approach database schema design?",
            "What's your strategy for handling high-traffic endpoints?",
            "Tell me about a production incident you helped resolve.",
          ]),
          t("h3", "DevOps / SRE", "Probe infrastructure-as-code expertise, CI/CD pipelines, and incident response capabilities.", 6, ["devops", "kubernetes", "ci-cd"], [
            "Walk me through your ideal CI/CD pipeline.",
            "How do you approach infrastructure as code?",
            "Describe your experience with Kubernetes in production.",
            "How do you handle on-call rotations and incident response?",
            "What monitoring and alerting tools have you used?",
          ]),
          t("h4", "Mobile Developer (iOS/Android)", "Assess native and cross-platform mobile development skills.", 7, ["mobile", "ios", "android"], [
            "What's your experience with native vs cross-platform development?",
            "How do you handle offline-first architectures?",
            "Describe your approach to mobile app performance optimization.",
            "How do you handle app store submission and review processes?",
            "Tell me about a challenging UI animation you've implemented.",
          ]),
          t("h5", "Data Engineer", "Evaluate data pipeline design, ETL processes, and big data tooling knowledge.", 6, ["data", "etl", "spark"], [
            "Walk me through a data pipeline you've designed.",
            "How do you ensure data quality in ETL processes?",
            "Describe your experience with streaming vs batch processing.",
            "How do you handle schema evolution in data lakes?",
            "What data governance practices have you implemented?",
          ]),
        ],
      },
      {
        id: "hiring-product",
        name: "Product & Design",
        templates: [
          t("h6", "Product Manager", "Evaluate strategic thinking, stakeholder management, and roadmap prioritization skills.", 8, ["product", "strategy"], [
            "How do you prioritize features on a product roadmap?",
            "Describe a product you launched from ideation to delivery.",
            "How do you gather and synthesize user feedback?",
            "Tell me about a difficult trade-off you had to make.",
            "How do you measure product success?",
          ]),
          t("h7", "UX Designer", "Assess design process, user research skills, and prototyping proficiency.", 7, ["design", "ux", "figma"], [
            "Walk me through your design process for a recent project.",
            "How do you conduct and synthesize user research?",
            "Describe your approach to design system creation.",
            "How do you handle stakeholder feedback that conflicts with user needs?",
            "What accessibility considerations do you prioritize?",
          ]),
          t("h8", "UX Researcher", "Evaluate research methodologies, synthesis skills, and impact on product decisions.", 6, ["research", "usability"], [
            "What research methods do you use most frequently and why?",
            "How do you recruit participants for studies?",
            "Describe how your research directly influenced a product decision.",
            "How do you present findings to cross-functional teams?",
            "What tools do you use for qualitative analysis?",
          ]),
        ],
      },
      {
        id: "hiring-leadership",
        name: "Leadership & Management",
        templates: [
          t("h9", "Engineering Manager", "Assess people management, technical strategy, and team scaling experience.", 8, ["management", "leadership"], [
            "How do you balance technical work with people management?",
            "Describe your approach to performance reviews.",
            "How do you handle underperforming team members?",
            "Tell me about a time you scaled a team rapidly.",
            "How do you foster a culture of psychological safety?",
          ]),
          t("h10", "VP of Engineering", "Evaluate organizational leadership, cross-functional alignment, and strategic vision.", 7, ["executive", "strategy"], [
            "How do you align engineering priorities with business goals?",
            "Describe your approach to technical debt management at an org level.",
            "How do you build and maintain engineering culture?",
            "Tell me about a major organizational change you led.",
            "How do you approach build vs buy decisions?",
          ]),
        ],
      },
    ],
  },
  {
    id: "onboarding",
    name: "Onboarding",
    icon: "rocket",
    subcategories: [
      {
        id: "onb-new-hire",
        name: "New Hire Check-ins",
        templates: [
          t("o1", "Day 30 Check-in", "Structured check-in to assess early integration, clarity of role, and initial blockers.", 6, ["30-day", "check-in"], [
            "How clear is your understanding of your role and responsibilities?",
            "What has surprised you most about the team or company?",
            "Do you have the tools and resources you need to be effective?",
            "How is your relationship with your manager developing?",
            "What questions do you still have about the company?",
          ]),
          t("o2", "Day 60 Check-in", "Mid-onboarding pulse to evaluate ramp-up progress, team integration, and support needs.", 6, ["60-day", "check-in"], [
            "How comfortable do you feel contributing independently?",
            "What processes or workflows are still unclear?",
            "How well do you feel integrated into the team culture?",
            "What additional training or support would help you?",
            "Are there any concerns you'd like to raise?",
          ]),
          t("o3", "Day 90 Review", "Comprehensive review of onboarding effectiveness and early performance indicators.", 7, ["90-day", "review"], [
            "How confident do you feel in your role after 90 days?",
            "What has been your biggest accomplishment so far?",
            "What aspects of onboarding could be improved?",
            "How aligned do you feel with team goals?",
            "What are your goals for the next quarter?",
          ]),
        ],
      },
      {
        id: "onb-culture",
        name: "Culture & Values",
        templates: [
          t("o4", "Values Alignment Interview", "Explore how well new hires connect with company values and mission.", 5, ["values", "culture"], [
            "Which company value resonates most with you and why?",
            "How do you see your work contributing to the company mission?",
            "Describe a situation where you demonstrated one of our values.",
            "What cultural aspects attracted you to this company?",
            "How can we better communicate our values in daily work?",
          ]),
        ],
      },
    ],
  },
  {
    id: "performance",
    name: "Performance",
    icon: "target",
    subcategories: [
      {
        id: "perf-reviews",
        name: "Performance Reviews",
        templates: [
          t("p1", "Quarterly Performance Review", "Structured quarterly review covering goals, achievements, and development areas.", 8, ["quarterly", "review"], [
            "What were your key accomplishments this quarter?",
            "Which goals did you fall short on and why?",
            "What skills have you developed recently?",
            "How effective has your collaboration been with the team?",
            "What are your priorities for next quarter?",
          ]),
          t("p2", "Annual Performance Review", "Comprehensive annual evaluation of performance, growth, and career trajectory.", 10, ["annual", "review"], [
            "How would you summarize your performance this year?",
            "What was your most impactful contribution?",
            "Where have you grown the most professionally?",
            "What challenges did you face and how did you overcome them?",
            "What are your career aspirations for the coming year?",
          ]),
          t("p3", "Peer Feedback Collection", "Gather structured peer feedback for 360-degree reviews.", 6, ["360", "peer-review"], [
            "How would you describe this person's strengths?",
            "In what areas could they improve?",
            "How effectively do they collaborate with the team?",
            "Describe a specific positive impact they've had.",
            "What advice would you give them for growth?",
          ]),
        ],
      },
      {
        id: "perf-goals",
        name: "Goal Setting",
        templates: [
          t("p4", "OKR Planning Session", "Guide managers and reports through objective and key result alignment.", 6, ["okr", "planning"], [
            "What are the top 3 objectives you want to achieve this quarter?",
            "How do these align with team and company goals?",
            "What key results will indicate success?",
            "What resources or support do you need?",
            "What potential obstacles do you foresee?",
          ]),
        ],
      },
    ],
  },
  {
    id: "product-research",
    name: "Product Research",
    icon: "search",
    subcategories: [
      {
        id: "pr-discovery",
        name: "Discovery Interviews",
        templates: [
          t("pr1", "Customer Discovery Interview", "Understand user pain points, workflows, and unmet needs for product ideation.", 8, ["discovery", "customer"], [
            "Walk me through a typical day in your role.",
            "What are the most frustrating parts of your current workflow?",
            "How do you currently solve this problem?",
            "What would an ideal solution look like for you?",
            "How much time/money does this problem cost you?",
          ]),
          t("pr2", "Feature Validation Interview", "Validate a specific feature concept with target users before building.", 6, ["validation", "feature"], [
            "How do you currently handle [specific task]?",
            "What would you expect this feature to do?",
            "How would this fit into your existing workflow?",
            "What concerns would you have about using this?",
            "Would you be willing to pay for this capability?",
          ]),
          t("pr3", "Competitor Analysis Interview", "Understand how users perceive and use competitor products.", 6, ["competitor", "analysis"], [
            "Which competing products have you tried?",
            "What do you like most about [competitor]?",
            "What frustrates you about [competitor]?",
            "Why did you switch from [competitor] or why haven't you?",
            "What features are missing from current solutions?",
          ]),
        ],
      },
      {
        id: "pr-usability",
        name: "Usability Testing",
        templates: [
          t("pr4", "Usability Test Script", "Moderated usability test with task-based scenarios and follow-up probes.", 7, ["usability", "testing"], [
            "Please try to complete [specific task] using the prototype.",
            "What did you expect to happen when you clicked that?",
            "On a scale of 1-5, how easy was that task?",
            "What confused you during the process?",
            "How would you improve this experience?",
          ]),
          t("pr5", "Post-Launch Feedback", "Collect structured feedback after a feature or product launch.", 6, ["post-launch", "feedback"], [
            "How has the new feature affected your workflow?",
            "What do you like most about the update?",
            "What issues have you encountered?",
            "How likely are you to recommend this to a colleague?",
            "What would you change about this feature?",
          ]),
        ],
      },
    ],
  },
  {
    id: "sales",
    name: "Sales",
    icon: "trending-up",
    subcategories: [
      {
        id: "sales-qual",
        name: "Lead Qualification",
        templates: [
          t("s1", "BANT Qualification", "Qualify leads using Budget, Authority, Need, and Timeline framework.", 6, ["bant", "qualification"], [
            "What budget have you allocated for this type of solution?",
            "Who else is involved in the decision-making process?",
            "What specific problem are you trying to solve?",
            "What's your timeline for implementing a solution?",
            "Have you evaluated any other solutions?",
          ]),
          t("s2", "Enterprise Discovery Call", "Deep-dive discovery for enterprise prospects to understand organizational needs.", 8, ["enterprise", "discovery"], [
            "Tell me about your organization's current challenges.",
            "How does your team currently handle this process?",
            "What would success look like for your organization?",
            "Who are the key stakeholders we should involve?",
            "What's driving the urgency to solve this now?",
          ]),
        ],
      },
      {
        id: "sales-cs",
        name: "Customer Success",
        templates: [
          t("s3", "Quarterly Business Review", "Structured QBR to assess customer health, ROI, and expansion opportunities.", 7, ["qbr", "retention"], [
            "How has our product impacted your key metrics?",
            "What goals did we help you achieve this quarter?",
            "Where are you still facing challenges?",
            "What upcoming initiatives could we support?",
            "How can we improve our partnership?",
          ]),
          t("s4", "Churn Risk Interview", "Identify at-risk customers and understand drivers of potential churn.", 6, ["churn", "retention"], [
            "How satisfied are you with the product overall?",
            "What features are you using the most/least?",
            "Have you considered any alternative solutions?",
            "What would need to change for you to continue using us?",
            "How can we better support your team?",
          ]),
        ],
      },
    ],
  },
  {
    id: "education",
    name: "Education",
    icon: "graduation-cap",
    subcategories: [
      {
        id: "edu-assessment",
        name: "Student Assessment",
        templates: [
          t("e1", "Oral Examination", "Structured oral exam to assess subject mastery and critical thinking.", 8, ["exam", "assessment"], [
            "Explain the core concept of [topic] in your own words.",
            "How does [concept A] relate to [concept B]?",
            "Can you give a real-world application of this theory?",
            "What are the limitations of this approach?",
            "How would you design an experiment to test this hypothesis?",
          ]),
          t("e2", "Thesis Defense Preparation", "Mock thesis defense questions to prepare graduate students.", 7, ["thesis", "graduate"], [
            "Summarize your research in two minutes.",
            "What gap in the literature does your work address?",
            "Justify your choice of methodology.",
            "What are the limitations of your findings?",
            "How does your work contribute to the field?",
          ]),
        ],
      },
      {
        id: "edu-feedback",
        name: "Course Feedback",
        templates: [
          t("e3", "End-of-Course Evaluation", "Collect student feedback on course content, teaching, and experience.", 6, ["evaluation", "course"], [
            "What was the most valuable thing you learned?",
            "How effective was the teaching methodology?",
            "What topics needed more depth or clarity?",
            "How would you rate the course materials?",
            "What would you change about the course?",
          ]),
        ],
      },
    ],
  },
  {
    id: "medical",
    name: "Medical",
    icon: "heart-pulse",
    subcategories: [
      {
        id: "med-intake",
        name: "Patient Intake",
        templates: [
          t("m1", "New Patient Intake", "Comprehensive patient intake interview covering history, symptoms, and lifestyle.", 10, ["intake", "patient"], [
            "What brings you in today?",
            "Can you describe your symptoms in detail?",
            "When did you first notice these symptoms?",
            "Do you have any existing medical conditions?",
            "Are you currently taking any medications?",
          ]),
          t("m2", "Mental Health Screening", "Initial mental health assessment covering mood, sleep, and daily functioning.", 8, ["mental-health", "screening"], [
            "How would you describe your mood over the past two weeks?",
            "How has your sleep been recently?",
            "Have you noticed changes in your appetite or energy?",
            "How are your daily activities and responsibilities going?",
            "Do you have a support system you can rely on?",
          ]),
        ],
      },
      {
        id: "med-followup",
        name: "Follow-up & Monitoring",
        templates: [
          t("m3", "Treatment Follow-up", "Structured follow-up to assess treatment effectiveness and side effects.", 6, ["follow-up", "treatment"], [
            "How have you been feeling since our last visit?",
            "Have you experienced any side effects?",
            "How consistently have you followed the treatment plan?",
            "What improvements have you noticed?",
            "Do you have any concerns about your current treatment?",
          ]),
        ],
      },
    ],
  },
  {
    id: "legal",
    name: "Legal",
    icon: "scale",
    subcategories: [
      {
        id: "legal-client",
        name: "Client Intake",
        templates: [
          t("l1", "Legal Client Intake", "Initial client consultation to understand case details and legal needs.", 8, ["intake", "consultation"], [
            "What legal matter do you need assistance with?",
            "Can you describe the situation in detail?",
            "What outcome are you hoping to achieve?",
            "Have you consulted with any other attorneys?",
            "Are there any deadlines or time-sensitive issues?",
          ]),
          t("l2", "Compliance Interview", "Internal compliance review interview for regulatory adherence.", 6, ["compliance", "regulatory"], [
            "Are you aware of the relevant regulations for your department?",
            "How does your team ensure compliance in daily operations?",
            "Have there been any compliance concerns or near-misses?",
            "What training have you received on compliance matters?",
            "How do you report potential compliance issues?",
          ]),
        ],
      },
    ],
  },
  {
    id: "journalism",
    name: "Journalism",
    icon: "newspaper",
    subcategories: [
      {
        id: "jour-interviews",
        name: "Source Interviews",
        templates: [
          t("j1", "Expert Source Interview", "Structured interview to gather expert insights on a specific topic.", 7, ["expert", "source"], [
            "Can you provide background on your expertise in this area?",
            "What's your perspective on [current issue]?",
            "What evidence supports your position?",
            "How does this compare to opposing viewpoints?",
            "What do you think the future holds for this issue?",
          ]),
          t("j2", "Human Interest Story", "Interview framework for personal narratives and human interest pieces.", 6, ["narrative", "human-interest"], [
            "Tell me about yourself and your background.",
            "How did you first get involved in this?",
            "What has been the most challenging part of your experience?",
            "What keeps you motivated?",
            "What message would you like people to take away?",
          ]),
        ],
      },
      {
        id: "jour-investigate",
        name: "Investigative",
        templates: [
          t("j3", "Investigative Interview", "Structured approach for investigative journalism interviews.", 7, ["investigative", "research"], [
            "Can you walk me through the timeline of events?",
            "Who else was involved or has knowledge of this?",
            "Do you have any documentation to support this?",
            "What motivated you to come forward?",
            "Is there anything you'd like to add that I haven't asked?",
          ]),
        ],
      },
    ],
  },
  {
    id: "leadership",
    name: "Leadership",
    icon: "crown",
    subcategories: [
      {
        id: "lead-360",
        name: "360 Feedback",
        templates: [
          t("ld1", "Leadership 360 Review", "Comprehensive 360-degree leadership assessment from multiple perspectives.", 8, ["360", "leadership"], [
            "How would you describe this leader's communication style?",
            "How effectively do they empower their team?",
            "How do they handle conflict and difficult conversations?",
            "What is their greatest strength as a leader?",
            "What one thing would most improve their leadership?",
          ]),
        ],
      },
      {
        id: "lead-coaching",
        name: "Coaching Sessions",
        templates: [
          t("ld2", "Executive Coaching Check-in", "Structured coaching conversation for senior leaders.", 6, ["coaching", "executive"], [
            "What's the biggest challenge you're facing right now?",
            "How aligned is your team with your strategic vision?",
            "What decisions are you currently struggling with?",
            "How are you managing your energy and well-being?",
            "What support do you need from your coach?",
          ]),
          t("ld3", "New Manager Coaching", "Coaching framework for first-time managers transitioning from IC roles.", 7, ["coaching", "new-manager"], [
            "How is the transition from individual contributor going?",
            "What's been the most surprising aspect of management?",
            "How are you building trust with your team?",
            "What management skills do you want to develop?",
            "How do you balance getting work done vs developing your team?",
          ]),
        ],
      },
    ],
  },
  {
    id: "dei",
    name: "DEI & Culture",
    icon: "users",
    subcategories: [
      {
        id: "dei-surveys",
        name: "Inclusion Surveys",
        templates: [
          t("d1", "Inclusion Climate Survey", "Assess employees' sense of belonging, fairness, and inclusion in the workplace.", 7, ["inclusion", "belonging"], [
            "How included do you feel in team decisions?",
            "Do you feel comfortable bringing your authentic self to work?",
            "How fairly do you feel opportunities are distributed?",
            "Have you witnessed or experienced any bias?",
            "What could we do to create a more inclusive environment?",
          ]),
        ],
      },
      {
        id: "dei-exit",
        name: "Exit Interviews",
        templates: [
          t("d2", "DEI-Focused Exit Interview", "Understand how diversity and inclusion factors contributed to an employee's departure.", 6, ["exit", "dei"], [
            "How would you describe the company's commitment to diversity?",
            "Did you feel your unique perspectives were valued?",
            "Were there any inclusion-related factors in your decision to leave?",
            "What could we improve for underrepresented employees?",
            "Would you recommend this company to someone from a similar background?",
          ]),
        ],
      },
    ],
  },
  {
    id: "exit",
    name: "Exit Interviews",
    icon: "door-open",
    subcategories: [
      {
        id: "exit-general",
        name: "General Exit",
        templates: [
          t("ex1", "Standard Exit Interview", "Comprehensive exit interview to understand reasons for departure and gather feedback.", 8, ["exit", "feedback"], [
            "What prompted your decision to leave?",
            "How would you describe your relationship with your manager?",
            "What did you enjoy most about working here?",
            "What would you change about the company?",
            "Would you consider returning in the future?",
          ]),
          t("ex2", "Manager Exit Interview", "Exit interview for departing managers to capture leadership insights.", 7, ["exit", "management"], [
            "What challenges did you face as a manager here?",
            "How supported did you feel by senior leadership?",
            "What tools or resources were you missing?",
            "How would you describe the management culture?",
            "What advice would you give your successor?",
          ]),
        ],
      },
    ],
  },
];

// Flatten helpers
export function getAllTemplates(): DirectoryTemplate[] {
  return TEMPLATE_CATEGORIES.flatMap((c) =>
    c.subcategories.flatMap((s) => s.templates),
  );
}

export function getTemplateCount(): number {
  return getAllTemplates().length;
}
