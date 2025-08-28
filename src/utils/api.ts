import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";

import { store } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice";

const LOCAL_BACKEND =
  (import.meta as any).env?.VITE_LOCAL_BACKEND || "http://localhost:5000";

const api: AxiosInstance = axios.create({
  baseURL: `${LOCAL_BACKEND}/api`,
  withCredentials: false,
  // headers: {
  //   "Content-Type": "application/json",
  // }, <-axios가 자동으로 헤더 붙여줌줌
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = store.getState().auth.token;
    if (token) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError) => {
    console.error("REQUEST ERROR", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<any>) => {
    if (error.response?.status === 401 && error.config?.url !== '/auth/login') {
      console.error("인증이 만료되었습니다. 다시 로그인해주세요.");
      store.dispatch(logout());
      window.location.href = "/login";
    }
    const errData = error.response?.data ?? error;
    console.error("Response Error:", errData);
    return Promise.reject(errData);
  }
);

export default api;
