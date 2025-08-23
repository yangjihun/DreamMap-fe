export interface ResumeItem {
  title: string;
  text: string;
  startDate?: string;
  endDate?: string;
  review?: string;
}

export interface ResumeSession {
  key: "intro" | "body" | "closing";
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
  status: string;
  starred: boolean;
  lastModified: string;
  updatedAt: string;
}
