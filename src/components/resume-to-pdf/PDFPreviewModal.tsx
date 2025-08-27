import { Download, Eye, X } from "lucide-react";
import { Button } from "../ui/button";
import { Resume } from "@/types/resume";
import { ResumeDocument, ResumePDFViewer } from "./ResumePDFViewer";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

export const PDFPreviewModal = ({
  closeModal,
  resume,
}: {
  closeModal: () => void;
  resume: Resume;
}) => {
  const downloadResumePDF = async (resume: Resume) => {
    const fileName = "new_resume";
    const blob = await pdf(<ResumeDocument resume={resume} />).toBlob();
    saveAs(blob, fileName);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={closeModal} />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span className="text-lg font-semibold">
              새로운 이력서 미리보기
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeModal}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="max-w-2xl mx-auto space-y-6">
            <ResumePDFViewer resume={resume} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={closeModal}>
            닫기
          </Button>
          <Button
            onClick={() => downloadResumePDF(resume)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            PDF 다운로드
          </Button>
        </div>
      </div>
    </div>
  );
};
