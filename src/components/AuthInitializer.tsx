import React, { useState, useEffect, ReactNode } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { loginWithToken, setUser } from '@/redux/slices/authSlice';

// 로딩 중에 보여줄 간단한 스플래시 화면 컴포넌트
const SplashScreen = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontSize: '1.5rem',
    backgroundColor: '#f8f9fa'
  }}>
    로딩 중...
  </div>
);


// Props 타입 정의: children을 받을 수 있도록 설정
interface AuthInitializerProps {
  children: ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  // 인증 확인 중인지 여부를 관리하는 상태
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 비동기 로직을 처리하기 위한 함수 선언
    const initializeAuth = async () => {
      const token = sessionStorage.getItem('token');

      if (token) {
        // 1. Redux 상태에 토큰을 먼저 설정 (api.ts 인터셉터가 사용)
        dispatch(setUser({ user: null, token }));
        try {
          // 2. 토큰 유효성 검증 시도
          await dispatch(loginWithToken()).unwrap();
        } catch (error) {
          console.error("토큰 로그인 실패:", error);
          // 실패 시에는 extraReducer가 토큰을 제거하므로 별도 처리가 불필요
        }
      }
      
      // 토큰이 있든 없든, 모든 확인 절차가 끝나면 로딩 상태를 해제
      setIsLoading(false);
    };

    initializeAuth();
  }, [dispatch]);

  // 로딩 중이라면 스플래시 화면을, 아니라면 실제 앱 콘텐츠(children)를 렌더링
  return isLoading ? <SplashScreen /> : <>{children}</>;
};

export default AuthInitializer;