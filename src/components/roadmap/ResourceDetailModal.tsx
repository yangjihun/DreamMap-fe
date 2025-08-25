import { Resource } from "@/types/roadmap";
import React from "react";
import { Button } from "../ui/button";
import { Star } from "lucide-react";
import { toggleResourceState } from "@/redux/slices/roadmapSlice";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "@/redux/hooks";

export const ResourceDetailModal = ({
  isOpen,
  setIsOpen,
  selectedResource,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  selectedResource?: Resource;
}) => {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const handleComplete = (resourceId: string) => {
    if (id) dispatch(toggleResourceState({ resumeId: id, resourceId }));
  };

  return (
    <div className="p-6">
      {/* Modal Overlay */}
      {isOpen && selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          {/* Modal Box */}
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative">
            <div>
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold mb-4">
                {selectedResource.name}
              </h2>
            </div>
            {/* <div className="flex gap-2 mb-4">
              <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-md">
                강의
              </span>
              <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-md">
                초급
              </span>
            </div> */}
            <div className="space-y-6 mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">설명</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedResource.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-gray-500">제공자</span>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedResource.provider}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">가격</span>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedResource.price}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-gray-500">위치</span>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedResource.location}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">평점</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {selectedResource.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                바로가기
              </Button>
              <Button
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                onClick={() => handleComplete(selectedResource._id)}
              >
                학습 완료
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
