import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  ArrowLeft,
  Download,
  Star,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  MessageSquare,
  Map,
} from "lucide-react";
import { Resume, ResumeSession, ResumeItem } from "../types/resume";

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<ResumeItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // 백엔드에서 받아올 데이터 (임시로 하드코딩)
  const resumeData: Resume = {
    id: id || "1",
    userId: "user123",
    title: "프론트엔드 개발자 이력서",
    totalCount: 1250,
    score: 85,
    status: "analyzed",
    starred: true,
    lastModified: "2024년 1월 15일",
    sessions: [
      {
        key: "intro",
        title: "자기소개",
        wordCount: 150,
        items: [
          {
            title: "인사말",
            text: "안녕하세요. 5년간의 프론트엔드 개발 경험을 바탕으로 사용자 중심의 웹 서비스를 만들어온 개발자입니다.",
            review:
              "자기소개가 명확하고 구체적입니다. 경험을 바탕으로 한 자신감 있는 어조가 좋습니다.",
          },
        ],
      },
      {
        key: "body",
        title: "경력사항",
        wordCount: 800,
        items: [
          {
            title: "ABC 테크 - 시니어 프론트엔드 개발자",
            text: "React, TypeScript를 활용한 대규모 웹 애플리케이션 개발 및 팀 리드. 사용자 경험 개선 프로젝트를 주도하여 전환율 15% 향상.",
            startDate: "2022-03",
            endDate: "현재",
            review:
              "구체적인 성과와 기술 스택이 잘 드러납니다. 팀 리드 경험도 강조되어 있어 좋습니다.",
          },
          {
            title: "XYZ 스타트업 - 프론트엔드 개발자",
            text: "Vue.js를 활용한 웹 서비스 개발 및 사용자 경험 개선. 모바일 최적화를 통해 페이지 로딩 속도 30% 단축.",
            startDate: "2020-01",
            endDate: "2022-02",
            review:
              "기술적 성과가 구체적으로 표현되어 있습니다. 수치화된 결과가 인상적입니다.",
          },
        ],
      },
      {
        key: "closing",
        title: "기술 스택 및 프로젝트",
        wordCount: 300,
        items: [
          {
            title: "기술 스택",
            text: "React, TypeScript, Node.js, PostgreSQL, Docker, AWS",
            review:
              "현재 시장에서 요구하는 핵심 기술들을 잘 보유하고 있습니다.",
          },
          {
            title: "주요 프로젝트",
            text: "E-커머스 플랫폼, 관리자 대시보드, 모바일 앱",
            review:
              "다양한 도메인의 프로젝트 경험이 있어 적응력이 뛰어날 것으로 보입니다.",
          },
        ],
      },
    ],
    createdAt: "2024-01-15T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z",
  };

  const handleMergeFeedback = async () => {
    setIsGenerating(true);
    // 실제로는 백엔드 API 호출
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGenerating(false);
    alert("피드백이 반영된 새로운 이력서가 생성되었습니다!");
  };

  const handleDownload = () => {
    // 실제로는 백엔드에서 PDF 생성 후 다운로드
    alert("이력서 다운로드가 시작됩니다.");
  };

  const getSessionIcon = (key: string) => {
    switch (key) {
      case "intro":
        return <FileText className="h-5 w-5" />;
      case "body":
        return <TrendingUp className="h-5 w-5" />;
      case "closing":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getSessionColor = (key: string) => {
    switch (key) {
      case "intro":
        return "bg-blue-100 text-blue-800";
      case "body":
        return "bg-green-100 text-green-800";
      case "closing":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 pb-32">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              뒤로가기
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {resumeData.title}
              </h1>
              <p className="text-gray-600 mt-1">AI 분석 결과</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-100 text-blue-800">
              점수: {resumeData.score}/100
            </Badge>
            <Badge variant="secondary">총 {resumeData.totalCount}자</Badge>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex items-center gap-3 mb-8">
          <Button
            onClick={handleMergeFeedback}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                생성 중...
              </>
            ) : (
              <>
                <Star className="h-4 w-4" />
                피드백 반영하여 새 이력서 생성
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            다운로드
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 원본 이력서 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  원본 이력서
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {resumeData.sessions.map((session, sessionIndex) => (
                    <div key={sessionIndex} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${getSessionColor(
                            session.key
                          )}`}
                        >
                          {getSessionIcon(session.key)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {session.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {session.wordCount}자
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 ml-12">
                        {session.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-blue-300 hover:shadow-sm ${
                              selectedItem === item
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200"
                            }`}
                            onClick={() => setSelectedItem(item)}
                          >
                            {item.title && (
                              <h4 className="font-medium text-gray-900 mb-2">
                                {item.title}
                              </h4>
                            )}
                            <p className="text-gray-700 mb-2">{item.text}</p>
                            {(item.startDate || item.endDate) && (
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                {item.startDate} - {item.endDate || "현재"}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {sessionIndex < resumeData.sessions.length - 1 && (
                        <Separator className="my-6" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 리뷰 및 피드백 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  AI 리뷰
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedItem ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">
                        {selectedItem.title || "선택된 항목"}
                      </h4>
                      <p className="text-blue-800 text-sm">
                        {selectedItem.review}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>
                        💡 <strong>팁:</strong> 이 항목을 클릭하여 더 자세한
                        피드백을 확인하세요.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>왼쪽의 항목을 클릭하여</p>
                    <p>AI 리뷰를 확인하세요</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>전체 분석 요약</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">전체 점수</span>
                    <Badge className="bg-green-100 text-green-800">
                      {resumeData.score}/100
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">총 글자 수</span>
                    <span className="font-medium">
                      {resumeData.totalCount}자
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">섹션 수</span>
                    <span className="font-medium">
                      {resumeData.sessions.length}개
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 하단 고정된 다음 단계 카드 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                다음 단계로 진행하세요
              </h3>
              <p className="text-sm text-gray-600">
                AI 분석 결과를 바탕으로 더 나은 이력서를 만들어보세요
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate(`/roadmap/${id}`)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
              >
                <Map className="h-4 w-4" />
                커리어 로드맵 보기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
