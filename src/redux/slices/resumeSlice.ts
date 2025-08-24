import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { Resume, ResumeSession } from "@/types/resume";

const toKRDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });

const computeStatus = (score: number): Resume["status"] =>
  score >= 80 ? "completed" : score >= 50 ? "analyzed" : "draft";

type BackendResume = Omit<Resume, "lastModified" | "status"> & { createdAt?: string };

const transform = (b: BackendResume): Resume => ({
  ...b,
  status: computeStatus(b.score),
  lastModified: toKRDate(b.updatedAt),
});

interface ResumeState {
  resumes: Resume[];
  resume: Resume | null;
  loading: boolean;
  error: string | null;
}

const initialState: ResumeState = {
  resumes: [],
  resume: null,
  loading: false,
  error: null,
};

// 전체 목록
export const fetchResumes = createAsyncThunk<Resume[], void, { rejectValue: string }>(
  "resume/fetchResumes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<{ status: string; data: BackendResume[] }>("/resume/all");
      return res.data.data.map(transform);
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message ?? "이력서 목록 로드 실패");
    }
  }
);

// 삭제
export const deleteResume = createAsyncThunk<string, string, { rejectValue: string }>(
  "resume/delete",
  async (resumeId, { rejectWithValue }) => {
    try {
      await api.delete(`/resume/${resumeId}`);
      return resumeId;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message ?? "이력서 삭제 실패");
    }
  }
);

// 제목 수정
export const updateResumeTitle = createAsyncThunk<
  { id: string; title: string },
  { id: string; title: string },
  { rejectValue: string }
>("resume/updateTitle", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.put<{ status: string; data: BackendResume }>(`/resume/${payload.id}`, {
      title: payload.title,
    });
    return { id: payload.id, title: res.data.data.title };
  } catch (e: any) {
    return rejectWithValue(e.response?.data?.message ?? "이력서 제목 수정 실패");
  }
});

// 상세 조회
export const getResume = createAsyncThunk<Resume, string, { rejectValue: string }>(
  "resume/fetchById",
  async (resumeId, { rejectWithValue }) => {
    try {
      console.log("상세 조회중");
      const res = await api.get<{ status: string; data: BackendResume }>(`/resume/${resumeId}`);
      console.log("상세 조회 성공");
      return transform(res.data.data);
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message ?? "이력서 조회 실패");
    }
  }
);

// 아이템 텍스트 수정
export const updateItemText = createAsyncThunk<
  { sessionKey: ResumeSession["key"]; itemIndex: number; text: string; title?: string },
  { resumeId: string; sessionKey: ResumeSession["key"]; itemIndex: number; text: string; title?: string },
  { rejectValue: string }
>("resume/updateItem", async (payload, { rejectWithValue }) => {
  try {
    const body: any = { text: payload.text };
    if (payload.title) body.title = payload.title;
    await api.put(`/resume/${payload.resumeId}/session/${payload.sessionKey}/item/${payload.itemIndex}`, body);
    return { sessionKey: payload.sessionKey, itemIndex: payload.itemIndex, text: payload.text, title: payload.title };
  } catch (e: any) {
    return rejectWithValue(e.response?.data?.message ?? "항목 수정 실패");
  }
});

// 세션 제목 수정
export const updateSessionTitle = createAsyncThunk<
  { sessionKey: ResumeSession["key"]; title: string },
  { resumeId: string; sessionKey: ResumeSession["key"]; title: string },
  { rejectValue: string }
>("resume/updateSessionTitle", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.put<{ status: string; data: { sessionKey: ResumeSession["key"]; title: string } }>(
      `/resume/${payload.resumeId}/session/${payload.sessionKey}`,
      { title: payload.title }
    );
    return res.data.data;
  } catch (e: any) {
    return rejectWithValue(e.response?.data?.message ?? "세션 제목 수정 실패");
  }
});

// 세션 삭제
export const deleteSession = createAsyncThunk<
  { sessionKey: ResumeSession["key"] },
  { resumeId: string; sessionKey: ResumeSession["key"] },
  { rejectValue: string }
>("resume/deleteSession", async (payload, { rejectWithValue }) => {
  try {
    await api.delete(`/resume/${payload.resumeId}/session/${payload.sessionKey}`);
    return { sessionKey: payload.sessionKey };
  } catch (e: any) {
    return rejectWithValue(e.response?.data?.message ?? "세션 삭제 실패");
  }
});

// 세션에 아이템 추가
export const addItemToSession = createAsyncThunk<
  Resume,
  {
    resumeId: string;
    sessionKey: ResumeSession["key"];
    text: string;
    itemTitle?: string;
    startDate?: string;
    endDate?: string;
    review?: string;
  },
  { rejectValue: string }
>("resume/addItemToSession", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post<{ status: string; data: BackendResume }>(
      `/resume/${payload.resumeId}/item`,
      {
        text: payload.text,
        sessionKey: payload.sessionKey,
        itemTitle: payload.itemTitle || "새 항목",
        startDate: payload.startDate,
        endDate: payload.endDate,
        review: payload.review,
      }
    );
    return transform(res.data.data);
  } catch (e: any) {
    return rejectWithValue(e.response?.data?.message ?? "아이템 추가 실패");
  }
});

// 즐겨찾기 토글
export const toggleStar = createAsyncThunk<
  { id: string; starred: boolean },
  string,
  { rejectValue: string }
>("resume/toggleStarred", async (resumeId, { rejectWithValue }) => {
  try {
    const res = await api.put<{ status: string; data: { id: string; starred: boolean } }>(
      `/resume/${resumeId}/star`
    );
    return res.data.data;
  } catch (e: any) {
    return rejectWithValue(e.response?.data?.message ?? "즐겨찾기 변경 실패");
  }
});

// 새 이력서 생성 (섹션별 입력)
export const createNewResumeWithSections = createAsyncThunk<
  Resume,
  {
    resumeTitle: string;
    sections: {
      intro?: { text: string; title?: string };
      body?: { text: string; title?: string };
      closing?: { text: string; title?: string };
    };
  },
  { rejectValue: string }
>("resume/createNewWithSections", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post<{ status: string; data: BackendResume }>(
      "/resume/new/sections",
      { resumeTitle: payload.resumeTitle, sections: payload.sections }
    );
    return transform(res.data.data);
  } catch (e: any) {
    return rejectWithValue(e.response?.data?.message ?? "이력서 생성 실패");
  }
});

// 새 이력서 생성 (파일 업로드)
export const createNewResumeFromFile = createAsyncThunk<
  Resume,
  { file: File; sessionKey?: ResumeSession["key"]; itemTitle?: string; resumeTitle: string },
  { rejectValue: string }
>("resume/createNewFromFile", async (payload, { rejectWithValue }) => {
  try {
    const form = new FormData();
    form.append("file", payload.file);
    form.append("sessionKey", payload.sessionKey || "intro");
    form.append("resumeTitle", payload.resumeTitle);
    if (payload.itemTitle) form.append("itemTitle", payload.itemTitle);

    const res = await api.post<{ status: string; data: BackendResume }>(
      "/resume/new",
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return transform(res.data.data);
  } catch (e: any) {
    return rejectWithValue(e.response?.data?.message ?? "이력서 생성(파일) 실패");
  }
});

export const getAiReview = createAsyncThunk<Resume, string, { rejectValue: string }>(
  "resume/getAiReview",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.post<{ status: string; data: BackendResume }>(`/gemini/review/${id}`);
      return transform(res.data.data);
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message ?? "AI 리뷰 실패");
    }
  }
);

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    addResume: (state, action: PayloadAction<Resume>) => {
      state.resumes.unshift(action.payload);
    },
    updateResume: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Resume> }>
    ) => {
      const idx = state.resumes.findIndex(r => r.id === action.payload.id);
      if (idx !== -1) state.resumes[idx] = { ...state.resumes[idx], ...action.payload.updates };
      if (state.resume?.id === action.payload.id) {
        state.resume = { ...state.resume, ...action.payload.updates };
      }
    },
    deleteResumeLocal: (state, action: PayloadAction<string>) => {
      state.resumes = state.resumes.filter(r => r.id !== action.payload);
      if (state.resume?.id === action.payload) state.resume = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => { state.loading = action.payload; },
    setError: (state, action: PayloadAction<string | null>) => { state.error = action.payload; },
    clearResume: (state) => {
      state.resume = null;
    }
  },
  extraReducers: (builder) => {
    const thunks = [
      fetchResumes, deleteResume, updateResumeTitle, getResume,
      updateItemText, updateSessionTitle, deleteSession, addItemToSession,
      toggleStar, createNewResumeWithSections, createNewResumeFromFile,
      getAiReview,
    ];

    thunks.forEach((thunk) => {
      builder.addCase(thunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(thunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    });

    builder.addCase(fetchResumes.fulfilled, (state, action) => {
      state.loading = false;
      state.resumes = action.payload;
    });

    builder.addCase(deleteResume.fulfilled, (state, action) => {
      state.loading = false;
      state.resumes = state.resumes.filter(r => r.id !== action.payload);
      if (state.resume?.id === action.payload) state.resume = null;
    });

    builder.addCase(updateResumeTitle.fulfilled, (state, action) => {
      state.loading = false;
      const r = state.resumes.find(x => x.id === action.payload.id);
      if (r) r.title = action.payload.title;
      if (state.resume?.id === action.payload.id) {
        state.resume.title = action.payload.title;
        state.resume.updatedAt = new Date().toISOString();
        state.resume.lastModified = toKRDate(state.resume.updatedAt);
      }
    });

    builder.addCase(getResume.fulfilled, (state, action) => {
      state.loading = false;
      state.resume = action.payload;
    });

    builder.addCase(updateItemText.fulfilled, (state, action) => {
      state.loading = false;
      if (!state.resume) return;
      const session = state.resume.sessions.find(x => x.key === action.payload.sessionKey);
      if (session?.items[action.payload.itemIndex]) {
        const item = session.items[action.payload.itemIndex];
        item.text = action.payload.text;
        if (action.payload.title) item.title = action.payload.title;
        state.resume.updatedAt = new Date().toISOString();
        state.resume.lastModified = toKRDate(state.resume.updatedAt);
      }
    });

    builder.addCase(updateSessionTitle.fulfilled, (state, action) => {
      state.loading = false;
      if (!state.resume) return;
      const session = state.resume.sessions.find(x => x.key === action.payload.sessionKey);
      if (session) {
        session.title = action.payload.title;
        state.resume.updatedAt = new Date().toISOString();
        state.resume.lastModified = toKRDate(state.resume.updatedAt);
      }
    });

    builder.addCase(deleteSession.fulfilled, (state, action) => {
      state.loading = false;
      if (!state.resume) return;
      state.resume.sessions = state.resume.sessions.filter(x => x.key !== action.payload.sessionKey);
      state.resume.updatedAt = new Date().toISOString();
      state.resume.lastModified = toKRDate(state.resume.updatedAt);
    });

    builder.addCase(addItemToSession.fulfilled, (state, action) => {
      state.loading = false;
      const updated = action.payload;
      state.resume = updated;
      const idx = state.resumes.findIndex(r => r.id === updated.id);
      if (idx !== -1) state.resumes[idx] = updated;
      else state.resumes.unshift(updated);
    });

    builder.addCase(toggleStar.fulfilled, (state, action) => {
      state.loading = false;
      const r = state.resumes.find(x => x.id === action.payload.id);
      if (r) r.starred = action.payload.starred;
      if (state.resume?.id === action.payload.id) state.resume.starred = action.payload.starred;
    });

    builder.addCase(createNewResumeWithSections.fulfilled, (state, action) => {
      state.loading = false;
      state.resume = action.payload;
      state.resumes.unshift(action.payload);
    });

    builder.addCase(createNewResumeFromFile.fulfilled, (state, action) => {
      state.loading = false;
      state.resume = action.payload;
      state.resumes.unshift(action.payload);
    });

    builder.addCase(getAiReview.fulfilled, (state, action) => {
      state.loading = false;
      // 서버가 리뷰가 반영된 최신 Resume 전체를 반환한다고 가정
      const updated = action.payload;
      state.resume = updated;
      const idx = state.resumes.findIndex(r => r.id === updated.id);
      if (idx !== -1) state.resumes[idx] = updated;
      else state.resumes.unshift(updated);
    });
  },
});

export const { addResume, updateResume, deleteResumeLocal, setLoading, setError, clearResume } =
  resumeSlice.actions;

export default resumeSlice.reducer;
