import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { Resume, ResumeSession, ResumeState } from "@/types/resume";

const initialState: ResumeState = {
  resumes: [],
  resume: null,
  loading: false,
  error: null,
  hasFeedbackResume: false,
  isEdit: false,
};

const sortResumes = (list: Resume[]) =>
  // 이력서 정렬(즐겨찾기 우선, updateAt 최신순)
  list.slice().sort((a, b) => {
    if (a.starred !== b.starred) return a.starred ? -1 : 1;
    // updateAt 내림차순
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

// 전체 목록
export const fetchResumes = createAsyncThunk<
  Resume[],
  { name?: string } | undefined,
  { rejectValue: string }
>("resume/fetchResumes", async (query: any, { rejectWithValue }) => {
  try {
    const res = await api.get("/resume/all", { params: { ...(query || {}) } });
    return sortResumes(res.data.data as Resume[]);
  } catch (e: any) {
    return rejectWithValue(
      e.response?.data?.message ?? "이력서 목록 로드 실패"
    );
  }
});

// 삭제
export const deleteResume = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("resume/delete", async (resumeId, { rejectWithValue }) => {
  try {
    await api.delete(`/resume/${resumeId}`);
    return resumeId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? "이력서 삭제 실패");
  }
});

// 상세 조회
export const getResume = createAsyncThunk<
  Resume,
  string,
  { rejectValue: string }
>("resume/fetchById", async (resumeId, { rejectWithValue }) => {
  try {
    console.log("상세 조회중");
    const res = await api.get(`/resume/${resumeId}`);
    console.log("상세 조회 성공");
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? "이력서 조회 실패");
  }
});

// 아이템 텍스트 수정
export const updateItemText = createAsyncThunk<
  {
    sessionKey: ResumeSession["key"];
    itemIndex: number;
    text: string;
    title?: string;
  },
  {
    resumeId: string;
    sessionKey: ResumeSession["key"];
    itemIndex: number;
    text: string;
    title?: string;
  },
  { rejectValue: string }
>("resume/updateItem", async (payload, { rejectWithValue }) => {
  try {
    const body: any = { text: payload.text };
    if (payload.title) body.title = payload.title;
    await api.put(
      `/resume/${payload.resumeId}/session/${payload.sessionKey}/item/${payload.itemIndex}`,
      body
    );
    return {
      sessionKey: payload.sessionKey,
      itemIndex: payload.itemIndex,
      text: payload.text,
      title: payload.title,
    };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? "항목 수정 실패");
  }
});

// 세션 제목 수정
export const updateSessionTitle = createAsyncThunk<
  { sessionKey: ResumeSession["key"]; title: string },
  { resumeId: string; sessionKey: ResumeSession["key"]; title: string },
  { rejectValue: string }
>("resume/updateSessionTitle", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.put(
      `/resume/${payload.resumeId}/session/${payload.sessionKey}`,
      { title: payload.title }
    );
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ?? "세션 제목 수정 실패"
    );
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
    companyAddress?: string;
    startDate?: string;
    endDate?: string;
    review?: string;
  },
  { rejectValue: string }
>("resume/addItemToSession", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post(`/resume/${payload.resumeId}/item`, {
      text: payload.text,
      sessionKey: payload.sessionKey,
      itemTitle: payload.itemTitle || "새 항목",
      companyAddress: payload.companyAddress,
      startDate: payload.startDate,
      endDate: payload.endDate,
      review: payload.review,
    });
    console.log(payload);
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? "아이템 추가 실패");
  }
});

// 즐겨찾기 토글
export const toggleStar = createAsyncThunk<
  Resume,
  string,
  { rejectValue: string }
>("resume/toggleStarred", async (resumeId, { rejectWithValue }) => {
  try {
    const res = await api.put(`/resume/${resumeId}/star`);
    return res.data.data as Resume;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ?? "즐겨찾기 변경 실패"
    );
  }
});

// 새 이력서 생성 (섹션별 입력)
export const createNewResumeWithSections = createAsyncThunk<
  Resume,
  {
    resumeTitle: string;
    sections: Record<
      string,
      {
        title: string;
        items: Array<{ title: string; text: string }>;
      }
    >;
  },
  { rejectValue: string }
>("resume/createNewWithSections", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post("/resume/new/sections", {
      resumeTitle: payload.resumeTitle,
      sections: payload.sections,
    });
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? "이력서 생성 실패");
  }
});

// 새 이력서 생성 (파일 업로드)
export const createNewResumeFromFile = createAsyncThunk<
  Resume,
  {
    file: File;
    resumeTitle: string;
  },
  { rejectValue: string }
>("resume/createNewFromFile", async (payload, { rejectWithValue }) => {
  try {
    const form = new FormData();
    form.append("file", payload.file);
    form.append("resumeTitle", payload.resumeTitle);

    const res = await api.post("/resume/new", form);
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(error.message ?? "AI 리뷰 실패");
  }
});

export const getAiReview = createAsyncThunk<
  Resume,
  string,
  { rejectValue: string }
>("resume/getAiReview", async (id, { rejectWithValue }) => {
  try {
    const res = await api.post(`/gemini/review/${id}`);
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? "AI 리뷰 실패");
  }
});

export const generateResumeWithReview = createAsyncThunk<
  Resume,
  string,
  { rejectValue: string }
>("resume/generateResumeWithReview", async (id, { rejectWithValue }) => {
  try {
    const res = await api.post(`/gemini/generate/${id}`);
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message ?? "AI 리뷰 실패");
  }
});

export const patchResume = createAsyncThunk<
  Resume,
  { id: string; patch: Partial<Resume> },
  { rejectValue: string }
>("resume/patch", async ({ id, patch }, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/resume/${id}`, patch);
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ?? "이력서 통합 수정 실패"
    );
  }
});

export const getResumeFromAI = createAsyncThunk<
  Resume,
  { text: string; resumeTitle: string },
  { rejectValue: string }
>(
  "resume/getResumeFromAI",
  async ({ text, resumeTitle }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/gemini/generate/json`, {
        text,
        resumeTitle,
      });
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ?? "이력서 생성 실패"
      );
    }
  }
);

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    setHasFeedbackResume: (state, action) => {
      // 피드백 반영한 새 이력서 존재 여부 함수
      state.hasFeedbackResume = action.payload;
    },
    setIsEdit: (state, action) => {
      state.isEdit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResumes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = action.payload;
        state.error = "";
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteResume.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.resumes = state.resumes.filter((r) => r.id !== action.payload);
        if (state.resume?.id === action.payload) state.resume = null;
      })
      .addCase(deleteResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getResume.pending, (state) => {
        state.loading = true;
      })
      .addCase(getResume.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.resume = action.payload;
      })
      .addCase(getResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateItemText.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateItemText.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        if (!state.resume) return;
        const session = state.resume.sessions.find(
          (x) => x.key === action.payload.sessionKey
        );
        if (session?.items[action.payload.itemIndex]) {
          const item = session.items[action.payload.itemIndex];
          item.text = action.payload.text;
          if (action.payload.title) item.title = action.payload.title;
        }
      })
      .addCase(updateItemText.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSessionTitle.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSessionTitle.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        if (!state.resume) return;
        const session = state.resume.sessions.find(
          (x) => x.key === action.payload.sessionKey
        );
        if (session) {
          session.title = action.payload.title;
        }
      })
      .addCase(updateSessionTitle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addItemToSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(addItemToSession.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        const updated = action.payload;
        state.resume = updated;
        const idx = state.resumes.findIndex((r) => r.id === updated.id);
        if (idx !== -1) state.resumes[idx] = updated;
        else state.resumes.unshift(updated);
      })
      .addCase(addItemToSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleStar.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleStar.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        const i = state.resumes.findIndex((x) => x.id === action.payload.id);
        if (i !== -1) {
          state.resumes[i] = { ...state.resumes[i], ...action.payload };
          state.resumes = sortResumes(state.resumes);
        }
        if (state.resume?.id === action.payload.id)
          state.resume.starred = action.payload.starred;
      })
      .addCase(toggleStar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createNewResumeWithSections.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNewResumeWithSections.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.resume = action.payload;
        state.resumes.unshift(action.payload);
      })
      .addCase(createNewResumeWithSections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createNewResumeFromFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNewResumeFromFile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.resume = action.payload;
        state.resumes.unshift(action.payload);
      })
      .addCase(createNewResumeFromFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getAiReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAiReview.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        const updated = action.payload;
        state.resume = updated;
        const idx = state.resumes.findIndex((r) => r.id === updated.id);
        if (idx !== -1) state.resumes[idx] = updated;
        else state.resumes.unshift(updated);
      })
      .addCase(getAiReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(patchResume.pending, (state) => {
        state.loading = true;
      })
      .addCase(patchResume.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        const updated = action.payload;
        state.resume = updated;
        const idx = state.resumes.findIndex((r) => r.id === updated.id);
        if (idx !== -1) state.resumes[idx] = updated;
        else state.resumes.unshift(updated);
      })
      .addCase(patchResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(generateResumeWithReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateResumeWithReview.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.resume = action.payload;
      })
      .addCase(generateResumeWithReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getResumeFromAI.pending, (state) => {
        state.loading = true;
      })
      .addCase(getResumeFromAI.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.resume = action.payload;
      })
      .addCase(getResumeFromAI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setHasFeedbackResume, setIsEdit } = resumeSlice.actions;

export default resumeSlice.reducer;
