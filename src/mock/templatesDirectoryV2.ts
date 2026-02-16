/**
 * V2 Template Directory mock data.
 * Shape: Category → InterviewType → Question (+ optional followups).
 * Designed for the 3-step directory browsing experience.
 */

export interface FollowUpQuestion {
  id: string;
  text: string;
}

export interface InterviewQuestion {
  id: string;
  text: string;
  order: number;
  followups?: FollowUpQuestion[];
}

export interface InterviewType {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  followupCount: number;
  tags?: string[];
  questions: InterviewQuestion[];
}

export interface TemplateCategory {
  id: string;
  title: string;
  description: string;
  emoji: string;
  accentColor: string; // tailwind gradient classes
  typeCount: number;
  questionCount: number;
  interviewTypes: InterviewType[];
}

/* ── helpers ──────────────────────────────────────────────── */

let _qid = 0;
function q(text: string, followups?: string[]): InterviewQuestion {
  _qid++;
  return {
    id: `q-${_qid}`,
    text,
    order: _qid,
    followups: followups?.map((f, i) => ({ id: `q-${_qid}-f${i + 1}`, text: f })),
  };
}

function buildType(
  id: string,
  title: string,
  description: string,
  tags: string[],
  questions: InterviewQuestion[],
): InterviewType {
  const followupCount = questions.reduce((n, qq) => n + (qq.followups?.length ?? 0), 0);
  return { id, title, description, questionCount: questions.length, followupCount, tags, questions };
}

function buildCategory(
  id: string,
  title: string,
  description: string,
  emoji: string,
  accentColor: string,
  types: InterviewType[],
): TemplateCategory {
  const questionCount = types.reduce((n, t) => n + t.questionCount, 0);
  return { id, title, description, emoji, accentColor, typeCount: types.length, questionCount, interviewTypes: types };
}

/* ── Data ─────────────────────────────────────────────────── */

export const TEMPLATE_CATEGORIES_V2: TemplateCategory[] = [
  buildCategory("hiring", "Hiring & Recruitment", "Interview templates for technical, product, and leadership roles.", "💼", "from-blue-500/15 to-blue-600/5", [
    buildType("hire-frontend", "Senior Frontend Developer", "Assess React/TypeScript proficiency, system design, and collaboration.", ["react", "typescript", "senior"], [
      q("Walk me through a complex React component you've built recently.", ["What trade-offs did you make?", "How did you test it?"]),
      q("How do you approach performance optimization in a large SPA?", ["Can you give a specific example?"]),
      q("Describe your experience with TypeScript generics and utility types."),
      q("How do you handle state management at scale?", ["What tools have you used?"]),
      q("Tell me about a time you mentored a junior developer."),
      q("How do you approach component testing strategies?", ["Unit vs integration — how do you decide?"]),
    ]),
    buildType("hire-backend", "Backend Engineer (Go/Python)", "Evaluate backend architecture, API design, and database skills.", ["golang", "python", "backend"], [
      q("How do you design a RESTful API from scratch?", ["How do you handle versioning?"]),
      q("Describe your experience with concurrent programming."),
      q("How do you approach database schema design?", ["How do you handle migrations?"]),
      q("What's your strategy for handling high-traffic endpoints?"),
      q("Tell me about a production incident you helped resolve.", ["What was the root cause?"]),
    ]),
    buildType("hire-devops", "DevOps / SRE", "Probe IaC expertise, CI/CD pipelines, and incident response.", ["devops", "kubernetes", "ci-cd"], [
      q("Walk me through your ideal CI/CD pipeline.", ["How do you handle rollbacks?"]),
      q("How do you approach infrastructure as code?"),
      q("Describe your experience with Kubernetes in production.", ["How do you handle scaling?"]),
      q("How do you handle on-call rotations and incident response?"),
      q("What monitoring and alerting tools have you used?"),
    ]),
    buildType("hire-pm", "Product Manager", "Evaluate strategic thinking, stakeholder management, and prioritization.", ["product", "strategy"], [
      q("How do you prioritize features on a product roadmap?", ["What frameworks do you use?"]),
      q("Describe a product you launched from ideation to delivery."),
      q("How do you gather and synthesize user feedback?"),
      q("Tell me about a difficult trade-off you had to make."),
      q("How do you measure product success?", ["What metrics matter most?"]),
    ]),
    buildType("hire-designer", "UX Designer", "Assess design process, user research, and prototyping proficiency.", ["design", "ux", "figma"], [
      q("Walk me through your design process for a recent project."),
      q("How do you conduct and synthesize user research?", ["What methods do you prefer?"]),
      q("Describe your approach to design system creation."),
      q("How do you handle stakeholder feedback that conflicts with user needs?"),
      q("What accessibility considerations do you prioritize?"),
    ]),
    buildType("hire-eng-manager", "Engineering Manager", "Assess people management, technical strategy, and team scaling.", ["management", "leadership"], [
      q("How do you balance technical work with people management?"),
      q("Describe your approach to performance reviews.", ["How do you handle difficult feedback?"]),
      q("How do you handle underperforming team members?"),
      q("Tell me about a time you scaled a team rapidly."),
      q("How do you foster a culture of psychological safety?"),
    ]),
  ]),

  buildCategory("onboarding", "Onboarding & Integration", "Check-in templates for new hires at every stage of onboarding.", "🚀", "from-emerald-500/15 to-emerald-600/5", [
    buildType("onb-day30", "Day 30 Check-in", "Early integration assessment covering role clarity and initial blockers.", ["30-day", "check-in"], [
      q("How clear is your understanding of your role and responsibilities?", ["What's still unclear?"]),
      q("What has surprised you most about the team or company?"),
      q("Do you have the tools and resources you need to be effective?"),
      q("How is your relationship with your manager developing?"),
      q("What questions do you still have about the company?"),
    ]),
    buildType("onb-day60", "Day 60 Check-in", "Mid-onboarding pulse on ramp-up progress and team integration.", ["60-day", "check-in"], [
      q("How comfortable do you feel contributing independently?"),
      q("What processes or workflows are still unclear?"),
      q("How well do you feel integrated into the team culture?"),
      q("What additional training or support would help you?"),
      q("Are there any concerns you'd like to raise?"),
    ]),
    buildType("onb-day90", "Day 90 Review", "Comprehensive review of onboarding effectiveness and early performance.", ["90-day", "review"], [
      q("How confident do you feel in your role after 90 days?"),
      q("What has been your biggest accomplishment so far?", ["What made it possible?"]),
      q("What aspects of onboarding could be improved?"),
      q("How aligned do you feel with team goals?"),
      q("What are your goals for the next quarter?"),
    ]),
    buildType("onb-values", "Values Alignment Interview", "Explore how well new hires connect with company values.", ["values", "culture"], [
      q("Which company value resonates most with you and why?"),
      q("How do you see your work contributing to the company mission?"),
      q("Describe a situation where you demonstrated one of our values."),
      q("What cultural aspects attracted you to this company?"),
    ]),
  ]),

  buildCategory("performance", "Performance & Growth", "Templates for reviews, goal setting, and manager check-ins.", "🎯", "from-orange-500/15 to-orange-600/5", [
    buildType("perf-quarterly", "Quarterly Performance Review", "Structured quarterly review covering goals and achievements.", ["quarterly", "review"], [
      q("What were your key accomplishments this quarter?", ["Which had the most impact?"]),
      q("Which goals did you fall short on and why?"),
      q("What skills have you developed recently?"),
      q("How effective has your collaboration been with the team?"),
      q("What are your priorities for next quarter?"),
    ]),
    buildType("perf-annual", "Annual Performance Review", "Comprehensive annual evaluation of performance and growth.", ["annual", "review"], [
      q("How would you summarize your performance this year?"),
      q("What was your most impactful contribution?", ["How did you measure impact?"]),
      q("Where have you grown the most professionally?"),
      q("What challenges did you face and how did you overcome them?"),
      q("What are your career aspirations for the coming year?"),
    ]),
    buildType("perf-1on1", "Manager 1:1 Check-in", "Address engagement, blockers, and foster open communication.", ["1-on-1", "check-in"], [
      q("How are you doing this week — not just work, but overall?"),
      q("What's been your biggest win since we last talked?"),
      q("What's getting in the way of you doing your best work right now?"),
      q("How are you feeling about your career trajectory here?"),
      q("Is there anything I'm doing — or not doing — that's making your job harder?"),
    ]),
    buildType("perf-okr", "OKR Planning Session", "Guide managers and reports through objective and key result alignment.", ["okr", "planning"], [
      q("What are the top 3 objectives you want to achieve this quarter?"),
      q("How do these align with team and company goals?"),
      q("What key results will indicate success?", ["How will you track them?"]),
      q("What resources or support do you need?"),
      q("What potential obstacles do you foresee?"),
    ]),
  ]),

  buildCategory("product-research", "Product Research", "Templates for customer discovery, usability testing, and feedback.", "🔍", "from-violet-500/15 to-violet-600/5", [
    buildType("pr-discovery", "Customer Discovery Interview", "Understand user pain points, workflows, and unmet needs.", ["discovery", "customer"], [
      q("Walk me through a typical day in your role.", ["What takes the most time?"]),
      q("What are the most frustrating parts of your current workflow?"),
      q("How do you currently solve this problem?", ["What tools do you use?"]),
      q("What would an ideal solution look like for you?"),
      q("How much time/money does this problem cost you?"),
    ]),
    buildType("pr-feature", "Feature Validation Interview", "Validate a specific feature concept with target users.", ["validation", "feature"], [
      q("How do you currently handle [specific task]?"),
      q("What would you expect this feature to do?"),
      q("How would this fit into your existing workflow?", ["Would it replace anything?"]),
      q("What concerns would you have about using this?"),
      q("Would you be willing to pay for this capability?"),
    ]),
    buildType("pr-usability", "Usability Test Script", "Moderated usability test with task-based scenarios.", ["usability", "testing"], [
      q("Please try to complete [specific task] using the prototype."),
      q("What did you expect to happen when you clicked that?"),
      q("On a scale of 1-5, how easy was that task?", ["What would make it easier?"]),
      q("What confused you during the process?"),
      q("How would you improve this experience?"),
    ]),
    buildType("pr-competitor", "Competitor Analysis Interview", "Understand how users perceive and use competitor products.", ["competitor", "analysis"], [
      q("Which competing products have you tried?"),
      q("What do you like most about [competitor]?"),
      q("What frustrates you about [competitor]?"),
      q("Why did you switch from [competitor] or why haven't you?"),
      q("What features are missing from current solutions?"),
    ]),
  ]),

  buildCategory("sales", "Sales & Success", "Lead qualification, discovery calls, and customer success reviews.", "📈", "from-rose-500/15 to-rose-600/5", [
    buildType("sales-bant", "BANT Lead Qualification", "Qualify leads using Budget, Authority, Need, and Timeline.", ["bant", "qualification"], [
      q("What budget have you allocated for this type of solution?"),
      q("Who else is involved in the decision-making process?", ["Who has final sign-off?"]),
      q("What specific problem are you trying to solve?"),
      q("What's your timeline for implementing a solution?"),
      q("Have you evaluated any other solutions?"),
    ]),
    buildType("sales-enterprise", "Enterprise Discovery Call", "Deep-dive discovery for enterprise prospects.", ["enterprise", "discovery"], [
      q("Tell me about your organization's current challenges."),
      q("How does your team currently handle this process?"),
      q("What would success look like for your organization?", ["How do you measure it today?"]),
      q("Who are the key stakeholders we should involve?"),
      q("What's driving the urgency to solve this now?"),
    ]),
    buildType("sales-qbr", "Quarterly Business Review", "Structured QBR to assess customer health and expansion.", ["qbr", "retention"], [
      q("How has our product impacted your key metrics?"),
      q("What goals did we help you achieve this quarter?"),
      q("Where are you still facing challenges?"),
      q("What upcoming initiatives could we support?"),
      q("How can we improve our partnership?"),
    ]),
    buildType("sales-churn", "Churn Risk Interview", "Identify at-risk customers and understand churn drivers.", ["churn", "retention"], [
      q("How satisfied are you with the product overall?"),
      q("What features are you using the most/least?"),
      q("Have you considered any alternative solutions?", ["What attracted you to them?"]),
      q("What would need to change for you to continue using us?"),
      q("How can we better support your team?"),
    ]),
  ]),

  buildCategory("education", "Education & Assessment", "Oral exams, thesis prep, and course evaluations.", "🎓", "from-cyan-500/15 to-cyan-600/5", [
    buildType("edu-oral", "Oral Examination", "Structured oral exam to assess subject mastery and critical thinking.", ["exam", "assessment"], [
      q("Explain the core concept of [topic] in your own words.", ["Can you simplify it further?"]),
      q("How does [concept A] relate to [concept B]?"),
      q("Can you give a real-world application of this theory?"),
      q("What are the limitations of this approach?"),
      q("How would you design an experiment to test this hypothesis?"),
    ]),
    buildType("edu-thesis", "Thesis Defense Preparation", "Mock thesis defense questions for graduate students.", ["thesis", "graduate"], [
      q("Summarize your research in two minutes."),
      q("What gap in the literature does your work address?"),
      q("Justify your choice of methodology.", ["What alternatives did you consider?"]),
      q("What are the limitations of your findings?"),
      q("How does your work contribute to the field?"),
    ]),
    buildType("edu-course", "End-of-Course Evaluation", "Collect student feedback on course content and teaching.", ["evaluation", "course"], [
      q("What was the most valuable thing you learned?"),
      q("How effective was the teaching methodology?"),
      q("What topics needed more depth or clarity?"),
      q("How would you rate the course materials?"),
      q("What would you change about the course?"),
    ]),
  ]),

  buildCategory("medical", "Medical & Health", "Patient intake, mental health screening, and treatment follow-ups.", "🏥", "from-pink-500/15 to-pink-600/5", [
    buildType("med-intake", "New Patient Intake", "Comprehensive intake covering history, symptoms, and lifestyle.", ["intake", "patient"], [
      q("What brings you in today?"),
      q("Can you describe your symptoms in detail?", ["When are they worst?"]),
      q("When did you first notice these symptoms?"),
      q("Do you have any existing medical conditions?"),
      q("Are you currently taking any medications?"),
    ]),
    buildType("med-mental", "Mental Health Screening", "Initial assessment covering mood, sleep, and daily functioning.", ["mental-health", "screening"], [
      q("How would you describe your mood over the past two weeks?"),
      q("How has your sleep been recently?", ["Any changes in pattern?"]),
      q("Have you noticed changes in your appetite or energy?"),
      q("How are your daily activities and responsibilities going?"),
      q("Do you have a support system you can rely on?"),
    ]),
    buildType("med-followup", "Treatment Follow-up", "Assess treatment effectiveness and side effects.", ["follow-up", "treatment"], [
      q("How have you been feeling since our last visit?"),
      q("Have you experienced any side effects?"),
      q("How consistently have you followed the treatment plan?"),
      q("What improvements have you noticed?"),
      q("Do you have any concerns about your current treatment?"),
    ]),
  ]),

  buildCategory("journalism", "Journalism & Media", "Templates for expert, investigative, and human interest interviews.", "📰", "from-amber-500/15 to-amber-600/5", [
    buildType("jour-expert", "Expert Source Interview", "Gather expert insights on a specific topic.", ["expert", "source"], [
      q("Can you provide background on your expertise in this area?"),
      q("What's your perspective on [current issue]?", ["What evidence supports that?"]),
      q("How does this compare to opposing viewpoints?"),
      q("What do you think the future holds for this issue?"),
    ]),
    buildType("jour-investigative", "Investigative Interview", "Structured approach for investigative journalism.", ["investigative", "research"], [
      q("Can you walk me through the timeline of events?"),
      q("Who else was involved or has knowledge of this?"),
      q("Do you have any documentation to support this?", ["Can we access it?"]),
      q("What motivated you to come forward?"),
      q("Is there anything you'd like to add that I haven't asked?"),
    ]),
    buildType("jour-human", "Human Interest Story", "Interview framework for personal narratives.", ["narrative", "human-interest"], [
      q("Tell me about yourself and your background."),
      q("How did you first get involved in this?"),
      q("What has been the most challenging part?"),
      q("What keeps you motivated?"),
      q("What message would you like people to take away?"),
    ]),
  ]),

  buildCategory("exit", "Exit & Offboarding", "Capture departure insights and improve retention.", "🚪", "from-red-500/15 to-red-600/5", [
    buildType("exit-standard", "Standard Exit Interview", "Understand reasons for departure and gather feedback.", ["exit", "feedback"], [
      q("What prompted your decision to leave?", ["Was there a specific event?"]),
      q("How would you describe your relationship with your manager?"),
      q("What did you enjoy most about working here?"),
      q("What would you change about the company?"),
      q("Would you consider returning in the future?"),
      q("What advice would you give your successor?"),
    ]),
    buildType("exit-manager", "Manager Exit Interview", "Capture leadership insights from departing managers.", ["exit", "management"], [
      q("What challenges did you face as a manager here?"),
      q("How supported did you feel by senior leadership?"),
      q("What tools or resources were you missing?"),
      q("How would you describe the management culture?"),
      q("What advice would you give your successor?"),
    ]),
    buildType("exit-dei", "DEI-Focused Exit Interview", "Understand how diversity/inclusion factors contributed to departure.", ["exit", "dei"], [
      q("How would you describe the company's commitment to diversity?"),
      q("Did you feel your unique perspectives were valued?", ["Can you give an example?"]),
      q("Were there any inclusion-related factors in your decision to leave?"),
      q("What could we improve for underrepresented employees?"),
      q("Would you recommend this company to someone from a similar background?"),
    ]),
  ]),

  buildCategory("leadership", "Leadership & Coaching", "360 reviews, executive coaching, and new manager support.", "👑", "from-yellow-500/15 to-yellow-600/5", [
    buildType("lead-360", "Leadership 360 Review", "Comprehensive 360-degree leadership assessment.", ["360", "leadership"], [
      q("How would you describe this leader's communication style?"),
      q("How effectively do they empower their team?", ["Give a specific example."]),
      q("How do they handle conflict and difficult conversations?"),
      q("What is their greatest strength as a leader?"),
      q("What one thing would most improve their leadership?"),
    ]),
    buildType("lead-exec-coaching", "Executive Coaching Check-in", "Structured coaching conversation for senior leaders.", ["coaching", "executive"], [
      q("What's the biggest challenge you're facing right now?"),
      q("How aligned is your team with your strategic vision?"),
      q("What decisions are you currently struggling with?"),
      q("How are you managing your energy and well-being?"),
      q("What support do you need from your coach?"),
    ]),
    buildType("lead-new-manager", "New Manager Coaching", "Coaching framework for first-time managers.", ["coaching", "new-manager"], [
      q("How is the transition from individual contributor going?"),
      q("What's been the most surprising aspect of management?"),
      q("How are you building trust with your team?", ["What has worked so far?"]),
      q("What management skills do you want to develop?"),
      q("How do you balance doing work vs developing your team?"),
    ]),
  ]),

  buildCategory("legal", "Legal & Compliance", "Client intake and compliance review interviews.", "⚖️", "from-slate-500/15 to-slate-600/5", [
    buildType("legal-intake", "Legal Client Intake", "Initial consultation to understand case details and needs.", ["intake", "consultation"], [
      q("What legal matter do you need assistance with?"),
      q("Can you describe the situation in detail?", ["Are there documents I should review?"]),
      q("What outcome are you hoping to achieve?"),
      q("Have you consulted with any other attorneys?"),
      q("Are there any deadlines or time-sensitive issues?"),
    ]),
    buildType("legal-compliance", "Compliance Interview", "Internal compliance review for regulatory adherence.", ["compliance", "regulatory"], [
      q("Are you aware of the relevant regulations for your department?"),
      q("How does your team ensure compliance in daily operations?"),
      q("Have there been any compliance concerns or near-misses?"),
      q("What training have you received on compliance matters?"),
      q("How do you report potential compliance issues?"),
    ]),
  ]),
];

/* ── Public helpers ───────────────────────────────────────── */

export function getAllInterviewTypes(): InterviewType[] {
  return TEMPLATE_CATEGORIES_V2.flatMap((c) => c.interviewTypes);
}

export function findCategoryById(id: string): TemplateCategory | undefined {
  return TEMPLATE_CATEGORIES_V2.find((c) => c.id === id);
}

export function findInterviewTypeById(typeId: string): InterviewType | undefined {
  for (const cat of TEMPLATE_CATEGORIES_V2) {
    const found = cat.interviewTypes.find((t) => t.id === typeId);
    if (found) return found;
  }
  return undefined;
}

export function findCategoryForType(typeId: string): TemplateCategory | undefined {
  return TEMPLATE_CATEGORIES_V2.find((c) => c.interviewTypes.some((t) => t.id === typeId));
}
