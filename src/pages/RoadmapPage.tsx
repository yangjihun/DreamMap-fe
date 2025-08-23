import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Target, BookOpen, Users } from "lucide-react";
import { RoadmapTabs } from "@/components/roadmap/RoadmapTabs";
import { useState } from "react";
import { RoadmapContent } from "@/components/roadmap/RoadmapContent";
import { RoadmapHeader } from "@/components/roadmap/RoadmapHeader";

// 타입 정의
export type PeriodType = "3months" | "6months" | "1year";

export default function RoadmapPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("3months");

  return (
    <div className="min-h-screen bg-gray-50">
      <RoadmapHeader />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            커리어 로드맵
          </h2>
          <p className="text-lg text-gray-600">
            AI가 제안하는 맞춤형 커리어 성장 계획입니다
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 로드맵 내용 */}
          <div className="lg:col-span-2">
            <RoadmapTabs
              selectedPeriod={selectedPeriod}
              setSelectedPeriod={setSelectedPeriod}
            />
            <RoadmapContent selectedPeriod={selectedPeriod} />
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  진행 상황
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">전체 진행률</span>
                    <span className="text-sm font-medium text-gray-900">
                      25%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "25%" }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  추천 리소스
                </h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    온라인 강의
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    스터디 그룹
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    프로젝트 아이디어
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
