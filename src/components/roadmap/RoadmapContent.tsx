import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Target,
  Calendar,
  BookOpen,
  Users,
  MapPin,
  Star,
  ExternalLink,
} from "lucide-react";
import { PeriodType } from "@/pages/RoadmapPage";

interface Resource {
  type: "course" | "bootcamp" | "study" | "project";
  name: string;
  provider: string;
  location?: string;
  rating?: number;
  price?: string;
  url?: string;
}

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  skills: string[];
  resources: Resource[];
}

export const RoadmapContent = ({
  selectedPeriod,
}: {
  selectedPeriod: PeriodType;
}) => {
  // 샘플 로드맵 데이터(데이터 연동 시 수정 필요)
  const roadmapData: Record<PeriodType, RoadmapStep[]> = {
    "3months": [
      {
        id: "1",
        title: "기술 스택 기초 다지기",
        description:
          "React, TypeScript, Node.js의 기본 개념을 확실히 이해하고 간단한 프로젝트를 만들어보세요.",
        duration: "1-3개월",
        skills: ["React", "TypeScript", "Node.js", "JavaScript"],
        resources: [
          {
            type: "course",
            name: "React 완벽 가이드",
            provider: "Udemy",
            rating: 4.8,
            price: "₩29,000",
            url: "#",
          },
          {
            type: "study",
            name: "TypeScript 스터디 그룹",
            provider: "로컬 커뮤니티",
            location: "서울 강남구",
            url: "#",
          },
        ],
      },
      {
        id: "2",
        title: "프로젝트 기획 및 설계",
        description: "실제 서비스를 기획하고 기술적 아키텍처를 설계해보세요.",
        duration: "2-3개월",
        skills: ["프로젝트 기획", "시스템 설계", "데이터베이스 설계"],
        resources: [
          {
            type: "project",
            name: "포트폴리오 웹사이트",
            provider: "개인 프로젝트",
            url: "#",
          },
        ],
      },
    ],
    "6months": [
      {
        id: "3",
        title: "실무 프로젝트 경험",
        description:
          "오픈소스 기여나 사이드 프로젝트를 통해 실제 개발 경험을 쌓아보세요.",
        duration: "4-6개월",
        skills: ["Git", "협업", "코드 리뷰", "테스트"],
        resources: [
          {
            type: "bootcamp",
            name: "풀스택 개발 부트캠프",
            provider: "코딩아카데미",
            location: "서울 서초구",
            rating: 4.6,
            price: "₩2,500,000",
            url: "#",
          },
        ],
      },
    ],
    "1year": [
      {
        id: "4",
        title: "전문성 확립 및 네트워킹",
        description:
          "특정 도메인에서 전문성을 키우고 개발자 커뮤니티에 적극적으로 참여하세요.",
        duration: "7-12개월",
        skills: ["도메인 전문성", "네트워킹", "기술 발표", "멘토링"],
        resources: [
          {
            type: "study",
            name: "개발자 컨퍼런스",
            provider: "개발자 모임",
            location: "전국",
            url: "#",
          },
        ],
      },
    ],
  };

  const currentRoadmap = roadmapData[selectedPeriod];

  return (
    <div className="space-y-6">
      {currentRoadmap.map((step, index) => (
        <Card
          key={step.id}
          className="bg-white border border-gray-200 shadow-sm"
        >
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {step.description}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {step.duration}
                    </span>
                    <span className="flex items-center">
                      <BookOpen className="h-3 w-3 mr-1" />
                      학습 과정
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="ml-11">
                <h5 className="font-medium text-gray-900 mb-2 text-sm">
                  학습할 기술
                </h5>
                <div className="flex flex-wrap gap-2">
                  {step.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-gray-100 text-gray-700 text-xs"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div className="ml-11">
                <h5 className="font-medium text-gray-900 mb-2 text-sm">
                  추천 학습 자료
                </h5>
                <div className="space-y-2">
                  {step.resources.map((resource, resourceIndex) => (
                    <div
                      key={resourceIndex}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {resource.type === "course" && (
                            <BookOpen className="h-3 w-3 text-blue-600" />
                          )}
                          {resource.type === "bootcamp" && (
                            <Users className="h-3 w-3 text-blue-600" />
                          )}
                          {resource.type === "study" && (
                            <Users className="h-3 w-3 text-blue-600" />
                          )}
                          {resource.type === "project" && (
                            <Target className="h-3 w-3 text-blue-600" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {resource.name}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs text-gray-500">
                            <span>{resource.provider}</span>
                            {resource.location && (
                              <>
                                <span className="hidden sm:inline">•</span>
                                <span className="flex items-center space-x-1">
                                  <MapPin className="h-2 w-2" />
                                  <span>{resource.location}</span>
                                </span>
                              </>
                            )}
                            {resource.rating && (
                              <>
                                <span className="hidden sm:inline">•</span>
                                <span className="flex items-center space-x-1">
                                  <Star className="h-2 w-2 fill-yellow-400 text-yellow-400" />
                                  <span>{resource.rating}</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-2">
                        {resource.price && (
                          <span className="font-semibold text-gray-900 text-sm">
                            {resource.price}
                          </span>
                        )}
                        {resource.url && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-transparent h-7 w-7 p-0"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
