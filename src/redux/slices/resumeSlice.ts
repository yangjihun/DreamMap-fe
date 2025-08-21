import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Resume {
  id: string;
  title: string;
  lastModified: string;
  status: "draft" | "analyzed" | "completed";
  starred: boolean;
}

interface ResumeState {
  resumes: Resume[];
  loading: boolean;
  error: string | null;
}

const initialState: ResumeState = {
  resumes: [
    {
      id: "1",
      title: "프론트엔드 개발자 이력서",
      lastModified: "2024년 1월 15일",
      status: "analyzed",
      starred: true,
    },
    {
      id: "2",
      title: "풀스택 개발자 지원서",
      lastModified: "2024년 1월 10일",
      status: "draft",
      starred: false,
    },
  ],
  loading: false,
  error: null,
};

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    addResume: (state, action: PayloadAction<Resume>) => {
      state.resumes.push(action.payload);
    },
    updateResume: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Resume> }>
    ) => {
      const index = state.resumes.findIndex(
        (resume) => resume.id === action.payload.id
      );
      if (index !== -1) {
        state.resumes[index] = {
          ...state.resumes[index],
          ...action.payload.updates,
        };
      }
    },
    deleteResume: (state, action: PayloadAction<string>) => {
      state.resumes = state.resumes.filter(
        (resume) => resume.id !== action.payload
      );
    },
    toggleStar: (state, action: PayloadAction<string>) => {
      const resume = state.resumes.find((r) => r.id === action.payload);
      if (resume) {
        resume.starred = !resume.starred;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addResume,
  updateResume,
  deleteResume,
  toggleStar,
  setLoading,
  setError,
} = resumeSlice.actions;
export default resumeSlice.reducer;
