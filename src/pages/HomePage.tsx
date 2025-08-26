import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Sparkles,
  User,
  ArrowRight,
  FileText,
  TrendingUp,
  Target,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">미래지도</h1>
            </div>
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                <User className="h-4 w-4 mr-2" />
                로그인
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              당신의 인생을 설계해드립니다
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              AI가 분석하는 맞춤형 레쥬메로 IT 커리어의 새로운 장을 시작하세요
            </p>
            <Link to="/dashboard">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg"
              >
                리뷰 바로가기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Life Timeline - 인생네컷 스타일 */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            당신의 성장 여정
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {/* 현재 */}
            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <img
                    src="/current-situation-silhouette.png"
                    alt="현재"
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">현재</h4>
                <p className="text-sm text-gray-600">
                  지금의 나, 새로운 시작점
                </p>
              </CardContent>
            </Card>

            {/* 3개월 후 */}
            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <img
                    src="/placeholder-i3ogj.png"
                    alt="3개월 후"
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">3개월 후</h4>
                <p className="text-sm text-gray-600">스킬 향상과 경험 축적</p>
              </CardContent>
            </Card>

            {/* 6개월 후 */}
            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <img
                    src="/confident-silhouette.png"
                    alt="6개월 후"
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">6개월 후</h4>
                <p className="text-sm text-gray-600">전문성 확립과 네트워킹</p>
              </CardContent>
            </Card>

            {/* 1년 후 */}
            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <img
                    src="/placeholder-orapj.png"
                    alt="1년 후"
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">1년 후</h4>
                <p className="text-sm text-gray-600">목표 달성과 새로운 도전</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI 레쥬메 분석
              </h3>
              <p className="text-gray-600">
                최신 AI 기술로 레쥬메를 분석하고 개선점을 제안합니다
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                성장 로드맵
              </h3>
              <p className="text-gray-600">
                개인 맞춤형 커리어 성장 계획과 학습 경로를 제공합니다
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                맞춤형 추천
              </h3>
              <p className="text-gray-600">
                지역과 직무를 고려한 교육 프로그램과 스터디를 추천합니다
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <Award className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            지금 시작하세요
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            수천 명의 IT 전문가들이 ResumeAI와 함께 성공적인 커리어 전환을
            이뤘습니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                무료로 시작하기
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 bg-transparent"
              >
                로그인
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">
                ResumeAI
              </span>
            </div>
            <p className="text-gray-600">© 2024 ResumeAI. 모든 권리 보유.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
