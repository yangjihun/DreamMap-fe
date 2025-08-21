import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "@radix-ui/react-separator";
import {
  FileText,
  Download,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  Star,
  TrendingUp,
} from "lucide-react";

interface AnalysisResult {
  id: string;
  originalResume: string;
  feedback: string[];
  improvedResume: string;
  score: number;
  status: "analyzing" | "completed" | "failed";
}

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>({
    id: id || "1",
    originalResume: `[이력서 내용]
• 웹 개발 경험 2년
• React, Node.js, MongoDB 사용
• 프로젝트 A, B, C 참여`,
    feedback: [
      "구체적인 성과 지표가 부족합니다 (예: 사용자 수, 성능 개선률 등)",
      "기술 스택의 깊이를 더 자세히 설명해주세요",
      "프로젝트에서 해결한 문제점과 해결 방법을 구체적으로 작성해주세요",
      "협업 경험과 팀 기여도에 대한 설명이 필요합니다",
    ],
    improvedResume: `[개선된 이력서]
• 웹 개발 경험 2년
• React, Node.js, MongoDB 전문가
• 프로젝트 A: 사용자 10,000명 달성, 페이지 로딩 속도 40% 개선
• 프로젝트 B: 팀 리더로서 5명과 협업, 3개월 내 완성
• 프로젝트 C: 마이크로서비스 아키텍처 설계 및 구현`,
    score: 85,
    status: "completed",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleMergeFeedback = async () => {
    setIsGenerating(true);
    // AI가 피드백을 융합하여 새로운 레쥬메를 생성하는 로직
    setTimeout(() => {
      setAnalysisResult((prev) => ({
        ...prev,
        improvedResume: `[AI가 생성한 최종 이력서]
• 웹 개발 경험 2년
• React, Node.js, MongoDB 전문가
• 프로젝트 A: 사용자 10,000명 달성, 페이지 로딩 속도 40% 개선
• 프로젝트 B: 팀 리더로서 5명과 협업, 3개월 내 완성
• 프로젝트 C: 마이크로서비스 아키텍처 설계 및 구현
• 협업: Git, Jira를 활용한 체계적인 프로젝트 관리
• 성과: 총 3개 프로젝트 완성, 팀 생산성 25% 향상`,
        score: 95,
      }));
      setIsGenerating(false);
    }, 3000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([analysisResult.improvedResume], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `improved-resume-${id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleNavigateToRoadmap = () => {
    navigate(`/roadmap/${id}`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                AI 이력서 분석 결과
              </h1>
              <p className="text-gray-600 mt-2">이력서 ID: {id} • 분석 완료</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                className={`px-4 py-2 text-lg font-semibold ${getScoreColor(
                  analysisResult.score
                )}`}
              >
                <Star className="h-4 w-4 mr-2" />
                {analysisResult.score}점
              </Badge>
              <Button
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                다운로드
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 원본 이력서 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                원본 이력서
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                  {analysisResult.originalResume}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* AI 피드백 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                AI 피드백
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisResult.feedback.map((feedback, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-orange-800">{feedback}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* 개선된 이력서 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
              개선된 이력서
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <pre className="whitespace-pre-wrap text-sm text-purple-800 font-mono">
                {analysisResult.improvedResume}
              </pre>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge className="px-3 py-1 bg-green-100 text-green-800">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  개선 완료
                </Badge>
                <span className="text-sm text-gray-600">
                  점수: {analysisResult.score}점
                </span>
              </div>

              <Button
                onClick={handleMergeFeedback}
                disabled={isGenerating}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    AI 분석 중...
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    피드백 융합하기
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 성장 제안 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />더
              성장하시겠습니까?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              현재 선택하신 IT 직업에 필요한 커리어 로드맵을 AI가 그려드립니다.
              지역을 고려한 스터디 그룹과 부트캠프를 추천해드려요!
            </p>
            <Button
              onClick={handleNavigateToRoadmap}
              className="bg-green-600 hover:bg-green-700"
            >
              로드맵 생성하기
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
