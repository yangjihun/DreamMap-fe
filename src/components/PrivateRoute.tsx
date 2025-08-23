import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../redux/store'; // RootState 타입 경로에 맞게 수정

const PrivateRoute = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // 인증된 사용자는 요청된 페이지를 보여주고, 그렇지 않으면 로그인 페이지로 리디렉션
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;