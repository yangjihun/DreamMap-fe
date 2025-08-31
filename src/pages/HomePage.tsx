import Header from "@/components/ui/header";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Sparkles,
  FileText,
  TrendingUp,
  Target,
  Award,
  Download,
  Check,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { responsive } from "@/lib/multi-carousel-responsive";

export default function HomePage() {
  const navigate = useNavigate();
  const successStoryData = [
    {
      id: "K",
      name: "고O석",
      job: "프론트엔드 개발자",
      userReview:
        "AI 분석을 통해 이력서의 약점을 파악하고, 3개월 만에 원하는 회사에 합격했습니다. 특히 기술 스택 부분이 크게 개선되었어요.",
      result: "연봉 20% 상승",
      icon: <TrendingUp className="h-5 w-5 mr-2 text-green-500" />,
      color: "blue",
    },
    {
      id: "B",
      name: "배O준",
      job: "백엔드 개발자",
      userReview:
        "AI 분석 결과를 바탕으로 이력서를 개선했더니, 면접 기회가 3배나 늘어났습니다. 특히 프로젝트 경험 부분이 크게 강화되었어요.",
      result: "면접 기회 3배 증가",
      icon: <Target className="h-5 w-5 mr-2 text-blue-500" />,
      color: "green",
    },
    {
      id: "Y",
      name: "양O훈",
      job: "풀스택 개발자",
      userReview:
        "프리미엄 템플릿으로 전문적인 이력서를 만들었습니다. 면접관들이 이력서 품질에 대해 칭찬을 많이 해주셨어요.",
      result: "면접 합격률 90%",
      icon: <Award className="h-5 w-5 mr-2 text-yellow-500" />,
      color: "purple",
    },
    {
      id: "L",
      name: "이O빈",
      job: "데이터 엔지니어",
      userReview:
        "AI가 제안한 키워드 최적화로 이력서가 눈에 띄었어요. 첫 지원에서 원하는 회사에 바로 합격했어요!",
      result: "서류 통과율 92%",
      icon: <FileText className="h-5 w-5 mr-2 text-indigo-500" />,
      color: "orange",
    },
  ];

  type BadgeColor = "blue" | "green" | "purple" | "orange";
  const colorClasses: Record<BadgeColor, { bg: string; text: string }> = {
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    green: { bg: "bg-green-100", text: "text-green-600" },
    purple: { bg: "bg-purple-100", text: "text-purple-600" },
    orange: { bg: "bg-orange-100", text: "text-orange-600" },
  };

  const plans = [
    {
      name: "기본",
      price: "무료",
      features: [
        "AI 이력서 분석",
        "기본 피드백 제공",
        "기본 템플릿 1개",
        "PDF 다운로드",
      ],
      buttonText: "무료로 시작하기",
      popular: false,
      onClick: () => navigate("/upload"),
    },
    {
      name: "프리미엄",
      price: "월 9,900원",
      features: [
        "상세 AI 분석 리포트",
        "맞춤형 개선 제안",
        "프리미엄 템플릿 10개",
        "무제한 PDF 다운로드",
        "우선 고객 지원",
      ],
      buttonText: "프리미엄 시작하기",
      popular: true,
      onClick: () => alert("추후 업데이트 예정입니다."),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-3xl shadow-xl border border-blue-100 p-16 mb-8 overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200 rounded-full opacity-20 -translate-x-16 -translate-y-16"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-200 rounded-full opacity-20 translate-x-12 -translate-y-12"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-200 rounded-full opacity-20 -translate-x-10 translate-y-10"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4 mr-2" />
                AI 기반 이력서 분석 서비스
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="whitespace-nowrap">AI로 완성하는</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 whitespace-nowrap">
                  완벽한 이력서
                </span>
              </h2>

              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                최신 AI 기술로 이력서를 분석하고 개선점을 제안합니다.
                <br />
                맞춤형 피드백으로 IT 커리어의 새로운 장을 시작하세요
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <div className="flex items-center text-sm text-gray-500">
                  <div className="flex -space-x-2 mr-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-semibold">
                        K
                      </span>
                    </div>
                    <div className="w-8 h-8 bg-green-100 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-green-600 text-xs font-semibold">
                        P
                      </span>
                    </div>
                    <div className="w-8 h-8 bg-purple-100 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-purple-600 text-xs font-semibold">
                        L
                      </span>
                    </div>
                  </div>
                  <span>이미 1,000+ 명이 사용 중</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    98%
                  </div>
                  <div className="text-sm text-gray-600">만족도</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    3배
                  </div>
                  <div className="text-sm text-gray-600">면접 기회 증가</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    2분 이내
                  </div>
                  <div className="text-sm text-gray-600">분석 완료</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl mb-4 text-gray-900">
              완벽한 이력서로 가는 3단계
            </h2>
            <p className="text-lg text-gray-600">
              AI 기술로 더욱 완벽한 이력서를 만들어보세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  AI 분석
                </h3>
                <p className="text-gray-600">
                  최신 AI 기술로 이력서를 분석하고 개선점을 제안합니다
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  맞춤형 이력서 생성
                </h3>
                <p className="text-gray-600">
                  AI 피드백을 반영하여 더욱 완벽한 새로운 이력서를 자동으로
                  생성합니다
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Download className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  프리미엄 템플릿
                </h3>
                <p className="text-gray-600">
                  기본 템플릿부터 프리미엄 템플릿까지, 원하는 스타일로 PDF
                  다운로드가 가능합니다
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success Stories Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4 text-gray-900">
              실제 사용자들의 성공 스토리
            </h2>
            <p className="text-lg text-gray-600">
              AI 분석을 통해 커리어를 성장시킨 사용자들의 이야기를 들어보세요
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <Carousel
              responsive={responsive}
              draggable
              infinite
              containerClass="pb-4"
              itemClass="px-3"
              arrows
              autoPlay
            >
              {successStoryData.map((item) => {
                const color =
                  colorClasses[item.color as keyof typeof colorClasses];
                return (
                  <div key={item.id} className="w-full">
                    <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow max-w-md mx-auto h-full">
                      <CardContent className="p-8 text-center">
                        <div
                          className={`w-16 h-16 ${color.bg} rounded-full mx-auto mb-6 flex items-center justify-center`}
                        >
                          <span
                            className={`${color.text} font-semibold text-2xl`}
                          >
                            {item.id}
                          </span>
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500 mb-4">{item.job}</p>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          "{item.userReview}"
                        </p>
                        <div className="flex items-center justify-center text-sm text-gray-500">
                          {item.icon}
                          <span className="font-medium">{item.result}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </Carousel>
          </div>
        </div>
        {/* Price Section */}
        <div className="mb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl mb-4 text-gray-900">요금제</h2>
              <p className="text-lg text-gray-600">
                당신에게 맞는 플랜을 선택하세요
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {plans.map((plan, index) => (
                <Card
                  key={index}
                  className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative ${
                    plan.popular ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <div className="text-3xl text-blue-600 mb-4">
                      {plan.price}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center space-x-3"
                        >
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full h-12 ${
                        plan.popular
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                          : "bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                      }`}
                      onClick={plan.onClick}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              당신도 성공 스토리의 주인공이 될 수 있습니다
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              AI 분석으로 완벽한 이력서를 만들어 커리어의 다음 단계를 준비하세요
            </p>
            <div className="flex justify-center">
              <Link to="/upload">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                >
                  이력서 분석 시작하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-lg font-semibold text-gray-900">
                미래지도
              </span>
            </div>
            <p className="text-gray-600">
              © 2025 미래지도. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
