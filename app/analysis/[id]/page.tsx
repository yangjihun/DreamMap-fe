"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Download,
  FileText,
  Target,
  Award,
  Lightbulb,
  Zap,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

interface FeedbackItem {
  type: "strength" | "improvement" | "suggestion"
  category: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
}

export default function AnalysisPage({ params }: { params: { id: string } }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [showGrowthPrompt, setShowGrowthPrompt] = useState(true)

  const handleGenerateImproved = () => {
    setIsGenerating(true)
    // Simulate AI generation process
    setTimeout(() => {
      setIsGenerating(false)
      setIsGenerated(true)
    }, 3000)
  }

  const handleDownload = () => {
    // TODO: Implement actual file download
    console.log("Downloading improved resume...")
  }

  const handleStartGrowthJourney = () => {
    window.location.href = `/roadmap/${params.id}`
  }

  const getFeedbackIcon = (type: FeedbackItem["type"]) => {
    switch (type) {
      case "strength":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "improvement":
        return <AlertCircle className="h-5 w-5 text-orange-600" />
      case "suggestion":
        return <Lightbulb className="h-5 w-5 text-blue-600" />
    }
  }

  const getFeedbackColor = (type: FeedbackItem["type"]) => {
    switch (type) {
      case "strength":
        return "bg-green-50 border-green-200 text-green-800"
      case "improvement":
        return "bg-orange-50 border-orange-200 text-orange-800"
      case "suggestion":
        return "bg-blue-50 border-blue-200 text-blue-800"
    }
  }

  const getPriorityColor = (priority: FeedbackItem["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityText = (priority: FeedbackItem["priority"]) => {
    switch (priority) {
      case "high":
        return "높음"
      case "medium":
        return "보통"
      case "low":
        return "낮음"
    }
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md border border-border bg-card">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <Zap className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">AI가 개선된 레쥬메를 생성 중입니다</h3>
            <p className="text-muted-foreground mb-6">피드백을 반영하여 더 나은 레쥬메를 만들고 있어요.</p>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: "80%" }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>대시보드로 돌아가기</span>
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold font-serif text-foreground mb-2">{params.id}</h2>
              <p className="text-muted-foreground">분석 완료: 2024년 1월 15일</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-foreground mb-1">78/100</div>
              <p className="text-muted-foreground">종합 점수</p>
            </div>
          </div>

          {/* Overall Score Progress */}
          <Card className="border border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">종합 평가</h3>
                <Badge className="bg-green-100 text-green-800">우수</Badge>
              </div>
              <Progress value={78} className="h-3" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="feedback" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="feedback">AI 피드백</TabsTrigger>
            <TabsTrigger value="categories">카테고리별 분석</TabsTrigger>
            <TabsTrigger value="improved">개선된 레쥬메</TabsTrigger>
          </TabsList>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-4">
            <div className="grid gap-4">
              <Card className="border bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-foreground">최신 기술 스택 보유</h4>
                          <Badge variant="outline" className="text-xs">
                            기술 스택
                          </Badge>
                        </div>
                        <Badge className="bg-red-100 text-red-800">높음</Badge>
                      </div>
                      <p className="text-muted-foreground">
                        React, TypeScript, Next.js 등 현재 시장에서 요구되는 최신 기술들을 잘 갖추고 있습니다.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border bg-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-foreground">프로젝트 성과 구체화 필요</h4>
                          <Badge variant="outline" className="text-xs">
                            경력 기술
                          </Badge>
                        </div>
                        <Badge className="bg-red-100 text-red-800">높음</Badge>
                      </div>
                      <p className="text-muted-foreground">
                        프로젝트 경험은 풍부하지만, 구체적인 성과나 기여도가 명시되지 않았습니다. 수치화된 결과를
                        추가하세요.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <Lightbulb className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-foreground">GitHub 링크 추가 권장</h4>
                          <Badge variant="outline" className="text-xs">
                            포트폴리오
                          </Badge>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">보통</Badge>
                      </div>
                      <p className="text-muted-foreground">
                        개발자로서 GitHub 프로필이나 포트폴리오 링크를 추가하면 더욱 신뢰성 있는 이력서가 됩니다.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border bg-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-foreground">차별화된 강점 부각</h4>
                          <Badge variant="outline" className="text-xs">
                            자기소개
                          </Badge>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">보통</Badge>
                      </div>
                      <p className="text-muted-foreground">
                        일반적인 자기소개보다는 본인만의 독특한 경험이나 강점을 더 부각시켜 보세요.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-foreground">관련 전공 이수</h4>
                          <Badge variant="outline" className="text-xs">
                            학력
                          </Badge>
                        </div>
                        <Badge className="bg-gray-100 text-gray-800">낮음</Badge>
                      </div>
                      <p className="text-muted-foreground">
                        컴퓨터공학 전공으로 탄탄한 기초 지식을 갖추고 있어 긍정적으로 평가됩니다.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border border-border bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground">기술 스택</h4>
                    <span className="text-2xl font-bold text-foreground">85/100</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </CardContent>
              </Card>
              <Card className="border border-border bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground">경력 기술</h4>
                    <span className="text-2xl font-bold text-foreground">70/100</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </CardContent>
              </Card>
              <Card className="border border-border bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground">자기소개</h4>
                    <span className="text-2xl font-bold text-foreground">75/100</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </CardContent>
              </Card>
              <Card className="border border-border bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground">학력</h4>
                    <span className="text-2xl font-bold text-foreground">90/100</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </CardContent>
              </Card>
              <Card className="border border-border bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground">포트폴리오</h4>
                    <span className="text-2xl font-bold text-foreground">65/100</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Improved Resume Tab */}
          <TabsContent value="improved" className="space-y-4">
            {!isGenerated ? (
              <Card className="border border-border bg-card">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">AI가 개선된 레쥬메를 생성해드립니다</h3>
                  <p className="text-muted-foreground mb-6">
                    분석 결과를 바탕으로 더 나은 레쥬메를 자동으로 작성해드릴게요. 피드백이 모두 반영된 완성도 높은
                    레쥬메를 받아보세요.
                  </p>
                  <Button
                    onClick={handleGenerateImproved}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-lg font-semibold"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    피드백 융합시키기
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card className="border border-green-200 bg-green-50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Award className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-green-800 mb-1">개선된 레쥬메가 완성되었습니다!</h3>
                        <p className="text-green-700">AI가 모든 피드백을 반영하여 더 나은 레쥬메를 생성했습니다.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-border bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>개선된 레쥬메 미리보기</span>
                    </CardTitle>
                    <CardDescription>AI가 피드백을 반영하여 개선한 레쥬메입니다.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/30 rounded-lg p-6 mb-6">
                      <div className="space-y-4 text-sm">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">홍길동</h4>
                          <p className="text-muted-foreground">프론트엔드 개발자 | React 전문가</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-foreground mb-1">핵심 역량</h5>
                          <p className="text-muted-foreground">
                            • React, TypeScript, Next.js를 활용한 3년간의 실무 경험
                            <br />• 사용자 경험 개선을 통해 전환율 25% 향상 달성
                            <br />• GitHub: github.com/hongildong (50+ 프로젝트, 200+ 스타)
                          </p>
                        </div>
                        <div>
                          <h5 className="font-medium text-foreground mb-1">주요 프로젝트</h5>
                          <p className="text-muted-foreground">
                            • E-commerce 플랫폼 개발: 월 활성 사용자 10,000명 달성
                            <br />• 관리자 대시보드 구축: 업무 효율성 40% 개선
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button
                        onClick={handleDownload}
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        PDF 다운로드
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        <FileText className="mr-2 h-4 w-4" />
                        Word 다운로드
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Growth Prompt Section */}
                {showGrowthPrompt && (
                  <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold font-serif text-foreground mb-4">더 성장하길 원하시나요?</h3>
                      <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                        AI가 당신의 목표 직무에 맞는 맞춤형 성장 로드맵을 제공해드립니다. 단계별 학습 계획과 지역별 교육
                        프로그램을 추천받아 체계적으로 성장해보세요.
                      </p>
                      <div className="flex justify-center space-x-4">
                        <Button
                          onClick={handleStartGrowthJourney}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-lg font-semibold"
                        >
                          <TrendingUp className="mr-2 h-5 w-5" />
                          성장 여정 시작하기
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowGrowthPrompt(false)}
                          className="px-8 py-3 text-lg bg-transparent"
                        >
                          나중에 하기
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
