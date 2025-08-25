import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import { login, signup } from "../redux/slices/authSlice";
import SignupModal from "../components/signup-modal";
import type { SignupData } from "@/components/signup-modal";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

   // Redux 스토어에서 인증 상태를 가져옵니다.
   const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

   useEffect(() => { //특별한 공용 페이지  로그인 페이지로 이동하는 것 막기 위함
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard"); 
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      // 1. 입력된 이메일과 비밀번호로 login thunk를 디스패치합니다.
      await dispatch(login({ email, password })).unwrap();

      // 2. unwrap()이 성공적으로 완료되면 (로그인 성공 시) 대시보드로 이동합니다.
      navigate("/dashboard");
    } catch (error: any) {
      // 3. unwrap()이 에러를 던지면 (로그인 실패 시) 에러를 처리합니다.
     
      setError(error.message || "로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };


  // 회원가입 완료 후 자동 로그인
  const handleSignupComplete = async (data: SignupData) => {
    console.log("회원가입 완료:", data);
    setError(null);
    try {
      // signup thunk에 전달할 페이로드 생성
      const backendPayload = { 
        email: data.email,
        password: data.password,
        name: data.name, 
        school: data.school,
        major: data.major,
        career: data.experience,   
        skill:  data.skills.join(', '), // 배열을 쉼표로 구분된 문자열로 변환
        region : data.location,        
        interestJob: data.desiredJob, 
        loginType : "local",  //일단 하드코딩
        level : "customer" //일단 하드코딩
        // 백엔드에서 필요한 기타 필드 (예: level, loginType)도 추가해야 함
      };
  
      // signup thunk를 디스패치하고 결과를 unwrap
      await dispatch(signup(backendPayload)).unwrap();
  
      // 회원가입 성공 후 대시보드로 이동
      navigate("/dashboard");
    } catch (error: any) {
      console.error("회원가입 실패:", error);
      // 필요하다면 사용자에게 에러 메시지를 표시
      setError(error.message || "회원가입에 실패했습니다. 입력 정보를 확인해주세요.");
    } finally {
      setIsSignupModalOpen(false);
    }
  } 

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">로그인</h2>
          <p className="mt-2 text-sm text-gray-600">
            계정에 로그인하여 서비스를 이용하세요
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">계정 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                  {error} 
                </div>
              )}
              <div>
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) =>{ 
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="이메일을 입력하세요"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) =>{ 
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="비밀번호를 입력하세요"
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                로그인
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">또는</span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsSignupModalOpen(true)}
                >
                  회원가입
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onComplete={handleSignupComplete}
      />
    </div>
  );
}
