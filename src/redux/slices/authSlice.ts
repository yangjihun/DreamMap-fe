import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"; //createAsyncThunk추가
import api from '@/utils/api';

export interface User {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  profile?: {
    school: string;
    major: string;
    experience: string;
    skills: string[];
    location: string;
    desiredJob: string;
  };
}
// 서버 에러 응답 형식 인터페이스
interface AuthError {
  message: string;
}
interface AuthState {
  user: User | null;
  isAuthenticated: boolean; // 인증 상태 알려주는 state  isAuthenticated 
  token: string | null;
  isLoading: boolean;
  error: AuthError | null;
}
// API 요청 시 필요한 데이터(payload) 타입
interface LoginPayload {
  email: string;
  password: string;
}
interface SignupPayload extends LoginPayload {
  name?: string;
  profile?: any;  //  ?? 수정 필요할까?
}
// 로그인 및 회원가입 API 성공 응답 타입
interface AuthResponse {
  user: User;
  token: string;
}

// --- 초기 상태 ---

// 앱이 처음 로드될 때의 인증 상태를 정의
const initialState: AuthState = {
  user: null,
  isAuthenticated: false, 
  token: null,
  isLoading: false,
  error: null,
};


 //로그인 Thunk
 // 서버에 로그인 요청을 보내고, 성공 시 유저 정보와 토큰을 받아옵니다.
export const login = createAsyncThunk<AuthResponse, LoginPayload, { rejectValue: AuthError }>(
  "api/auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>("/api/auth/login", payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data ?? { message: "네트워크 오류가 발생했습니다." });
    }
  }
);


//회원가입 Thunk
//서버에 회원가입 요청을 보내고, 성공 시 유저 정보와 토큰을 받아옵니다.
export const signup = createAsyncThunk<AuthResponse, SignupPayload, { rejectValue: AuthError }>(
  "api/auth/signup",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>("/api/auth/signup", payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data ?? { message: "네트워크 오류가 발생했습니다." });
    }
  }
);

// --- Slice 정의 ---

export const authSlice = createSlice({
  name: "auth",
  initialState,
  // 동기적인 상태 변경을 처리하는 리듀서
  reducers: {
    // 수동으로 사용자 정보를 설정하는 액션 (예: 페이지 새로고침 시)
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      sessionStorage.setItem("token", action.payload.token);
    },
    // 로그아웃 시 상태를 초기화하는 액션
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      sessionStorage.removeItem("token");
    },
  },
  // 비동기 Thunk의 상태(pending, fulfilled, rejected)에 따라 상태를 변경하는 리듀서
  extraReducers: (builder) => {
    builder
      // 로그인 Thunk의 진행 상태별 리듀서
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.isAuthenticated = true; 
        state.user = action.payload.user;
        state.token = action.payload.token;
        sessionStorage.setItem("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AuthError;
      })
      // 회원가입 Thunk의 진행 상태별 리듀서
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        sessionStorage.setItem("token", action.payload.token);
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AuthError;
      });
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
