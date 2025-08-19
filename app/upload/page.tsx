"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload, FileText, Sparkles } from "lucide-react"
import Link from "next/link"

type UploadMethod = "file" | "text" | null

export default function UploadPage() {
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>(null)
  const [resumeText, setResumeText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // TODO: Implement file upload logic
      console.log("File uploaded:", file.name)
      startAnalysis()
    }
  }

  const handleTextSubmit = () => {
    if (resumeText.trim()) {
      // TODO: Implement text analysis logic
      console.log("Text submitted:", resumeText)
      startAnalysis()
    }
  }

  const startAnalysis = () => {
    setIsAnalyzing(true)
    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false)
      // TODO: Redirect to analysis results
      window.location.href = "/analysis/1"
    }, 3000)
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md border border-border bg-card">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">AI가 분석 중입니다</h3>
            <p className="text-muted-foreground mb-6">잠시만 기다려주세요. 곧 맞춤형 피드백을 제공해드릴게요.</p>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>대시보드로 돌아가기</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-foreground" />
            <h1 className="text-2xl font-bold font-serif text-foreground">ResumeAI</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-serif text-foreground mb-4">레쥬메 업로드</h2>
          <p className="text-muted-foreground text-lg">파일을 업로드하거나 직접 입력하여 AI 분석을 시작하세요</p>
        </div>

        {!uploadMethod ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* File Upload Option */}
            <Card
              className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer group bg-card"
              onClick={() => setUploadMethod("file")}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">파일 업로드</CardTitle>
                <CardDescription className="text-muted-foreground">PDF, DOC, DOCX 파일을 업로드하세요</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">지원 형식: PDF, DOC, DOCX (최대 10MB)</p>
              </CardContent>
            </Card>

            {/* Text Input Option */}
            <Card
              className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer group bg-card"
              onClick={() => setUploadMethod("text")}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">직접 입력</CardTitle>
                <CardDescription className="text-muted-foreground">
                  레쥬메 내용을 직접 텍스트로 입력하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">복사 & 붙여넣기로 간편하게 입력</p>
              </CardContent>
            </Card>
          </div>
        ) : uploadMethod === "file" ? (
          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">파일 업로드</CardTitle>
              <CardDescription className="text-muted-foreground">레쥬메 파일을 선택해주세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground mb-2">파일을 드래그하거나 클릭하여 업로드</p>
                <p className="text-muted-foreground mb-4">PDF, DOC, DOCX 파일 (최대 10MB)</p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">파일 선택</Button>
                </Label>
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setUploadMethod(null)}>
                  뒤로가기
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">텍스트 입력</CardTitle>
              <CardDescription className="text-muted-foreground">레쥬메 내용을 아래에 입력해주세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="resume-text" className="text-foreground font-medium">
                    레쥬메 내용
                  </Label>
                  <Textarea
                    id="resume-text"
                    placeholder="이름, 연락처, 학력, 경력, 기술 스택 등 레쥬메 내용을 입력해주세요..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    rows={15}
                    className="mt-2 bg-input border-border focus:ring-ring"
                  />
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setUploadMethod(null)}>
                  뒤로가기
                </Button>
                <Button
                  onClick={handleTextSubmit}
                  disabled={!resumeText.trim()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  AI 분석 시작
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
