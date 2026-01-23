export interface StoredInterview {
  id: string;
  title: string;
  questions: { id: string; text: string }[];
  token: string;
  publicUrl: string;
  createdAt: string;
}

const STORAGE_KEY = "interu_interviews";

export const generateInterviewId = (): string => {
  return `int_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
};

export const generateToken = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

export const saveInterview = (interview: StoredInterview): void => {
  const existing = getInterviews();
  existing.push(interview);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
};

export const getInterviews = (): StoredInterview[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const getInterviewByToken = (token: string): StoredInterview | null => {
  const interviews = getInterviews();
  return interviews.find((i) => i.token === token) || null;
};
