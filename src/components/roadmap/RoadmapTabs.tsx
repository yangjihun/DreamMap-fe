import { Button } from "../../components/ui/button";
import { Calendar, Clock, Award } from "lucide-react";
import { PeriodType } from "@/pages/RoadmapPage";

export const RoadmapTabs = ({
  selectedPeriod,
  setSelectedPeriod,
}: {
  selectedPeriod: PeriodType;
  setSelectedPeriod: React.Dispatch<React.SetStateAction<PeriodType>>;
}) => {
  const tabs = [
    {
      key: "3months" as PeriodType,
      label: "3개월 집중 과정",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      key: "6months" as PeriodType,
      label: "6개월 완성 과정",
      icon: <Clock className="w-4 h-4" />,
    },
    {
      key: "1year" as PeriodType,
      label: "1년 마스터 과정",
      icon: <Award className="w-4 h-4" />,
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={selectedPeriod === tab.key ? "default" : "outline"}
            onClick={() => setSelectedPeriod(tab.key)}
            className={
              selectedPeriod === tab.key
                ? "bg-blue-600 text-white"
                : "bg-transparent border-gray-300 hover:bg-gray-50"
            }
          >
            {tab.icon}
            <span className="ml-2">{tab.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
