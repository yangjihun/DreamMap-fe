import React, { useState } from "react";
import { Card } from "../ui/card";
import { CheckCircle2 } from "lucide-react";
import { Resource } from "@/types/roadmap";
import { Button } from "../ui/button";

export const RoadmapResourceList = ({
  currentResources,
  handleOpenModal,
}: {
  currentResources?: Resource[];
  handleOpenModal: (resource: Resource) => void;
}) => {
  return (
    <Card className="p-6 bg-white shadow-sm border border-gray-200">
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">학습 자료 모아보기</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {currentResources &&
            currentResources.map((resource) => (
              <div
                key={resource._id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleOpenModal(resource)}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-md flex-shrink-0">
                    {/* {getResourceIcon(resource.resourceType)} */}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {resource.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {resource.provider}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      // toggleFavorite(resource.id);
                    }}
                  >
                    <CheckCircle2
                    // className={`w-3 h-3 ${
                    //   favorites.includes(resource.id)
                    //     ? "fill-red-500 text-red-500"
                    //     : "text-gray-400 hover:text-red-500"
                    // }`}
                    />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Card>
  );
};
