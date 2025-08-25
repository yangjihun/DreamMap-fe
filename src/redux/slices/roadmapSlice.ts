import { Roadmap } from "@/types/roadmap";
import api from "@/utils/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface RoadmapState {
  roadmapPlans: Roadmap[];
  loading: boolean;
  error: string | null;
}

const initialState: RoadmapState = {
  roadmapPlans: [],
  loading: false,
  error: null,
};

export const createRoadmap = createAsyncThunk(
  "roadmap/createRoadmap",
  async (resumeId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/roadmap/${resumeId}`);
      return response.data.data.plans;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getRoadmap = createAsyncThunk(
  "roadmap/getRoadmap",
  async (resumeId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/roadmap/${resumeId}`);
      return response.data.data.plans;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// resource 학습 완료 토글
export const toggleResourceState = createAsyncThunk(
  "roadmap/toggleResourceState",
  async (
    { resumeId, resourceId }: { resumeId: string; resourceId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(
        `/roadmap/${resumeId}/resource/${resourceId}/state`
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const roadmapSlice = createSlice({
  name: "roadmap",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createRoadmap.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRoadmap.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.roadmapPlans = action.payload;
      })
      .addCase(createRoadmap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getRoadmap.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRoadmap.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.roadmapPlans = action.payload;
      })
      .addCase(getRoadmap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleResourceState.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleResourceState.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(toggleResourceState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default roadmapSlice.reducer;
