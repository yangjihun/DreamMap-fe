import React, { useCallback, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  FileText,
  Sparkles,
  AlertCircle,
  File as FileIcon,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Header from "@/components/ui/header";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import {
  createNewResumeFromFile,
  createNewResumeWithSections,
  getAiReview,
  getResumeFromAI,
  setHasFeedbackResume,
} from "@/redux/slices/resumeSlice";
import FileUpload from "@/components/fileUpload";
import TextUpload, {
  type DraftSection,
  hasRealContent,
} from "@/components/textUpload";
type UploadMethod = "file" | "text";
type TextInputMethod = "paste" | "write";
type ProcessStatus = "idle" | "uploading" | "reviewing" | "done" | "error";

function slugify(raw: string) {
  const base = (raw ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
  const safe = base || "section";
  return /^[a-z]/.test(safe) ? safe : `sec-${safe}`;
}

const UploadPage: React.FC = () => {
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>("file");
  const [textInputMethod, setTextInputMethod] =
    useState<TextInputMethod>("write");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeTitle, setResumeTitle] = useState("");
  const [fullText, setFullText] = useState("");
  const [processStatus, setProcessStatus] = useState<ProcessStatus>("idle");
  const [sections, setSections] = useState<DraftSection[]>([
    {
      id: crypto.randomUUID(),
      title: "",
      items: [
        {
          id: crypto.randomUUID(),
          title: "",
          text: "• ",
          companyAddress: "",
          startDate: "",
          endDate: "",
        },
      ],
      key: "intro",
    },
  ]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.resume);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) setSelectedFile(file);
    },
    []
  );

  const isAnalyzeDisabled = useMemo(() => {
    if (loading) return true;
    if (!resumeTitle.trim()) return true;
    if (uploadMethod === "text") {
      if (textInputMethod === "paste") {
        // For paste mode, just check if there's any text content
        return !fullText.trim();
      } else {
        // For write mode, check sections and items
        return (
          !sections.every(
            (s) =>
              s.title.trim() &&
              s.items.length > 0 &&
              s.items.every(
                (item) => hasRealContent(item.text) && item.title.trim()
              )
          ) || sections.length === 0
        );
      }
    }
    return !selectedFile;
  }, [
    loading,
    resumeTitle,
    uploadMethod,
    textInputMethod,
    fullText,
    sections,
    selectedFile,
  ]);

  const handleAnalyze = useCallback(async () => {
    try {
      if (!resumeTitle.trim()) {
        window.alert("Resume 제목을 입력해주세요.");
        return;
      }

      setProcessStatus("uploading");
      if (uploadMethod === "text") {
        if (textInputMethod === "paste") {
          // Handle full text paste
          if (!fullText.trim()) {
            window.alert("이력서 텍스트를 입력해주세요.");
            return;
          }

          // Create a simple section structure from the full text
          const result = await dispatch(getResumeFromAI(fullText)).unwrap();

          setProcessStatus("reviewing");
          await dispatch(getAiReview(result.id));
          dispatch(setHasFeedbackResume(false));
          setProcessStatus("done");
          if (result?.id) navigate(`/analysis/${result.id}`);
        } else {
          // Handle item-by-item writing (existing logic)
          const validSections = sections.filter(
            (s) =>
              s.title.trim().length > 0 &&
              s.items.some(
                (item) =>
                  hasRealContent(item.text) && item.title.trim().length > 0
              )
          );
          if (validSections.length === 0) {
            window.alert("적어도 하나의 섹션에 제목과 내용을 입력해주세요.");
            return;
          }
          const payloadSections: Record<
            string,
            {
              title: string;
              items: Array<{
                title: string;
                text: string;
                startDate?: string;
                endDate?: string;
                companyAddress?: string;
              }>;
            }
          > = {};
          validSections.forEach((s) => {
            const key = s.key || slugify(s.title || "section");
            const validItems = s.items
              .filter((item) => hasRealContent(item.text))
              .map((item) => ({
                title: item.title.trim() || "새 항목",
                text: item.text.trim(),
                startDate: item.startDate || undefined,
                endDate: item.endDate || undefined,
                companyAddress: item.companyAddress || undefined,
              }));

            payloadSections[key] = {
              title: s.title.trim(),
              items: validItems,
            };
          });

          const result = await dispatch(
            createNewResumeWithSections({
              resumeTitle: resumeTitle.trim(),
              sections: payloadSections,
            })
          ).unwrap();

          setProcessStatus("reviewing");
          await dispatch(getAiReview(result.id));
          dispatch(setHasFeedbackResume(false));
          setProcessStatus("done");
          if (result?.id) navigate(`/analysis/${result.id}`);
        }
      } else {
        if (!selectedFile) {
          window.alert("파일을 선택해주세요.");
          setProcessStatus("idle"); //
          return;
        }
        setProcessStatus("uploading");

        const result = await dispatch(
          createNewResumeFromFile({
            file: selectedFile,
            resumeTitle: resumeTitle.trim(),
          })
        ).unwrap();

        setProcessStatus("reviewing");
        await dispatch(getAiReview(result.id));
        dispatch(setHasFeedbackResume(false));

        setProcessStatus("done");
        if (result?.id) navigate(`/analysis/${result.id}`);
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Resume 생성에 실패했습니다.";
      window.alert(msg);
      console.error("Resume 생성 중 오류:", err);
    }
  }, [
    dispatch,
    navigate,
    resumeTitle,
    sections,
    selectedFile,
    uploadMethod,
    textInputMethod,
    fullText,
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Show LoadingAnimation for uploading and reviewing states */}
      {processStatus === "uploading" || processStatus === "reviewing" ? (
        <LoadingAnimation
          title={
            processStatus === "uploading"
              ? "이력서를 생성하고 있습니다"
              : "AI 분석 중입니다"
          }
          description={
            processStatus === "uploading"
              ? "이력서를 업로드하고 데이터를 처리하고 있어요. 잠시만 기다려주세요!"
              : "AI가 이력서를 분석하고 개선점을 찾아내고 있어요. 잠시만 기다려주세요!"
          }
          progress={processStatus === "uploading" ? 40 : 70}
          variant="upload"
        />
      ) : (
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              새 이력서 생성하기
            </h1>
            <p className="text-lg text-gray-600">
              파일을 업로드하거나 텍스트를 입력하여 AI가 분석한 이력서를
              만들어보세요
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                이력서 제목
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Input
                  id="resume-title"
                  type="text"
                  placeholder="이력서 제목"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  className="border-2 border-gray-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  required
                />
              </div>
            </CardContent>
            <CardHeader>
              <CardTitle className="flex items-center">
                업로드 방법 선택
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  aria-pressed={uploadMethod === "file"}
                  onClick={() => setUploadMethod("file")}
                  className={`flex items-center justify-center py-3 px-6 rounded-md transition-all duration-200 ${
                    uploadMethod === "file"
                      ? "bg-white text-blue-600 shadow-sm"
                      : ""
                  }`}
                >
                  <FileIcon className="h-5 w-5 mr-2" /> 파일 업로드
                </button>
                <button
                  type="button"
                  aria-pressed={uploadMethod === "text"}
                  onClick={() => setUploadMethod("text")}
                  className={`flex items-center justify-center py-3 px-6 rounded-md transition-all duration-200 ${
                    uploadMethod === "text"
                      ? "bg-white text-blue-600 shadow-sm"
                      : ""
                  }`}
                >
                  <FileText className="h-5 w-5 mr-2" /> 텍스트 입력
                </button>
              </div>
              {uploadMethod === "file" && (
                <FileUpload
                  selectedFile={selectedFile}
                  onFileSelect={handleFileSelect}
                  onFileRemove={() => setSelectedFile(null)}
                />
              )}

              {uploadMethod === "text" && (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      텍스트 입력 방법
                    </label>
                    <div className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                      <button
                        type="button"
                        aria-pressed={textInputMethod === "paste"}
                        onClick={() => setTextInputMethod("paste")}
                        className={`flex items-center justify-center py-3 px-6 rounded-md transition-all duration-200 ${
                          textInputMethod === "paste"
                            ? "bg-white text-blue-600 shadow-sm"
                            : ""
                        }`}
                      >
                        전체 텍스트 붙여넣기
                      </button>
                      <button
                        type="button"
                        aria-pressed={textInputMethod === "write"}
                        onClick={() => setTextInputMethod("write")}
                        className={`flex items-center justify-center py-3 px-6 rounded-md transition-all duration-200 ${
                          textInputMethod === "write"
                            ? "bg-white text-blue-600 shadow-sm"
                            : ""
                        }`}
                      >
                        항목별로 적어넣기
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {textInputMethod === "paste"
                        ? "긴 텍스트나 복사된 이력서를 한 번에 붙여넣을 때 사용하세요"
                        : "섹션별로 세분화하여 이력서를 작성할 때 사용하세요"}
                    </p>
                  </div>

                  {textInputMethod === "paste" ? (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        이력서 전체 텍스트
                      </label>
                      <textarea
                        placeholder="이력서 전체 텍스트를 여기에 붙여넣으세요..."
                        value={fullText}
                        onChange={(e) => setFullText(e.target.value)}
                        className="border-2 border-gray-200 bg-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 px-3 py-2 rounded-md w-full min-h-[200px] resize-none"
                      />
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                        <span>문자수: {fullText.length}자</span>
                        <span
                          className={
                            fullText.length > 1000
                              ? "text-blue-600 font-medium"
                              : ""
                          }
                        >
                          {fullText.length > 1000 ? "✓ 긴 텍스트 감지됨" : ""}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <TextUpload sections={sections} onChange={setSections} />
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzeDisabled}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-12 py-4 text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl"
                >
                  {processStatus === "done" ? (
                    <>
                      <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
                      <span>Resume 생성이 완료되었습니다.</span>
                    </>
                  ) : processStatus === "error" ? (
                    <>
                      <AlertCircle className="h-6 w-6 mr-3 text-red-600" />
                      <span>오류가 발생했습니다. 다시 시도해주세요.</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-6 w-6 mr-3" /> 새 이력서 생성하기
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI 분석</h3>
                <p className="text-sm text-gray-600">
                  최신 AI 기술로 이력서를 분석하고 개선점을 제안합니다
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  맞춤형 피드백
                </h3>
                <p className="text-sm text-gray-600">
                  IT 업계 표준에 맞는 구체적인 개선 방향을 제시합니다
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">즉시 결과</h3>
                <p className="text-sm text-gray-600">
                  몇 분 내에 분석 결과와 개선된 이력서를 받아보세요
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
