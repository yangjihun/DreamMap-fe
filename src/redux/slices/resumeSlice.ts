import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Resume, ResumeSession, ResumeItem } from "@/types/resume";
import api from "@/utils/api";

interface ResumeState {
  resumes: Resume[];
  resume: Resume | null;
  loading: boolean;
  error: string | null;
}

const initialState: ResumeState = {
  resumes: [
    {
      id: "1",
      userId: "user123",
      title: "프론트엔드 개발자 이력서",
      totalCount: 100,
      score: 85,
      status: "draft",
      starred: false,
      lastModified: "2024년 1월 15일",
      updatedAt: "2024년 1월 15일",
      sessions: [],
    },
    {
      id: "2",
      userId: "user123",
      title: "풀스택 개발자 지원서",
      totalCount: 150,
      score: 75,
      status: "draft",
      starred: false,
      lastModified: "2024년 1월 15일",
      updatedAt: "2024년 1월 15일",
      sessions: [],
    },
  ],
  resume: null,
  loading: false,
  error: null,
};

export const getResume = createAsyncThunk(
  "resume/getResume",
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await api.get(`/resume/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    toggleStar: (state, action: PayloadAction<string>) => {
      const index = state.resumes.findIndex(
        (resume) => resume.id === action.payload
      );
      if (index !== -1) {
        state.resumes[index].starred = !state.resumes[index].starred;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getResume.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getResume.fulfilled, (state, action) => {
      state.resume = action.payload;
      state.loading = false;
    });
    builder.addCase(getResume.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });
  },
});

export const {
  addResume,
  updateResume,
  deleteResume,
  setLoading,
  setError,
  toggleStar,
} = resumeSlice.actions;
export default resumeSlice.reducer;
