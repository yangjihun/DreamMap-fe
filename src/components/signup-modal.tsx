import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react";

// --- 인터페이스 및 데이터 ---
export interface SignupData {
  //로그인 페이지에서 사용 위해 export
  email: string;
  password: string;
  name: string;
  school: string;
  major: string;
  experience: string;
  skills: string[];
  location: string;
  desiredJob: string;
  level: string;
}

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: SignupData) => void;
}

const steps = [
  {
    id: 0,
    title: "계정 정보",
    description: "이메일, 비밀번호, 이름을 입력하세요",
  },
  { id: 1, title: "학교 정보", description: "학력 정보를 입력해주세요" },
  { id: 2, title: "전공", description: "전공 분야를 선택해주세요" },
  { id: 3, title: "경력", description: "경력 사항을 입력해주세요" },
  { id: 4, title: "스킬", description: "보유 스킬을 입력해주세요" },
  { id: 5, title: "지역", description: "희망 지역을 선택해주세요" },
  { id: 6, title: "관심 직무", description: "희망 직무를 선택해주세요" },
];

const majors = [
  "컴퓨터공학",
  "소프트웨어공학",
  "정보통신공학",
  "전자공학",
  "데이터사이언스",
  "인공지능",
  "웹개발",
  "모바일개발",
  "시스템엔지니어링",
  "보안",
  "기타",
];

const locations = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
  "기타",
];

const jobCategories = [
  "프론트엔드 개발자",
  "백엔드 개발자",
  "풀스택 개발자",
  "모바일 앱 개발자",
  "데이터 엔지니어",
  "데이터 사이언티스트",
  "AI/ML 엔지니어",
  "DevOps 엔지니어",
  "시스템 엔지니어",
  "보안 엔지니어",
  "QA 엔지니어",
  "프로덕트 매니저",
  "기타",
];

// --- 유효성 검사 헬퍼 함수 ---
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isStrongPassword = (password: string) => password.length >= 8;

// --- 컴포넌트 ---
export default function SignupModal({
  isOpen,
  onClose,
  onComplete,
}: SignupModalProps) {
  // --- 상태(State) ---
  const [currentStep, setCurrentStep] = useState(0); // 시작 단계를 0으로 변경
  const [signupData, setSignupData] = useState<SignupData>({
    email: "",
    password: "",
    name: "",
    school: "",
    major: "",
    experience: "",
    skills: [],
    location: "",
    desiredJob: "",
    level: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [skillInput, setSkillInput] = useState("");

  if (!isOpen) return null;

  // --- 유효성 검사 ---
  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return (
          isValidEmail(signupData.email) &&
          isStrongPassword(signupData.password) &&
          signupData.name.trim() !== "" &&
          signupData.password === confirmPassword &&
          signupData.password !== "" // 비밀번호 필드가 비어있지 않은지 확인
        );
      case 1:
        return signupData.school.trim() !== "";
      case 2:
        return signupData.major !== "";
      case 3:
        return signupData.experience.trim() !== "";
      case 4:
        return signupData.skills.length > 0;
      case 5:
        return signupData.location !== "";
      case 6:
        return signupData.desiredJob !== "";
      default:
        return false;
    }
  };

  // --- 이벤트 핸들러 ---
  const handleNext = () => {
    if (isStepValid() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (isStepValid()) {
      onComplete(signupData);
      onClose();
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !signupData.skills.includes(skillInput.trim())) {
      setSignupData({
        ...signupData,
        skills: [...signupData.skills, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSignupData({
      ...signupData,
      skills: signupData.skills.filter((s) => s !== skill),
    });
  };

  // --- 렌더링 함수 ---
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                placeholder="이름을 입력하세요"
                value={signupData.name}
                onChange={(e) =>
                  setSignupData({ ...signupData, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="이메일 주소를 입력하세요"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="6자 이상 입력하세요"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <Label htmlFor="school">학교명</Label>
            <Input
              id="school"
              placeholder="졸업/재학 중인 학교를 입력하세요"
              value={signupData.school}
              onChange={(e) =>
                setSignupData({ ...signupData, school: e.target.value })
              }
            />
          </div>
        );
      case 2:
        return (
          <div>
            <Label htmlFor="major">전공 분야</Label>
            <Select
              value={signupData.major}
              onValueChange={(value) =>
                setSignupData({ ...signupData, major: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="전공을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {majors.map((major) => (
                  <SelectItem key={major} value={major}>
                    {major}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 3:
        return (
          <div>
            <Label htmlFor="experience">경력 사항</Label>
            <Textarea
              id="experience"
              placeholder="보유한 경력이나 프로젝트 경험을 입력하세요"
              value={signupData.experience}
              onChange={(e) =>
                setSignupData({ ...signupData, experience: e.target.value })
              }
              rows={4}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="skills">보유 스킬</Label>
              <div className="flex space-x-2">
                <Input
                  id="skills"
                  placeholder="스킬을 입력하고 Enter"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                />
                <Button type="button" onClick={addSkill} size="sm">
                  추가
                </Button>
              </div>
              {signupData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {signupData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <Label htmlFor="location">학습 희망 지역</Label>
            <Select
              value={signupData.location}
              onValueChange={(value) =>
                setSignupData({ ...signupData, location: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="학습 희망 지역을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 6:
        return (
          <div>
            <Label htmlFor="desiredJob">희망 직무</Label>
            <Select
              value={signupData.desiredJob}
              onValueChange={(value) =>
                setSignupData({ ...signupData, desiredJob: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="희망 직무를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {jobCategories.map((job) => (
                  <SelectItem key={job} value={job}>
                    {job}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    //<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl font-semibold">
              {steps[currentStep].title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {steps[currentStep].description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {renderStepContent()}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> 이전
            </Button>
            <div className="flex space-x-2">
              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="flex items-center"
                >
                  다음 <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={!isStepValid()}
                  className="flex items-center bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" /> 완료
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
