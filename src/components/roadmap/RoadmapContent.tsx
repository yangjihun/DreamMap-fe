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
import { Roadmap } from "@/types/roadmap";

export const RoadmapContent = ({
  currentPlans,
}: {
  currentPlans?: Roadmap;
}) => {
  return (
    <div className="space-y-6">
      {currentPlans?.paths.map((path) => (
        <Card
          key={path.id}
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
                    {path.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {path.description}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {path.duration}
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
                  {path.skills.map((skill) => (
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
                  {path.resources.map((resource, resourceIndex) => (
                    <div
                      key={resourceIndex}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {resource.resourceType === "course" && (
                            <BookOpen className="h-3 w-3 text-blue-600" />
                          )}
                          {resource.resourceType === "study" && (
                            <Users className="h-3 w-3 text-blue-600" />
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
