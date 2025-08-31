export interface ResumeItem {
  title: string;
  text: string;
  startDate?: string;
  endDate?: string;
  review?: string;
  company?: any;
  role?: any;
  companyAddress?: any;
  oldText?: string;
  companyOrRole?: string;
  degree?: string;
  GPA?: number;
}

export interface ResumeSession {
  key: string;
  title: string;
  items: ResumeItem[];
  wordCount: number;
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  totalCount: number;
  score: number;
  sessions: ResumeSession[];
  status: any;
  starred: boolean;
  updatedAt: string;
  review: string;
}

export interface ResumeState {
  resumes: Resume[];
  resume: Resume | null;
  loading: boolean;
  error: string | null;
  hasFeedbackResume?: boolean;
  isEdit: boolean;
}
