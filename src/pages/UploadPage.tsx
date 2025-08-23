import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import {
  Upload,
  FileText,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  File,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getAiReview } from "../redux/slices/resumeSlice";

type UploadMethod = "file" | "text";
type UploadStatus = "idle" | "uploading" | "analyzing" | "completed" | "failed";

interface UploadData {
  method: UploadMethod;
  content: string;
  fileName?: string;
}

export default function UploadPage() {
  const dispatch = useAppDispatch();
  const { loading, resume } = useAppSelector((state) => state.resume);
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>("file");
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadData, setUploadData] = useState<UploadData>({
    method: "file",
    content: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState("");
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // 파일 내용을 읽어서 content에 저장
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setUploadData({
          method: "file",
          content,
          fileName: file.name,
        });
      };
      reader.readAsText(file);
    }
  };

  const handleTextChange = (content: string) => {
    setTextContent(content);
    setUploadData({
      method: "text",
      content,
    });
  };

  const handleAnalyze = async () => {
    if (!uploadData.content.trim()) {
      alert("내용을 입력하거나 파일을 업로드해주세요.");
      return;
    }

    setUploadStatus("uploading");

    // 파일 업로드 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setUploadStatus("analyzing");

    // AI 분석 요청
    try {
      await dispatch(getAiReview("68a7b8d77433cbd888394172"));
    } catch (error) {
      setUploadStatus("failed");
      return;
    }
  };

  // loading 상태에 따라 uploadStatus 업데이트
  useEffect(() => {
    if (uploadStatus === "analyzing") {
      if (loading) {
        setUploadStatus("analyzing");
      } else {
        setUploadStatus("completed");
        // 분석 완료 후 분석 페이지로 이동
        setTimeout(() => {
          navigate(`/analysis/${resume?.id}`);
        }, 1500);
      }
    }
  }, [loading, uploadStatus]);

  const removeFile = () => {
    setSelectedFile(null);
    setUploadData({
      method: "file",
      content: "",
    });
  };

  const isAnalyzeDisabled = () => {
    return uploadStatus !== "idle" || !uploadData.content.trim();
  };

  const getStatusMessage = () => {
    switch (uploadStatus) {
      case "uploading":
        return "파일을 업로드하고 있습니다...";
      case "analyzing":
        return "AI가 이력서를 분석하고 있습니다...";
      case "completed":
        return "분석이 완료되었습니다!";
      case "failed":
        return "분석 중 오류가 발생했습니다.";
      default:
        return "";
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case "uploading":
      case "analyzing":
        return <Loader2 className="h-5 w-5 animate-spin" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  useEffect(() => {
    dispatch(getAiReview("68a7b8d77433cbd888394172"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            이력서 업로드 및 분석
          </h1>
          <p className="text-lg text-gray-600">
            파일을 업로드하거나 텍스트를 직접 입력하여 AI가 분석해드립니다
          </p>
        </div>

        {/* Upload Method Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
              업로드 방법 선택
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={uploadMethod}
              onValueChange={(value: string) =>
                setUploadMethod(value as UploadMethod)
              }
            >
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger
                  value="file"
                  className="flex items-center justify-center py-3 px-6 rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-200"
                >
                  <File className="h-5 w-5 mr-2" />
                  파일 업로드
                </TabsTrigger>
                <TabsTrigger
                  value="text"
                  className="flex items-center justify-center py-3 px-6 rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-200"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  텍스트 입력
                </TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="mt-6">
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="file-upload"
                      className="text-base font-medium text-gray-700 mb-3 block"
                    >
                      이력서 파일 선택
                    </Label>
                    <div className="mt-2">
                      {selectedFile ? (
                        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <File className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">
                              {selectedFile.name}
                            </span>
                            <span className="text-xs text-blue-600">
                              ({(selectedFile.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={removeFile}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
                          <div className="space-y-4 text-center">
                            <Upload className="mx-auto h-16 w-16 text-gray-400" />
                            <div className="space-y-2">
                              <Label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-block"
                              >
                                <span className="flex items-center">
                                  <File className="h-4 w-4 mr-2" />
                                  파일 업로드
                                </span>
                                <Input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  accept=".txt,.doc,.docx,.pdf"
                                  onChange={handleFileSelect}
                                />
                              </Label>
                              <p className="text-sm text-gray-600">
                                또는 드래그 앤 드롭
                              </p>
                            </div>
                            <p className="text-xs text-gray-500">
                              TXT, DOC, DOCX, PDF 파일 지원
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="text" className="mt-6">
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="text-content"
                      className="text-base font-medium text-gray-700 mb-3 block"
                    >
                      이력서 내용 입력
                    </Label>
                    <Textarea
                      id="text-content"
                      placeholder="이력서 내용을 직접 입력하세요..."
                      value={textContent}
                      onChange={(e) => handleTextChange(e.target.value)}
                      rows={10}
                      className="mt-2 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        최소 100자 이상 입력해주세요
                      </p>
                      <span
                        className={`text-sm ${
                          textContent.length >= 100
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {textContent.length}/100
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Analysis Button */}
        <Card className="mb-8">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzeDisabled()}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-12 py-4 text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {uploadStatus === "idle" && (
                  <>
                    <Sparkles className="h-6 w-6 mr-3" />
                    AI 분석 시작하기
                  </>
                )}
                {uploadStatus !== "idle" && (
                  <>
                    {getStatusIcon()}
                    <span className="ml-3">{getStatusMessage()}</span>
                  </>
                )}
              </Button>

              {uploadStatus !== "idle" && (
                <p className="text-sm text-gray-600 mt-4">
                  {uploadStatus === "uploading" && "잠시만 기다려주세요..."}
                  {uploadStatus === "analyzing" &&
                    "AI가 이력서를 자세히 분석하고 있습니다..."}
                  {uploadStatus === "completed" &&
                    "분석이 완료되었습니다! 분석 결과 페이지로 이동합니다."}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Features */}
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
}
