import { CheckCircle } from "lucide-react";

interface LoadingAnimationProps {
  title: string;
  description: string;
  progress?: number;
  showSteps?: boolean;
  variant?: "analysis" | "upload";
}

export function LoadingAnimation({
  title,
  description,
  progress = 60,
  showSteps = true,
  variant = "analysis",
}: LoadingAnimationProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        {/* Main Animation Container */}
        <div className="text-center space-y-8">
          {/* Animated Icon */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-spin"></div>
              </div>
            </div>

            {/* Orbiting dots */}
            <div className="absolute inset-0 animate-spin">
              <div className="absolute top-0 left-1/2 w-3 h-3 bg-blue-400 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-1/2 right-0 w-3 h-3 bg-purple-400 rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-indigo-400 rounded-full -translate-x-1/2 translate-y-1/2"></div>
              <div className="absolute top-1/2 left-0 w-3 h-3 bg-cyan-400 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
              {description}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-full">
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                {/* Moving highlight effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent shimmer"></div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">진행률: {progress}%</p>
          </div>

          {/* Animated Steps */}
          {showSteps && (
            <div className="flex items-center justify-center space-x-8">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-gray-600">
                  {variant === "analysis" ? "데이터 분석" : "파일 업로드"}
                </span>
              </div>

              <div className="w-12 h-0.5 bg-gray-300"></div>

              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">
                  {variant === "analysis" ? "AI 리뷰 생성" : "AI 분석"}
                </span>
              </div>

              <div className="w-12 h-0.5 bg-gray-300"></div>

              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <span className="text-sm text-gray-600">완료</span>
              </div>
            </div>
          )}

          {/* Fun Facts */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <p className="text-sm text-gray-600">
              💡 <span className="font-medium">팁:</span>{" "}
              {variant === "analysis"
                ? "분석이 완료되면 구체적인 개선 방향과 함께 AI 피드백을 받을 수 있어요!"
                : "업로드가 완료되면 AI가 이력서를 분석하고 개선점을 제안해드려요!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
