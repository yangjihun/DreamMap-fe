import { useState, useEffect } from "react";
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
  Star,
  CheckCircle,
  TrendingUp,
  FileText,
  MessageSquare,
  Eye,
  Pencil,
} from "lucide-react";
import { ResumeSession, ResumeItem } from "../types/resume";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Header from "../components/ui/header";
import {
  getResume,
  generateResumeWithReview,
  setHasFeedbackResume,
  setIsEdit,
} from "../redux/slices/resumeSlice";
import { PDFPreviewModal } from "@/components/resume-to-pdf/PDFPreviewModal";
//import { createRoadmap } from "@/redux/slices/roadmapSlice";

export default function AnalysisPage() {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<ResumeItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const { resume, hasFeedbackResume } = useAppSelector((state) => state.resume);

  // 백엔드에서 받아올 데이터 (임시로 하드코딩)
  /* const resume: Resume = {
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
  */

  // Use mock data instead of API call

  const handleMergeFeedback = async () => {
    setIsGenerating(true);
    // 실제로는 백엔드 API 호출
    await dispatch(generateResumeWithReview(id || ""));
    setIsGenerating(false);
    alert("피드백이 반영된 새로운 이력서가 생성되었습니다!");
    dispatch(setHasFeedbackResume(true));
  };

  useEffect(() => {
    if (id) {
      dispatch(getResume(id));
    }
  }, [id]);

  useEffect(() => {
    const hasOldText = resume?.sessions?.some((session) =>
      session.items.some((item) => !!item.oldText)
    );
    dispatch(setHasFeedbackResume(hasOldText));
    console.log("??", resume);
  }, [resume]);

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

  const goToEdit = () => {
    dispatch(setIsEdit(true));
    navigate(`/resume/${id}`);
  };
  /*const handleRoadmapCreate = () => {
    if (!!id) {
      dispatch(createRoadmap(id));
    }
    navigate(`/roadmap/${id}`);
  };*/

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 pb-32">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/dashboard`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              목록으로
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {resume?.title}
              </h1>
              <p className="text-gray-600 mt-1">AI 분석 결과</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-100 text-blue-800">
              점수: {resume?.score}/100
            </Badge>
            <Badge variant="secondary">총 {resume?.totalCount}자</Badge>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex items-center gap-3 mb-8">
          <Button variant="outline" onClick={goToEdit} className="mr-3">
            <Pencil className="w-4 h-4 mr-1" />
            이력서 편집
          </Button>
          {!hasFeedbackResume ? (
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
          ) : (
            <Button
              variant="outline"
              onClick={() => setShowPDFPreview(true)}
              className="mr-3"
            >
              <Eye className="w-4 h-4 mr-1" />
              새로운 이력서 미리보기
            </Button>
          )}
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
                  {resume?.sessions?.map(
                    (session: ResumeSession, sessionIndex: number) => (
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

                        {session.title === "개인정보" ? (
                          // 개인정보 세션인 경우 모든 아이템을 한 카드에 표시
                          <div className="p-5 border-2 border-gray-200 rounded-xl bg-gray-50 ml-12">
                            <div className="space-y-3">
                              {session.items.map(
                                (item: ResumeItem, itemIndex: number) => (
                                  <div
                                    key={itemIndex}
                                    className="flex items-start gap-2"
                                  >
                                    <span className="font-semibold text-gray-700 min-w-fit">
                                      {item.title}:
                                    </span>
                                    <span className="text-gray-700 flex-1">
                                      {item.text}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        ) : (
                          // 일반 세션인 경우 기존 방식으로 표시
                          <div className="space-y-3 ml-12">
                            {session.items.map(
                              (item: ResumeItem, itemIndex: number) => {
                                const isDisabled = [
                                  "education",
                                  "personal_info",
                                  "personal-info",
                                  "skills",
                                  "degree",
                                  "award",
                                  "Award",
                                  "certificate",
                                  "Certificate",
                                  "Education",
                                  "Personal",
                                ].some((k) => session.key.includes(k));
                                return (
                                  <div
                                    key={itemIndex}
                                    className={`p-5 border-2 rounded-xl transition-all duration-200 ${
                                      isDisabled
                                        ? "cursor-default border-gray-200 bg-gray-50"
                                        : `cursor-pointer hover:shadow-md hover:scale-[1.02] ${
                                            selectedItem === item
                                              ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg"
                                              : "border-gray-200 bg-white hover:border-blue-300"
                                          }`
                                    }`}
                                    onClick={() =>
                                      !isDisabled
                                        ? setSelectedItem(item)
                                        : alert("분석하지 않는 항목입니다.")
                                    }
                                  >
                                    {item.title && (
                                      <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                                        {item.title}
                                      </h4>
                                    )}
                                    {session.key !== "intro" && (
                                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                        {item.companyAddress && (
                                          <span>{item.companyAddress}</span>
                                        )}
                                        {item.startDate && (
                                          <>
                                            {item.companyAddress && (
                                              <span>|</span>
                                            )}
                                            <span>
                                              {item.startDate}
                                              {item.endDate &&
                                                item.startDate ===
                                                  item.endDate && (
                                                  <span>~ {item.endDate}</span>
                                                )}
                                            </span>
                                          </>
                                        )}
                                      </div>
                                    )}
                                    <p className="text-gray-700 mb-3 leading-relaxed whitespace-pre-wrap">
                                      {item.text}
                                    </p>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        )}

                        {sessionIndex < resume?.sessions?.length - 1 && (
                          <Separator className="my-6" />
                        )}
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 리뷰 및 피드백 */}
          <div className="space-y-6">
            <div className="sticky top-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    선택된 항목 리뷰
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedItem ? (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <h4 className="font-semibold text-green-900 text-lg">
                            {selectedItem.title || "선택된 항목"}
                          </h4>
                        </div>
                        {selectedItem.review ? (
                          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-green-100">
                            <p className="text-green-800 text-sm leading-relaxed whitespace-pre-wrap">
                              {selectedItem.review}
                            </p>
                          </div>
                        ) : (
                          <div className="bg-white/60 rounded-lg p-4 border border-green-100">
                            <p className="text-green-700 text-sm font-medium">
                              선택된 항목에 대한 이전 AI 리뷰가 없습니다.
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-start gap-3">
                          <div className="text-blue-600 text-lg">💡</div>
                          <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">팁:</p>
                            <p>
                              왼쪽의 텍스트를 클릭하여 더 자세한 피드백을
                              확인하세요. 개인정보와 학력사항은 분석하지
                              않습니다.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="font-medium text-gray-700 mb-2">
                        항목을 선택해주세요
                      </h3>
                      <p className="text-sm text-gray-500">
                        왼쪽의 항목을 클릭하여 AI 리뷰를 확인하세요
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    전체 분석 요약
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {resume && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-purple-100">
                          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {resume.review || "아직 분석된 리뷰가 없습니다."}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {showPDFPreview && resume && (
        <PDFPreviewModal
          closeModal={() => setShowPDFPreview(false)}
          resume={resume}
        />
      )}
      {/* 하단 고정된 다음 단계 카드 */}
      {/*<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
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
                onClick={handleRoadmapCreate}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
              >
                <Map className="h-4 w-4" />
                커리어 로드맵 보기
              </Button>
            </div>
          </div>
        </div>
      </div>*/}
    </div>
  );
}
