import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '@/redux/store'; 

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  // AuthInitializer가 토큰으로 로그인 시도를 하는 동안(isLoading)
  // 성급하게 리디렉션하는 것을 막고 로딩 UI를 보여주며 기다립니다.
  if (isLoading) {
    // 로딩 중임을 나타내는 간단한 UI를 보여줍니다.
    return <div>Loading...</div>; 
  }
  // 인증된 사용자는 요청된 페이지를 보여주고, 그렇지 않으면 로그인 페이지로 리디렉션
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;