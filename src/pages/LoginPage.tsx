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
import { Eye, EyeOff, Lock, Mail, Sparkles, ArrowLeft } from "lucide-react";
import Header from "@/components/ui/header";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux 스토어에서 인증 상태를 가져옵니다.
  const { isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    //특별한 공용 페이지  로그인 페이지로 이동하는 것 막기 위함
    if (isAuthenticated && !isLoading) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      // 1. 입력된 이메일과 비밀번호로 login thunk를 디스패치합니다.
      await dispatch(login({ email, password })).unwrap();

      // 2. unwrap()이 성공적으로 완료되면 (로그인 성공 시) 메인페이지로 이동합니다.
      navigate("/");
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
        skill: data.skills.join(", "), // 배열을 쉼표로 구분된 문자열로 변환
        region: data.location,
        interestJob: data.desiredJob,
        loginType: "local", //일단 하드코딩
        level: "customer", //일단 하드코딩
        // 백엔드에서 필요한 기타 필드 (예: level, loginType)도 추가해야 함
      };

      // signup thunk를 디스패치하고 결과를 unwrap
      await dispatch(signup(backendPayload)).unwrap();

      // 회원가입 성공 후 메인페이지로 이동
      navigate("/");
    } catch (error: any) {
      console.error("회원가입 실패:", error);
      // 필요하다면 사용자에게 에러 메시지를 표시
      setError(
        error.message || "회원가입에 실패했습니다. 입력 정보를 확인해주세요."
      );
    } finally {
      setIsSignupModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Back to Main Page Button - Top Left */}

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-blue-600" />
              </div>
              <span className="text-2xl font-medium text-gray-900">
                미래지도
              </span>
            </div>
            <p className="text-gray-600">AI 분석으로 완성하는 완벽한 이력서</p>
          </div>

          <Card>
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-between mb-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="flex items-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                  onClick={() => navigate("/")}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  메인으로
                </Button>
                <div className="flex-1"></div>
              </div>
              <CardTitle className="text-xl">로그인</CardTitle>
              <p className="text-sm text-gray-600">
                계정에 로그인하여 시작하세요
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="flex items-center space-x-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>이메일</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    placeholder="이메일을 입력하세요"
                    className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="flex items-center space-x-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>비밀번호</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
                      placeholder="비밀번호를 입력하세요"
                      className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "로그인 중..." : "로그인"}
                </Button>

                <div className="text-center space-y-3">
                  <div className="text-sm text-gray-500">또는</div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 border-gray-200 hover:bg-gray-50"
                    onClick={() => setIsSignupModalOpen(true)}
                  >
                    회원가입
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onComplete={handleSignupComplete}
      />
    </div>
  );
}
