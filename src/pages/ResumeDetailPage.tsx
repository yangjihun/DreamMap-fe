import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit3,
  Save,
  X,
  FileText,
  Star,
  Calendar,
  Hash,
  TrendingUp,
  Plus,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getResume,
  updateItemText,
  updateResumeTitle,
  updateSessionTitle,
  addItemToSession
} from "@/redux/slices/resumeSlice";

export default function ResumeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { resume, loading, error } = useAppSelector((state) => state.resume);

  const [editingItem, setEditingItem] = useState<{
    sessionKey: string;
    itemIndex: number;
  } | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingSessionTitle, setEditingSessionTitle] = useState<string | null>(null);
  const [addingItemToSession, setAddingItemToSession] = useState<string | null>(null);
  const [tempText, setTempText] = useState("");
  const [tempTitle, setTempTitle] = useState("");
  const [tempSessionTitle, setTempSessionTitle] = useState("");
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemText, setNewItemText] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(getResume(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error, dispatch]);

  const handleBack = () => {
    navigate("/dashboard");
  };

  const startEditingItem = (sessionKey: string, itemIndex: number, currentText: string) => {
    setEditingItem({ sessionKey, itemIndex });
    setTempText(currentText);
  };

  const saveItem = async () => {
    if (editingItem && id && tempText.trim()) {
      await dispatch(
        updateItemText({
          resumeId: id,
          sessionKey: editingItem.sessionKey,
          itemIndex: editingItem.itemIndex,
          text: tempText.trim(),
        })
      );
      setEditingItem(null);
      setTempText("");
    }
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setTempText("");
  };

  const startEditingTitle = () => {
    setEditingTitle(true);
    setTempTitle(resume?.title || "");
  };

  const saveTitle = async () => {
    if (id && tempTitle.trim()) {
      await dispatch(
        updateResumeTitle({
          id,
          title: tempTitle.trim(),
        })
      );
      setEditingTitle(false);
      setTempTitle("");
    }
  };

  const cancelTitleEdit = () => {
    setEditingTitle(false);
    setTempTitle("");
  };

  const startEditingSessionTitle = (sessionKey: string, currentTitle: string) => {
    setEditingSessionTitle(sessionKey);
    setTempSessionTitle(currentTitle);
  };

  const saveSessionTitle = async () => {
    if (editingSessionTitle && id && tempSessionTitle.trim()) {
      await dispatch(
        updateSessionTitle({
          resumeId: id,
          sessionKey: editingSessionTitle,
          title: tempSessionTitle.trim(),
        })
      );
      setEditingSessionTitle(null);
      setTempSessionTitle("");
    }
  };

  const cancelSessionTitleEdit = () => {
    setEditingSessionTitle(null);
    setTempSessionTitle("");
  };

  const startAddingItem = (sessionKey: string) => {
    setAddingItemToSession(sessionKey);
    setNewItemTitle("");
    setNewItemText("");
  };

  const cancelAddingItem = () => {
    setAddingItemToSession(null);
    setNewItemTitle("");
    setNewItemText("");
  };

  const saveNewItem = async () => {
    if (!id || !addingItemToSession || !newItemText.trim()) return;
    
    await dispatch(addItemToSession({
      resumeId: id,
      sessionKey: addingItemToSession as string,
      text: newItemText.trim(),
      itemTitle: newItemTitle.trim() || "새 항목",
    }));
    
    setAddingItemToSession(null);
    setNewItemTitle("");
    setNewItemText("");
  };

  const getStatusColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 50) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  // 총 단어수 계산
  const getTotalWordCount = () => {
    if (!resume) return 0;
    return resume.sessions.reduce((total, session) => {
      return total + session.items.reduce((sessionTotal, item) => {
        return sessionTotal + (item.text?.length || 0);
      }, 0);
    }, 0);
  };

  // 각 섹션의 단어수 계산
  const getSectionWordCount = (session: any) => {
    return session.items.reduce((total: number, item: any) => {
      return total + (item.text?.length || 0);
    }, 0);
  };

  const getStatusText = (score: number) => {
    if (score >= 80) return "완성됨";
    if (score >= 50) return "분석 완료";
    return "작성 중";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">이력서를 불러오고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            이력서를 찾을 수 없습니다
          </h2>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button onClick={handleBack} variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              목록으로
            </Button>
            <div className="flex items-center space-x-4">
              <Badge className={getStatusColor(resume.score)}>
                <Star className="h-3 w-3 mr-1" />
                {resume.score}점 · {getStatusText(resume.score)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Resume Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {editingTitle ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      className="text-2xl font-bold"
                      placeholder="이력서 제목"
                    />
                    <Button onClick={saveTitle} size="sm">
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button onClick={cancelTitleEdit} variant="outline" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {resume.title}
                    </h1>
                    <Button onClick={startEditingTitle} variant="ghost" size="sm">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">마지막 수정</p>
                  <p className="text-sm font-medium">
                    {formatDate(resume.updatedAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Hash className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">총 단어 수</p>
                  <p className="text-sm font-medium">{getTotalWordCount().toLocaleString()}자</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">AI 점수</p>
                  <p className="text-sm font-medium">{resume.score}점</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">섹션 수</p>
                  <p className="text-sm font-medium">{resume.sessions.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-6">
          {resume.sessions.map((session) => (
            <Card key={session.key} className="group">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {editingSessionTitle === session.key ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          value={tempSessionTitle}
                          onChange={(e) => setTempSessionTitle(e.target.value)}
                          className="text-lg font-semibold"
                          placeholder="섹션 제목"
                        />
                        <Button onClick={saveSessionTitle} size="sm">
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button onClick={cancelSessionTitleEdit} variant="outline" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>{session.title}</span>
                        <Button
                          onClick={() => startEditingSessionTitle(session.key, session.title)}
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        {session.items.length}개 항목
                      </Badge>
                      <Badge variant="outline">
                        {getSectionWordCount(session).toLocaleString()}자
                      </Badge>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {session.items.length === 0 && addingItemToSession !== session.key ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">
                        아직 추가된 항목이 없습니다.
                      </p>
                      <Button 
                        onClick={() => startAddingItem(session.key)}
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        첫 번째 항목 추가하기
                      </Button>
                    </div>
                  ) : (
                    <>
                      {session.items.map((item, index) => (
                      <div
                        key={index}
                        className="group border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">
                            {item.title}
                          </h4>
                          <Button
                            onClick={() =>
                              startEditingItem(session.key, index, item.text)
                            }
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </div>

                        {item.startDate && item.endDate && (
                          <p className="text-sm text-gray-500 mb-2">
                            {item.startDate} ~ {item.endDate}
                          </p>
                        )}

                        {editingItem?.sessionKey === session.key &&
                        editingItem?.itemIndex === index ? (
                          <div className="space-y-3">
                            <Textarea
                              value={tempText}
                              onChange={(e) => setTempText(e.target.value)}
                              rows={4}
                              className="w-full"
                              placeholder="내용을 입력하세요..."
                            />
                            <div className="flex space-x-2">
                              <Button onClick={saveItem} size="sm">
                                <Save className="h-4 w-4 mr-2" />
                                저장
                              </Button>
                              <Button
                                onClick={cancelEdit}
                                variant="outline"
                                size="sm"
                              >
                                <X className="h-4 w-4 mr-2" />
                                취소
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-700 whitespace-pre-wrap">
                              {item.text}
                            </p>
                            {item.review && (
                              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                  <strong>AI 피드백:</strong> {item.review}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      ))}
                      
                      {/* 새 아이템 추가 폼 */}
                      {addingItemToSession === session.key ? (
                        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                          <div className="space-y-3">
                            <Input
                              placeholder="항목 제목 (예: 프로젝트명, 경험명 등)"
                              value={newItemTitle}
                              onChange={(e) => setNewItemTitle(e.target.value)}
                              className="font-medium"
                            />
                            <Textarea
                              placeholder="항목 내용을 입력하세요..."
                              value={newItemText}
                              onChange={(e) => setNewItemText(e.target.value)}
                              className="min-h-[100px]"
                            />
                            <div className="flex justify-end space-x-2">
                              <Button onClick={cancelAddingItem} variant="outline" size="sm">
                                <X className="h-4 w-4 mr-1" />
                                취소
                              </Button>
                              <Button 
                                onClick={saveNewItem} 
                                size="sm"
                                disabled={!newItemText.trim()}
                              >
                                <Save className="h-4 w-4 mr-1" />
                                추가
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : session.items.length > 0 ? (
                        <Button 
                          onClick={() => startAddingItem(session.key)}
                          variant="outline"
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          새 항목 추가하기
                        </Button>
                      ) : null}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}