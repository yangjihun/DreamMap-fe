import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"
import { X, ChevronRight, ChevronLeft, Check } from "lucide-react"

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
}

type SignupStep = "account" | "education" | "experience" | "skills" | "location" | "interests" | "complete"

interface SignupData {
  email: string
  password: string
  confirmPassword: string
  name: string
  school: string
  major: string
  experience: string
  skills: string[]
  location: string
  interests: string[]
}

const SKILLS_OPTIONS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Vue.js",
  "Angular",
  "Node.js",
  "Python",
  "Java",
  "Spring",
  "Django",
  "Flask",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "AWS",
  "Docker",
  "Kubernetes",
  "Git",
  "Linux",
  "C++",
  "C#",
  ".NET",
  "Go",
  "Rust",
]

const INTEREST_OPTIONS = [
  "프론트엔드 개발자",
  "백엔드 개발자",
  "풀스택 개발자",
  "모바일 개발자",
  "DevOps 엔지니어",
  "데이터 사이언티스트",
  "머신러닝 엔지니어",
  "AI 엔지니어",
  "보안 전문가",
  "QA 엔지니어",
  "프로덕트 매니저",
  "기술 리드",
  "CTO",
  "스타트업 창업",
  "프리랜서",
]

const LOCATIONS = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "광주",
  "대전",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
  "해외",
]

export function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<SignupStep>("account")
  const [signupData, setSignupData] = useState<SignupData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    school: "",
    major: "",
    experience: "",
    skills: [],
    location: "",
    interests: [],
  })

  const steps: { key: SignupStep; title: string; description: string }[] = [
    { key: "account", title: "계정 정보", description: "기본 계정 정보를 입력해주세요" },
    { key: "education", title: "학교/전공", description: "교육 배경을 알려주세요" },
    { key: "experience", title: "경력", description: "경력 사항을 입력해주세요" },
    { key: "skills", title: "스킬", description: "보유 기술을 선택해주세요" },
    { key: "location", title: "지역", description: "희망 근무 지역을 선택해주세요" },
    { key: "interests", title: "관심 직무", description: "관심있는 직무를 선택해주세요" },
    { key: "complete", title: "완료", description: "회원가입이 완료되었습니다" },
  ]

  const currentStepIndex = steps.findIndex((step) => step.key === currentStep)
  const currentStepInfo = steps[currentStepIndex]

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].key)
    }
  }

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].key)
    }
  }

  const handleSkillToggle = (skill: string) => {
    setSignupData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }))
  }

  const handleInterestToggle = (interest: string) => {
    setSignupData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleSubmit = () => {
    // TODO: Implement signup logic
    console.log("Signup data:", signupData)
    setCurrentStep("complete")
  }

  const handleComplete = () => {
    onClose()
    // Redirect to dashboard
    navigate("/dashboard")
  }

  const resetModal = () => {
    setCurrentStep("account")
    setSignupData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      school: "",
      major: "",
      experience: "",
      skills: [],
      location: "",
      interests: [],
    })
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogOverlay className="bg-black/50" />
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold font-serif text-foreground">{currentStepInfo.title}</h2>
            <p className="text-muted-foreground mt-1">{currentStepInfo.description}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <div className="flex items-center space-x-2 mb-2">
            {steps.slice(0, -1).map((step, index) => (
              <div key={step.key} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index < currentStepIndex
                      ? "bg-primary text-primary-foreground"
                      : index === currentStepIndex
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index < currentStepIndex ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                {index < steps.length - 2 && (
                  <div className={`w-12 h-0.5 mx-2 ${index < currentStepIndex ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {currentStepIndex + 1} / {steps.length - 1} 단계
          </p>
        </div>

        <div className="px-6 pb-6">
          {/* Account Step */}
          {currentStep === "account" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  value={signupData.name}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="홍길동"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">이메일</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={signupData.email}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">비밀번호</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signupData.password}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">비밀번호 확인</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          {/* Education Step */}
          {currentStep === "education" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="school">학교</Label>
                <Input
                  id="school"
                  value={signupData.school}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, school: e.target.value }))}
                  placeholder="예: 서울대학교, 고려대학교, 연세대학교"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="major">전공</Label>
                <Input
                  id="major"
                  value={signupData.major}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, major: e.target.value }))}
                  placeholder="예: 컴퓨터공학과, 소프트웨어학과, 정보통신공학과"
                />
              </div>
            </div>
          )}

          {/* Experience Step */}
          {currentStep === "experience" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="experience">경력 사항</Label>
                <Textarea
                  id="experience"
                  value={signupData.experience}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, experience: e.target.value }))}
                  placeholder="경력이 있다면 간단히 설명해주세요. 신입이라면 '신입'이라고 입력해주세요."
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Skills Step */}
          {currentStep === "skills" && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">보유 기술 스택</Label>
                <p className="text-sm text-muted-foreground mb-4">해당하는 기술들을 선택해주세요</p>
                <div className="flex flex-wrap gap-2">
                  {SKILLS_OPTIONS.map((skill) => (
                    <Badge
                      key={skill}
                      variant={signupData.skills.includes(skill) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        signupData.skills.includes(skill)
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => handleSkillToggle(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Location Step */}
          {currentStep === "location" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>희망 근무 지역</Label>
                <Select
                  value={signupData.location}
                  onValueChange={(value) => setSignupData((prev) => ({ ...prev, location: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="지역을 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Interests Step */}
          {currentStep === "interests" && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">관심 직무</Label>
                <p className="text-sm text-muted-foreground mb-4">관심있는 직무를 선택해주세요 (복수 선택 가능)</p>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((interest) => (
                    <Badge
                      key={interest}
                      variant={signupData.interests.includes(interest) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        signupData.interests.includes(interest)
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => handleInterestToggle(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Complete Step */}
          {currentStep === "complete" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">회원가입 완료!</h3>
              <p className="text-muted-foreground mb-6">
                환영합니다! 이제 AI 레쥬메 분석 서비스를 이용하실 수 있습니다.
              </p>
              <Button onClick={handleComplete} className="bg-primary text-primary-foreground hover:bg-primary/90">
                대시보드로 이동
              </Button>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        {currentStep !== "complete" && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStepIndex === 0}
              className="flex items-center space-x-2 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>이전</span>
            </Button>

            {currentStepIndex === steps.length - 2 ? (
              <Button
                onClick={handleSubmit}
                className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <span>가입 완료</span>
                <Check className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleNext} className="flex items-center space-x-2">
                <span>다음</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
