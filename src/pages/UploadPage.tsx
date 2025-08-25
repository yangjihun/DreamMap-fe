import React, { useCallback, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Upload,
  FileText,
  Sparkles,
  Loader2,
  AlertCircle,
  File as FileIcon,
  X,
  Plus,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { createNewResumeFromFile, createNewResumeWithSections } from "../redux/slices/resumeSlice";

type UploadMethod = "file" | "text";

export type DraftSection = {
  id: string;
  title: string;
  text: string;
  key: string;
};

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

function uniqueKey(baseTitle: string, existing: string[]) {
  const base = slugify(baseTitle);
  let k = base;
  let i = 1;
  while (existing.includes(k)) k = `${base}-${i++}`;
  return k;
}

const SectionCard: React.FC<{
  section: DraftSection;
  index: number;
  canRemove: boolean;
  onChange: (id: string, patch: Partial<DraftSection>) => void;
  onRemove: (id: string) => void;
}> = ({ section, index, canRemove, onChange, onRemove }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <Label className="text-base font-medium text-gray-700">섹션 {index + 1}</Label>
        {canRemove && (
          <Button
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onRemove(section.id)}
            aria-label={`섹션 ${index + 1} 삭제`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid gap-3">
        <Input
          placeholder="섹션 제목"
          value={section.title}
          onChange={(e) => onChange(section.id, { title: e.target.value })}
          className="mb-2"
        />
        <Textarea
          placeholder="이 섹션에 들어갈 내용을 입력하세요..."
          value={section.text}
          onChange={(e) => onChange(section.id, { text: e.target.value })}
          rows={index === 0 ? 4 : 5}
        />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>문자수: {section.text.length}자</span>
        </div>
      </div>
    </div>
  );
};

const UploadPage: React.FC = () => {
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeTitle, setResumeTitle] = useState("");
  const [sections, setSections] = useState<DraftSection[]>([
    { id: crypto.randomUUID(), title: "", text: "", key: "intro" },
  ]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.resume);

  const totalChars = useMemo(() => sections.reduce((acc, s) => acc + s.text.length, 0), [sections]);
  const status = loading ? (error ? "error" : "loading") : error ? "error" : "idle";

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
  }, []);

  const addSection = useCallback(() => {
    const existingKeys = sections.map((s) => s.key);
    const key = uniqueKey(`section-${sections.length + 1}`, existingKeys);
    setSections((prev) => [...prev, { id: crypto.randomUUID(), title: "", text: "", key }]);
  }, [sections]);

  const removeSection = useCallback((id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const updateSection = useCallback((id: string, patch: Partial<DraftSection>) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const next: DraftSection = { ...s, ...patch };
        if (typeof patch.title === "string") {
          const existingKeys = prev.filter((x) => x.id !== id).map((x) => x.key);
          next.key = uniqueKey(patch.title || "section", existingKeys);
        }
        return next;
      })
    );
  }, []);

  const isAnalyzeDisabled = useMemo(() => {
    if (loading) return true;
    if (!resumeTitle.trim()) return true;
    return uploadMethod === "text" ? sections.every((s) => !s.text.trim()) : !selectedFile;
  }, [loading, resumeTitle, uploadMethod, sections, selectedFile]);

  const handleAnalyze = useCallback(async () => {
    try {
      if (!resumeTitle.trim()) {
        window.alert("Resume 제목을 입력해주세요.");
        return;
      }

      if (uploadMethod === "text") {
        const filled = sections.filter((s) => s.text.trim().length > 0);
        if (filled.length === 0) {
          window.alert("적어도 하나의 섹션에 내용을 입력해주세요.");
          return;
        }
        const payloadSections: Record<string, { text: string; title?: string }> = {};
        filled.forEach((s) => {
          const key = s.key || slugify(s.title || "section");
          payloadSections[key] = { text: s.text.trim(), title: s.title.trim() || undefined };
        });

        const result = await dispatch(
          createNewResumeWithSections({ resumeTitle: resumeTitle.trim(), sections: payloadSections })
        ).unwrap();
        if (result?.id) navigate(`/analysis/${result.id}`);
      } else {
        if (!selectedFile) {
          window.alert("파일을 선택해주세요.");
          return;
        }
        const result = await dispatch(
          createNewResumeFromFile({ file: selectedFile, sessionKey: "intro", itemTitle: undefined, resumeTitle: resumeTitle.trim() })
        ).unwrap();
        if (result?.id) navigate(`/analysis/${result.id}`);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || "Resume 생성에 실패했습니다.";
      window.alert(msg);
      console.error("Resume 생성 중 오류:", err);
    }
  }, [dispatch, navigate, resumeTitle, sections, selectedFile, uploadMethod]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">새 이력서 생성</h1>
          <p className="text-lg text-gray-600">새로운 이력서를 생성합니다. 파일을 업로드하거나 텍스트를 직접 입력하세요.</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-purple-600" /> 이력서 제목
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
                className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                required
              />
              <p className="text-sm text-gray-500 mt-2">새 이력서의 제목을 입력해주세요</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-purple-600" /> 업로드 방법 선택
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                aria-pressed={uploadMethod === "file"}
                onClick={() => setUploadMethod("file")}
                className={`flex items-center justify-center py-3 px-6 rounded-md transition-all duration-200 ${
                  uploadMethod === "file" ? "bg-white text-blue-600 shadow-sm" : ""
                }`}
              >
                <FileIcon className="h-5 w-5 mr-2" /> 파일 업로드
              </button>
              <button
                type="button"
                aria-pressed={uploadMethod === "text"}
                onClick={() => setUploadMethod("text")}
                className={`flex items-center justify-center py-3 px-6 rounded-md transition-all duration-200 ${
                  uploadMethod === "text" ? "bg-white text-blue-600 shadow-sm" : ""
                }`}
              >
                <FileText className="h-5 w-5 mr-2" /> 텍스트 입력
              </button>
            </div>

            {uploadMethod === "file" && (
              <div className="mt-6 space-y-6">
                <div>
                  <Label className="text-base font-medium text-gray-700 mb-3 block">이력서 파일 선택</Label>
                  <div className="mt-2">
                    {selectedFile ? (
                      <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileIcon className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">{selectedFile.name}</span>
                          <span className="text-xs text-blue-600">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)} className="text-blue-600 hover:text-blue-800">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
                        <div className="space-y-4 text-center">
                          <Upload className="mx-auto h-16 w-16 text-gray-400" />
                          <div className="space-y-2">
                            <Label className="relative cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-block">
                              <span className="flex items-center">
                                <FileIcon className="h-4 w-4 mr-2" /> 파일 업로드
                              </span>
                              <Input type="file" className="sr-only" accept=".pdf" onChange={handleFileSelect} />
                            </Label>
                          </div>
                          <p className="text-xs text-gray-500">PDF 파일만 지원합니다</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {uploadMethod === "text" && (
              <div className="mt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-base text-gray-700">필요한 만큼 섹션을 추가해 입력하세요. 총 {totalChars}자</p>
                  <Button variant="outline" onClick={addSection}>
                    <Plus className="h-4 w-4 mr-2" /> 섹션 추가
                  </Button>
                </div>

                {sections.map((s, idx) => (
                  <SectionCard
                    key={s.id}
                    section={s}
                    index={idx}
                    canRemove={sections.length > 1}
                    onChange={updateSection}
                    onRemove={removeSection}
                  />
                ))}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    💡 <strong>팁:</strong> 적어도 하나의 섹션에는 내용을 입력해야 합니다. 제목은 선택사항이며, 비워두면 기본 제목이 사용됩니다.
                  </p>
                </div>
              </div>
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
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                    <span>Resume을 생성하고 있습니다...</span>
                  </>
                ) : status === "error" ? (
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
              <p className="text-sm text-gray-600">최신 AI 기술로 이력서를 분석하고 개선점을 제안합니다</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">맞춤형 피드백</h3>
              <p className="text-sm text-gray-600">IT 업계 표준에 맞는 구체적인 개선 방향을 제시합니다</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">즉시 결과</h3>
              <p className="text-sm text-gray-600">몇 분 내에 분석 결과와 개선된 이력서를 받아보세요</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
