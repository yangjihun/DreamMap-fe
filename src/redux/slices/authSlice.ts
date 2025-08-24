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
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>("/auth/login", payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data ?? { message: "네트워크 오류가 발생했습니다." });
    }
  }
);


//회원가입 Thunk
//서버에 회원가입 요청을 보내고, 성공 시 유저 정보와 토큰을 받아옵니다.
export const signup = createAsyncThunk<AuthResponse, SignupPayload, { rejectValue: AuthError }>(
  "auth/signup",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>("/auth/signup", payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data ?? { message: "네트워크 오류가 발생했습니다." });
    }
  }
);

export const loginWithToken = createAsyncThunk<User, void, { rejectValue: AuthError }>(
  "auth/loginWithToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<User>("/user/me");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data.message ?? { message: "유효하지 않은 토큰입니다." });
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
    setUser: (state, action: PayloadAction<{ user: User | null; token: string | null }>) => {   //null 추가 후 실험
      state.user = action.payload.user;
      state.token = action.payload.token;
      // 👇 이 부분을 수정합니다.
      if (action.payload.token) {
        // 토큰이 문자열 값일 경우, 세션 스토리지에 저장합니다.
        sessionStorage.setItem("token", action.payload.token);
      } else {
        // 토큰이 null일 경우, 세-션 스토리지에서 해당 아이템을 제거합니다.
        sessionStorage.removeItem("token");
      }
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
        state.isAuthenticated = true; // 회원가입 시 바로 로그인 상태로
        state.user = action.payload.user;
        state.token = action.payload.token;
        sessionStorage.setItem("token", action.payload.token);
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AuthError;
      })
      .addCase(loginWithToken.pending, (state) => {
        // 요청 시작 시 로딩 상태를 true로 설정하고 에러를 초기화합니다.
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithToken.fulfilled, (state, action: PayloadAction<User>) => {
        // 요청 성공 시 (토큰이 유효함)
        state.isLoading = false;
        state.isAuthenticated = true; // 인증 상태를 true로 변경합니다.
        state.user = action.payload;  // 서버로부터 받은 사용자 정보를 저장합니다.
        // state.token은 변경할 필요가 없습니다. 
        // 이 thunk가 성공했다는 것 자체가 이미 state에 있던 토큰이 유효하다는 의미이기 때문입니다.
      })
      .addCase(loginWithToken.rejected, (state, action) => {
        // 요청 실패 시 (토큰이 유효하지 않음)
        state.isLoading = false;
        state.isAuthenticated = false; // 인증 상태를 false로 변경합니다.
        state.user = null;
        state.token = null; // Redux 스토어에서 토큰을 반드시 제거해야 합니다.
                            // 제거하지 않으면 api.ts 인터셉터가 계속 잘못된 토큰을 사용합니다.
        sessionStorage.removeItem("token"); // 다음 새로고침 시 잘못된 토큰을 다시 로드하지 않도록 세션 스토리지에서도 제거합니다.
        state.error = action.payload as AuthError;
      });
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
