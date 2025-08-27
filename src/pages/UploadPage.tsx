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
  Loader2,
  AlertCircle,
  File as FileIcon,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Header from "@/components/ui/header";
import {
  createNewResumeFromFile,
  createNewResumeWithSections,
  getAiReview,
  setHasFeedbackResume,
} from "@/redux/slices/resumeSlice";
import FileUpload from "@/components/fileUpload";
import TextUpload, {
  type DraftSection,
  hasRealContent,
} from "@/components/textUpload";
type UploadMethod = "file" | "text";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeTitle, setResumeTitle] = useState("");
  const [processStatus, setProcessStatus] = useState<ProcessStatus>("idle");
  const [sections, setSections] = useState<DraftSection[]>([
    {
      id: crypto.randomUUID(),
      title: "",
      items: [{ id: crypto.randomUUID(), title: "", text: "• " }],
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
    return !selectedFile;
  }, [loading, resumeTitle, uploadMethod, sections, selectedFile]);

  const handleAnalyze = useCallback(async () => {
    try {
      if (!resumeTitle.trim()) {
        window.alert("Resume 제목을 입력해주세요.");
        return;
      }

      setProcessStatus("uploading");
      if (uploadMethod === "text") {
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
          { title: string; items: Array<{ title: string; text: string }> }
        > = {};
        validSections.forEach((s) => {
          const key = s.key || slugify(s.title || "section");
          const validItems = s.items
            .filter((item) => hasRealContent(item.text))
            .map((item) => ({
              title: item.title.trim() || "새 항목",
              text: item.text.trim(),
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
      } else {
        if (!selectedFile) {
          window.alert("파일을 선택해주세요.");
          return;
        }
        setProcessStatus("uploading");
        const result = await dispatch(
          createNewResumeFromFile({
            file: selectedFile,
            sessionKey: "intro",
            itemTitle: undefined,
            resumeTitle: resumeTitle.trim(),
          })
        ).unwrap();
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
  }, [dispatch, navigate, resumeTitle, sections, selectedFile, uploadMethod]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            새 이력서 생성
          </h1>
          <p className="text-lg text-gray-600">
            새로운 이력서를 생성합니다. 파일을 업로드하거나 텍스트를 직접
            입력하세요.
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
              <TextUpload sections={sections} onChange={setSections} />
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
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-12 py-4 text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {processStatus === "uploading" ? (
                  <>
                    <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                    <span>Resume을 생성하고 있습니다...</span>
                  </>
                ) : processStatus === "reviewing" ? (
                  <>
                    <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                    <span>Resume을 분석하고 있습니다...</span>
                  </>
                ) : processStatus === "done" ? (
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
    </div>
  );
};

export default UploadPage;
