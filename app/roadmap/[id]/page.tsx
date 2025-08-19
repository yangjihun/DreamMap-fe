"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Sparkles,
  Target,
  Calendar,
  MapPin,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  ExternalLink,
  Star,
} from "lucide-react"
import Link from "next/link"

interface RoadmapStep {
  id: string
  title: string
  description: string
  duration: string
  skills: string[]
  resources: {
    type: "study" | "bootcamp" | "course" | "project"
    name: string
    provider: string
    location?: string
    price?: string
    rating?: number
    url?: string
  }[]
  completed: boolean
}

interface LocalProgram {
  id: string
  name: string
  type: "bootcamp" | "study" | "course" | "meetup"
  provider: string
  location: string
  duration: string
  price: string
  rating: number
  description: string
  skills: string[]
  url: string
}

export default function RoadmapPage({ params }: { params: { id: string } }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<"3months" | "6months" | "1year">("6months")

  // Mock data - 실제로는 사용자의 관심 직무와 지역 정보를 바탕으로 생성
  const userProfile = {
    targetRole: "프론트엔드 개발자",
    currentLevel: "주니어",
    location: "서울",
    interests: ["React", "TypeScript", "Next.js"],
  }

  const roadmapData: Record<string, RoadmapStep[]> = {
    "3months": [
      {
        id: "1",
        title: "React 심화 학습",
        description: "React의 고급 개념과 최신 기능을 마스터하여 실무 역량을 강화합니다.",
        duration: "4주",
        skills: ["React Hooks", "Context API", "Performance Optimization"],
        resources: [
          {
            type: "course",
            name: "React 완벽 가이드",
            provider: "인프런",
            price: "77,000원",
            rating: 4.8,
            url: "#",
          },
          {
            type: "study",
            name: "React 스터디 모임",
            provider: "프론트엔드 개발자 모임",
            location: "강남구",
            price: "무료",
            rating: 4.5,
          },
        ],
        completed: false,
      },
      {
        id: "2",
        title: "TypeScript 마스터",
        description: "타입 안정성을 갖춘 현대적인 JavaScript 개발 능력을 기릅니다.",
        duration: "3주",
        skills: ["Advanced Types", "Generic", "Utility Types"],
        resources: [
          {
            type: "course",
            name: "TypeScript 올인원",
            provider: "패스트캠퍼스",
            price: "120,000원",
            rating: 4.7,
          },
        ],
        completed: false,
      },
      {
        id: "3",
        title: "포트폴리오 프로젝트",
        description: "실무 수준의 프로젝트를 완성하여 포트폴리오를 강화합니다.",
        duration: "5주",
        skills: ["Project Management", "Code Review", "Deployment"],
        resources: [
          {
            type: "project",
            name: "개인 프로젝트 멘토링",
            provider: "코드스쿼드",
            location: "온라인",
            price: "200,000원",
            rating: 4.9,
          },
        ],
        completed: false,
      },
    ],
    "6months": [
      {
        id: "1",
        title: "프론트엔드 기초 완성",
        description: "HTML, CSS, JavaScript의 고급 개념을 완전히 이해합니다.",
        duration: "6주",
        skills: ["ES6+", "CSS Grid/Flexbox", "Web APIs"],
        resources: [
          {
            type: "bootcamp",
            name: "프론트엔드 부트캠프",
            provider: "코드스테이츠",
            location: "강남구",
            price: "1,500,000원",
            rating: 4.6,
          },
        ],
        completed: false,
      },
      {
        id: "2",
        title: "React 생태계 마스터",
        description: "React와 관련 라이브러리들을 활용한 실무 개발 능력을 기릅니다.",
        duration: "8주",
        skills: ["React", "Redux", "React Router", "Styled Components"],
        resources: [
          {
            type: "course",
            name: "React 실무 프로젝트",
            provider: "노마드 코더",
            price: "99,000원",
            rating: 4.8,
          },
          {
            type: "study",
            name: "React 개발자 스터디",
            provider: "개발자 커뮤니티",
            location: "서초구",
            price: "월 20,000원",
            rating: 4.4,
          },
        ],
        completed: false,
      },
      {
        id: "3",
        title: "Next.js & 풀스택 개발",
        description: "서버사이드 렌더링과 풀스택 개발 역량을 확보합니다.",
        duration: "6주",
        skills: ["Next.js", "API Routes", "Database Integration"],
        resources: [
          {
            type: "course",
            name: "Next.js 완벽 가이드",
            provider: "인프런",
            price: "88,000원",
            rating: 4.7,
          },
        ],
        completed: false,
      },
      {
        id: "4",
        title: "실무 프로젝트 & 포트폴리오",
        description: "실제 서비스 수준의 프로젝트를 완성하고 취업을 준비합니다.",
        duration: "6주",
        skills: ["Project Planning", "Code Quality", "Performance"],
        resources: [
          {
            type: "bootcamp",
            name: "프로젝트 기반 취업 부트캠프",
            provider: "엘리스",
            location: "성동구",
            price: "2,000,000원",
            rating: 4.5,
          },
        ],
        completed: false,
      },
    ],
    "1year": [
      {
        id: "1",
        title: "프로그래밍 기초 완성",
        description: "컴퓨터 과학 기초와 프로그래밍 사고력을 기릅니다.",
        duration: "8주",
        skills: ["Algorithm", "Data Structure", "Problem Solving"],
        resources: [
          {
            type: "course",
            name: "컴퓨터 과학 기초",
            provider: "부스트코스",
            price: "무료",
            rating: 4.6,
          },
        ],
        completed: false,
      },
      {
        id: "2",
        title: "웹 개발 기초",
        description: "HTML, CSS, JavaScript의 기초부터 고급까지 학습합니다.",
        duration: "12주",
        skills: ["HTML5", "CSS3", "JavaScript ES6+", "DOM Manipulation"],
        resources: [
          {
            type: "bootcamp",
            name: "웹 개발 종합 부트캠프",
            provider: "패스트캠퍼스",
            location: "강남구",
            price: "3,000,000원",
            rating: 4.7,
          },
        ],
        completed: false,
      },
      {
        id: "3",
        title: "React 개발자 되기",
        description: "React를 활용한 모던 프론트엔드 개발을 마스터합니다.",
        duration: "16주",
        skills: ["React", "State Management", "Component Design", "Testing"],
        resources: [
          {
            type: "course",
            name: "React 마스터 클래스",
            provider: "인프런",
            price: "150,000원",
            rating: 4.8,
          },
          {
            type: "study",
            name: "React 심화 스터디",
            provider: "프론트엔드 개발자 모임",
            location: "마포구",
            price: "월 30,000원",
            rating: 4.6,
          },
        ],
        completed: false,
      },
      {
        id: "4",
        title: "실무 역량 강화",
        description: "팀 프로젝트와 실무 경험을 통해 취업 준비를 완료합니다.",
        duration: "16주",
        skills: ["Team Collaboration", "Code Review", "CI/CD", "Performance"],
        resources: [
          {
            type: "bootcamp",
            name: "실무 중심 개발자 양성 과정",
            provider: "우아한테크코스",
            location: "송파구",
            price: "무료 (선발)",
            rating: 4.9,
          },
        ],
        completed: false,
      },
    ],
  }

  const localPrograms: LocalProgram[] = [
    {
      id: "1",
      name: "프론트엔드 개발자 모임",
      type: "study",
      provider: "개발자 커뮤니티",
      location: "강남구 역삼동",
      duration: "매주 토요일",
      price: "월 20,000원",
      rating: 4.5,
      description: "React, Vue.js 등 프론트엔드 기술을 함께 학습하는 스터디 모임입니다.",
      skills: ["React", "Vue.js", "JavaScript"],
      url: "#",
    },
    {
      id: "2",
      name: "코드스테이츠 부트캠프",
      type: "bootcamp",
      provider: "코드스테이츠",
      location: "강남구 테헤란로",
      duration: "6개월",
      price: "1,500,000원",
      rating: 4.6,
      description: "실무 중심의 프론트엔드 개발자 양성 부트캠프입니다.",
      skills: ["React", "Node.js", "Database"],
      url: "#",
    },
    {
      id: "3",
      name: "JavaScript 심화 과정",
      type: "course",
      provider: "패스트캠퍼스",
      location: "서초구 서초동",
      duration: "3개월",
      price: "500,000원",
      rating: 4.7,
      description: "JavaScript의 고급 개념과 최신 기능을 학습하는 과정입니다.",
      skills: ["JavaScript", "TypeScript", "Node.js"],
      url: "#",
    },
    {
      id: "4",
      name: "개발자 네트워킹 모임",
      type: "meetup",
      provider: "서울 개발자 모임",
      location: "마포구 홍대입구",
      duration: "월 1회",
      price: "무료",
      rating: 4.3,
      description: "다양한 분야의 개발자들과 네트워킹할 수 있는 모임입니다.",
      skills: ["Networking", "Career", "Mentoring"],
      url: "#",
    },
  ]

  const currentRoadmap = roadmapData[selectedTimeframe]

  const getTimeframeText = (timeframe: string) => {
    switch (timeframe) {
      case "3months":
        return "3개월 집중 과정"
      case "6months":
        return "6개월 완성 과정"
      case "1year":
        return "1년 마스터 과정"
      default:
        return ""
    }
  }

  const getProgramTypeColor = (type: LocalProgram["type"]) => {
    switch (type) {
      case "bootcamp":
        return "bg-red-100 text-red-800"
      case "study":
        return "bg-blue-100 text-blue-800"
      case "course":
        return "bg-green-100 text-green-800"
      case "meetup":
        return "bg-purple-100 text-purple-800"
    }
  }

  const getProgramTypeText = (type: LocalProgram["type"]) => {
    switch (type) {
      case "bootcamp":
        return "부트캠프"
      case "study":
        return "스터디"
      case "course":
        return "강의"
      case "meetup":
        return "모임"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href={`/analysis/${params.id}`}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>분석 결과로 돌아가기</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-foreground" />
            <h1 className="text-2xl font-bold font-serif text-foreground">ResumeAI</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold font-serif text-foreground mb-2">성장 로드맵</h2>
            <p className="text-muted-foreground text-lg">
              <span className="font-semibold text-primary">{userProfile.targetRole}</span>가 되기 위한 맞춤형 학습 계획
            </p>
          </div>

          {/* User Profile Summary */}
          <Card className="border border-border bg-card mb-6">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div>
                  <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold text-foreground">{userProfile.targetRole}</p>
                  <p className="text-sm text-muted-foreground">목표 직무</p>
                </div>
                <div>
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-foreground">{userProfile.currentLevel}</p>
                  <p className="text-sm text-muted-foreground">현재 레벨</p>
                </div>
                <div>
                  <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-foreground">{userProfile.location}</p>
                  <p className="text-sm text-muted-foreground">지역</p>
                </div>
                <div>
                  <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-semibold text-foreground">{userProfile.interests.join(", ")}</p>
                  <p className="text-sm text-muted-foreground">관심 기술</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeframe Selection */}
          <div className="flex justify-center space-x-4 mb-8">
            {(["3months", "6months", "1year"] as const).map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? "default" : "outline"}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={
                  selectedTimeframe === timeframe
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent border-border"
                }
              >
                <Calendar className="mr-2 h-4 w-4" />
                {getTimeframeText(timeframe)}
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="roadmap" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="roadmap">학습 로드맵</TabsTrigger>
            <TabsTrigger value="local">지역별 프로그램</TabsTrigger>
          </TabsList>

          {/* Roadmap Tab */}
          <TabsContent value="roadmap" className="space-y-6">
            <div className="space-y-6">
              {currentRoadmap.map((step, index) => (
                <Card key={step.id} className="border border-border bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-primary">{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{step.duration}</span>
                            </Badge>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4">{step.description}</p>

                        {/* Skills */}
                        <div className="mb-4">
                          <h4 className="font-medium text-foreground mb-2">학습할 기술</h4>
                          <div className="flex flex-wrap gap-2">
                            {step.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="bg-accent text-accent-foreground">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Resources */}
                        <div>
                          <h4 className="font-medium text-foreground mb-3">추천 학습 자료</h4>
                          <div className="grid gap-3">
                            {step.resources.map((resource, resourceIndex) => (
                              <div
                                key={resourceIndex}
                                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                    {resource.type === "course" && <BookOpen className="h-4 w-4 text-primary" />}
                                    {resource.type === "bootcamp" && <Users className="h-4 w-4 text-primary" />}
                                    {resource.type === "study" && <Users className="h-4 w-4 text-primary" />}
                                    {resource.type === "project" && <Target className="h-4 w-4 text-primary" />}
                                  </div>
                                  <div>
                                    <p className="font-medium text-foreground">{resource.name}</p>
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                      <span>{resource.provider}</span>
                                      {resource.location && (
                                        <>
                                          <span>•</span>
                                          <span className="flex items-center space-x-1">
                                            <MapPin className="h-3 w-3" />
                                            <span>{resource.location}</span>
                                          </span>
                                        </>
                                      )}
                                      {resource.rating && (
                                        <>
                                          <span>•</span>
                                          <span className="flex items-center space-x-1">
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            <span>{resource.rating}</span>
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  {resource.price && (
                                    <span className="font-semibold text-foreground">{resource.price}</span>
                                  )}
                                  {resource.url && (
                                    <Button size="sm" variant="outline" className="bg-transparent">
                                      <ExternalLink className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Progress Summary */}
            <Card className="border border-primary/20 bg-primary/5">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {getTimeframeText(selectedTimeframe)} 완료 시 예상 성과
                </h3>
                <p className="text-muted-foreground mb-4">
                  체계적인 학습을 통해 <span className="font-semibold text-primary">{userProfile.targetRole}</span>로
                  성장할 수 있습니다
                </p>
                <div className="flex justify-center">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    학습 시작하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Local Programs Tab */}
          <TabsContent value="local" className="space-y-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">{userProfile.location} 지역 추천 프로그램</h3>
              <p className="text-muted-foreground">가까운 지역의 학습 프로그램과 커뮤니티를 찾아보세요</p>
            </div>

            <div className="grid gap-6">
              {localPrograms.map((program) => (
                <Card key={program.id} className="border border-border bg-card hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-foreground">{program.name}</h4>
                          <Badge className={getProgramTypeColor(program.type)}>
                            {getProgramTypeText(program.type)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                          <span>{program.provider}</span>
                          <span className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{program.location}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{program.duration}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{program.rating}</span>
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-4">{program.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {program.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground mb-2">{program.price}</p>
                        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                          <ExternalLink className="mr-1 h-3 w-3" />
                          자세히 보기
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
