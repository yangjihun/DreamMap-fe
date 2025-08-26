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
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/roadmap/${id}`);
      console.log("api 연결???");
      // console.log("roadmap>>>>>", response.data);
      return response.data.data.plans;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getRoadmap = createAsyncThunk(
  "roadmap/getRoadmap",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/roadmap/${id}`);
      console.log("???????", response.data);
      return response.data.data.plans;
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
      });
  },
});

export default roadmapSlice.reducer;
