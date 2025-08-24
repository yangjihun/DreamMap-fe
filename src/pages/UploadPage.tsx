import React, { useState } from "react";
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
import { 
  createNewResumeFromFile,
  createNewResumeWithSections,
  setError 
} from "../redux/slices/resumeSlice";

type UploadMethod = "file" | "text";

export default function UploadPage() {
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeTitle, setResumeTitle] = useState("");
  
  const [sectionContents, setSectionContents] = useState({
    intro: { text: "", title: "" },
    body: { text: "", title: "" },
    closing: { text: "", title: "" },
  });
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.resume);


  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSectionTextChange = (
    section: "intro" | "body" | "closing", 
    field: "text" | "title", 
    value: string
  ) => {
    setSectionContents(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleAnalyze = async () => {
    // 백엔드 연결 테스트
    try {
      const testResponse = await fetch("http://localhost:5000/api/resume/all");
      if (!testResponse.ok) {
        console.error("백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.");
      }
    } catch (connectionError) {
      console.error("백엔드 연결 실패:", connectionError);
      return;
    }

    if (uploadMethod === "text") {
      const hasContent = Object.values(sectionContents).some(section => 
        section.text && section.text.trim()
      );
      if (!hasContent) {
        alert("적어도 하나의 섹션에는 내용을 입력해주세요.");
        return;
      }
    }
    
    if (uploadMethod === "file" && !selectedFile) {
      alert("파일을 선택해주세요.");
      return;
    }

    if (!resumeTitle.trim()) {
      alert("Resume 제목을 입력해주세요.");
      return;
    }

    try {
      if (error) {
        dispatch(setError(error));
      }

      let result;
      
      if (uploadMethod === "text") {
        const sections: any = {};
        Object.entries(sectionContents).forEach(([key, content]) => {
          if (content.text && content.text.trim()) {
            sections[key] = {
              text: content.text,
              title: content.title || undefined,
            };
          }
        });

        console.log("Creating new resume with sections:", { resumeTitle, sections });
        result = await dispatch(createNewResumeWithSections({
          resumeTitle: resumeTitle,
          sections: sections,
        })).unwrap();
        console.log("Resume creation result:", result);
      } else {
        result = await dispatch(createNewResumeFromFile({
          file: selectedFile!,
          sessionKey: "intro",
          itemTitle: undefined,
          resumeTitle: resumeTitle,
        })).unwrap();
      }

      if (result) {
        navigate(`/analysis/${result.id}`);
      }
      
    } catch (error: any) {
      console.error("Resume 생성 중 오류:", error);
      console.error("Error details:", error.response?.data || error);
      alert(error.message || error.response?.data?.error || "Resume 생성에 실패했습니다.");
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const isAnalyzeDisabled = () => {
    if (loading) return true;
    if (uploadMethod === "text") {
      const hasContent = Object.values(sectionContents).some(section => 
        section.text && section.text.trim()
      );
      return !hasContent;
    }
    if (uploadMethod === "file") return !selectedFile;
    return false;
  };

  const getStatusMessage = () => {
    if (loading) {
      return "Resume을 생성하고 있습니다...";
    }
    if (error) {
      return error || "오류가 발생했습니다.";
    }
    return "";
  };

  const getStatusIcon = () => {
    if (loading) {
      return <Loader2 className="h-5 w-5 animate-spin" />;
    }
    if (error) {
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            새 이력서 생성
          </h1>
          <p className="text-lg text-gray-600">
            새로운 이력서를 생성합니다. 파일을 업로드하거나 텍스트를 직접 입력하세요.
          </p>
        </div>

        
        {/* Upload Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
              이력서 제목
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Label htmlFor="resume-title" className="text-base font-medium text-gray-700 mb-3 block">
                이력서 제목 *
              </Label>
              <Input
                id="resume-title"
                type="text"
                placeholder="예: 프론트엔드 개발자 김철수의 이력서"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                required={true}
              />
              <p className="text-sm text-gray-500 mt-2">
                새 이력서의 제목을 입력해주세요
              </p>
            </div>
          </CardContent>
        </Card>

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
                <div className="space-y-6">
                  <p className="text-base text-gray-700 mb-4">
                    이력서를 3개 섹션으로 나누어 입력하세요. 모든 섹션을 입력할 필요는 없습니다.
                  </p>
                  
                  {/* 도입부 섹션 */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <Label className="text-base font-medium text-gray-700 mb-3 block">
                      🌟 도입부 - 자기소개, 목표
                    </Label>
                    <Input
                      placeholder="예: 학력, 자기소개, 목표 등"
                      value={sectionContents.intro.title}
                      onChange={(e) => handleSectionTextChange("intro", "title", e.target.value)}
                      className="mb-3 border-gray-200 focus:border-blue-500"
                    />
                    <Textarea
                      placeholder="자기소개, 목표, 가치관 등을 입력하세요..."
                      value={sectionContents.intro.text}
                      onChange={(e) => handleSectionTextChange("intro", "text", e.target.value)}
                      rows={4}
                      className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {sectionContents.intro.text.length}자
                    </p>
                  </div>

                  {/* 본문 섹션 */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <Label className="text-base font-medium text-gray-700 mb-3 block">
                      💼 본문 - 경력, 프로젝트, 기술
                    </Label>
                    <Input
                      placeholder="예: 경력사항, 프로젝트, 기술스택 등"
                      value={sectionContents.body.title}
                      onChange={(e) => handleSectionTextChange("body", "title", e.target.value)}
                      className="mb-3 border-gray-200 focus:border-blue-500"
                    />
                    <Textarea
                      placeholder="경력, 프로젝트, 기술, 성과 등을 입력하세요..."
                      value={sectionContents.body.text}
                      onChange={(e) => handleSectionTextChange("body", "text", e.target.value)}
                      rows={6}
                      className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {sectionContents.body.text.length}자
                    </p>
                  </div>

                  {/* 마무리 섹션 */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <Label className="text-base font-medium text-gray-700 mb-3 block">
                      🎯 마무리 - 포부, 다짐
                    </Label>
                    <Input
                      placeholder="예: 포부, 다짐, 향후 계획 등"
                      value={sectionContents.closing.title}
                      onChange={(e) => handleSectionTextChange("closing", "title", e.target.value)}
                      className="mb-3 border-gray-200 focus:border-blue-500"
                    />
                    <Textarea
                      placeholder="포부, 다짐, 향후 계획 등을 입력하세요..."
                      value={sectionContents.closing.text}
                      onChange={(e) => handleSectionTextChange("closing", "text", e.target.value)}
                      rows={4}
                      className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {sectionContents.closing.text.length}자
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-700">
                      💡 <strong>팁:</strong> 적어도 하나의 섹션에는 내용을 입력해야 합니다. 
                      각 섹션의 제목은 선택사항이며, 입력하지 않으면 기본 제목이 사용됩니다.
                    </p>
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
                {!loading && (
                  <>
                    <Sparkles className="h-6 w-6 mr-3" />
                    새 이력서 생성하기
                  </>
                )}
                {loading && (
                  <>
                    {getStatusIcon()}
                    <span className="ml-3">{getStatusMessage()}</span>
                  </>
                )}
              </Button>

              {(loading || error) && (
                <p className="text-sm text-gray-600 mt-4">
                  {loading && "Resume을 생성하고 있습니다. 잠시만 기다려주세요..."}
                  {error && "오류가 발생했습니다. 다시 시도해주세요."}
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