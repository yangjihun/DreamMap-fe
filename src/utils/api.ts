import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";

// Vite 환경 변수에서 백엔드 API의 기본 URL을 가져옵니다.
// .env 파일에 VITE_LOCAL_BACKEND 변수가 없으면 기본값으로 "http://localhost:5000"을 사용합니다.
const LOCAL_BACKEND =
  (import.meta as any).env?.VITE_LOCAL_BACKEND || "http://localhost:5000/api";

const api: AxiosInstance = axios.create({
  baseURL: LOCAL_BACKEND,
  // 백엔드와 쿠키를 주고받을 필요가 없는 토큰 기반 인증이므로 'false'로 설정
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

//요청 인터셉터 : InternalAxiosRequestConfig 사용
//모든 API 요청이 서버로 전송되기 전에 가로채어 특정 로직을 수행합니다.
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    console.log("Starting Request", config);

    const token = sessionStorage.getItem("token");
    // 토큰이 존재할 경우, 모든 요청 헤더에 'Authorization' 값을 추가합니다.
    // 이를 통해 서버는 어떤 사용자가 요청을 보냈는지 인증할 수 있습니다.
    if (token) {
      // config.headers가 없을 경우를 대비하여 기본 헤더 객체를 생성
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      // Axios v1.x 이상에서 권장하는 방식으로 헤더를 설정
      (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError) => {
    //// 요청 단계에서 에러가 발생했을 때 콘솔에 로그 남김
    console.log("REQUEST ERROR", error);
    return Promise.reject(error);
  }
);

//응답 인터셉터 (Response Interceptor)
//서버로부터 응답을 받은 후, .then() 또는 .catch()로 처리되기 전에 가로채어 특정 로직을 수행
api.interceptors.response.use(
  // API 호출이 성공했을 경우, 받은 응답을 그대로 반환
  (response: AxiosResponse) => response,
  // API 호출이 실패했을 경우, 에러를 공통으로 처리
  (error: AxiosError<any>) => {
    // 401 (Unauthorized) 에러는 토큰이 만료되었거나 유효하지 않음을 의미.
    // 이 경우, 사용자 인증 정보를 초기화하고 로그인 페이지로 리디렉션
    if (error.response?.status === 401) {
      console.error("인증이 만료되었습니다. 다시 로그인해주세요.");
      sessionStorage.removeItem("token");
      window.location.href = "/login"; // 로그인 페이지 경로로 변경해주세요.??
    }

    // API를 호출한 곳에서는 서버가 보낸 에러 메시지(data)만 신경 쓰도록,
    // 여기서 필요한 데이터를 추출하여 반환
    const errData = error.response?.data ?? error;
    console.error("Response Error:", errData);

    return Promise.reject(errData);
  }
);

export default api;
