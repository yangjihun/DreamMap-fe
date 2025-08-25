import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { ResumeItem } from "@/types/resume";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Save,
  FileText,
  Star,
  Calendar,
  Hash,
  TrendingUp,
  Plus,
  Pencil,
  Check,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getResume, patchResume } from "@/redux/slices/resumeSlice";
import type { Resume as ResumeModel, ResumeSession as ResumeSessionModel } from "@/types/resume";

export default function ResumeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { resume, loading, error } = useAppSelector((state) => state.resume);

  const [draft, setDraft] = useState<ResumeModel | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [addingItemToSession, setAddingItemToSession] = useState<string | null>(null);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemText, setNewItemText] = useState("");

  useEffect(() => {
    if (id) dispatch(getResume(id));
  }, [id, dispatch]);

  useEffect(() => {
    setDraft(resume ? structuredClone(resume) : null);
    setIsDirty(false);
  }, [resume]);

  useEffect(() => {
    if (error) alert(error);
  }, [error]);

  const handleBack = () => navigate("/dashboard");
  const touch = () => setIsDirty(true);

  const toggleEditMode = () => setIsEditMode((v) => !v);

  const onChangeTitle = (v: string) => {
    if (!draft) return;
    setDraft({ ...draft, title: v });
    touch();
  };

  const onChangeSessionTitle = (sessionKey: string, v: string) => {
    if (!draft) return;
    const copy = structuredClone(draft);
    const s = copy.sessions.find((x) => x.key === sessionKey);
    if (s) {
      s.title = v;
      setDraft(copy);
      touch();
    }
  };

  const onChangeItemText = (sessionKey: string, index: number, v: string) => {
    if (!draft) return;
    const copy = structuredClone(draft);
    const s = copy.sessions.find((x) => x.key === sessionKey);
    if (s?.items[index]) {
      s.items[index].text = v;
      setDraft(copy);
      touch();
    }
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
  const applyNewItem = () => {
    if (!draft || !addingItemToSession || !newItemText.trim()) return;
    const copy = structuredClone(draft);
    let s = copy.sessions.find((x) => x.key === addingItemToSession);
    if (!s) {
      const newSession: ResumeSessionModel = {
        key: addingItemToSession,
        title: addingItemToSession,
        items: [] as ResumeItem[],
        wordCount: 0,
      };
      copy.sessions.push(newSession);
      s = newSession;
    }
    s.items.push({
      title: newItemTitle.trim() || "새 항목",
      text: newItemText.trim(),
    });
    setDraft(copy);
    setAddingItemToSession(null);
    setNewItemTitle("");
    setNewItemText("");
    touch();
  };

  const saveAll = useCallback(async () => {
    if (!id || !draft) return;
    try {
      await dispatch(
        patchResume({
          id,
          patch: {
            title: draft.title,
            sessions: draft.sessions,
          },
        })
      ).unwrap();
      setIsEditMode(false);
    } catch (e: any) {
      alert(e?.message ?? "저장 실패");
    }
  }, [id, draft, dispatch]);

  const getStatusColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 50) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  const totalChars = useMemo(() => {
    if (!draft) return 0;
    return draft.sessions.reduce((total, s) => {
      return total + s.items.reduce((acc, it) => acc + (it.text?.length || 0), 0);
    }, 0);
  }, [draft]);

  const sectionChars = (session: ResumeSessionModel) =>
    session.items.reduce((acc, it) => acc + (it.text?.length || 0), 0);

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

  if (loading && !draft) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">이력서를 불러오고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">이력서를 찾을 수 없습니다</h2>
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
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button onClick={handleBack} variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              목록으로
            </Button>
            <div className="flex items-center space-x-3">
              <Badge className={getStatusColor(draft.score)}>
                <Star className="h-3 w-3 mr-1" />
                {draft.score}점 · {getStatusText(draft.score)}
              </Badge>
              <Button onClick={toggleEditMode} variant={isEditMode ? "secondary" : "outline"} size="sm">
                {isEditMode ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    편집 종료
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4 mr-2" />
                    편집
                  </>
                )}
              </Button>
              <Button onClick={saveAll} disabled={!isDirty || loading} size="sm">
                <Save className="h-4 w-4 mr-2" />
                모두 저장
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {isEditMode ? (
                  <Input
                    value={draft.title}
                    onChange={(e) => onChangeTitle(e.target.value)}
                    className="text-2xl font-bold"
                    placeholder="이력서 제목"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900">{draft.title}</h1>
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
                    {draft.updatedAt ? formatDate(draft.updatedAt) : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Hash className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">총 글자 수</p>
                  <p className="text-sm font-medium">{totalChars.toLocaleString()}자</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">AI 점수</p>
                  <p className="text-sm font-medium">{draft.score}점</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">섹션 수</p>
                  <p className="text-sm font-medium">{draft.sessions.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {draft.sessions.map((session) => (
            <Card key={session.key}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isEditMode ? (
                      <Input
                        value={session.title}
                        onChange={(e) => onChangeSessionTitle(session.key, e.target.value)}
                        className="text-lg font-semibold"
                        placeholder="섹션 제목"
                      />
                    ) : (
                      <span>{session.title}</span>
                    )}
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className={`${isEditMode ? 'invisible' : 'visible'} border-0`}>{session.items.length}개 항목</Badge>
                      <Badge variant="outline" className={`${isEditMode ? 'invisible' : 'visible'} border-0`}>{sectionChars(session).toLocaleString()}자</Badge>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {session.items.length === 0 && !isEditMode ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">아직 추가된 항목이 없습니다.</p>
                    </div>
                  ) : (
                    <>
                      {session.items.map((item, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                          {item.startDate && item.endDate && (
                            <p className="text-sm text-gray-500 mb-2">
                              {item.startDate} ~ {item.endDate}
                            </p>
                          )}
                          {isEditMode ? (
                            <Textarea
                              value={item.text}
                              onChange={(e) => onChangeItemText(session.key, index, e.target.value)}
                              rows={4}
                              className="w-full"
                              placeholder="내용을 입력하세요..."
                            />
                          ) : (
                            <p className="text-gray-700 whitespace-pre-wrap">{item.text}</p>
                          )}
                          {!isEditMode && item.review && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <strong>AI 피드백:</strong> {item.review}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}

                      {isEditMode && (
                        <>
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
                                    취소
                                  </Button>
                                  <Button onClick={applyNewItem} size="sm" disabled={!newItemText.trim()}>
                                    추가
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <Button onClick={() => startAddingItem(session.key)} variant="outline" className="w-full">
                              <Plus className="h-4 w-4 mr-2" />
                              새 항목 추가하기
                            </Button>
                          )}
                        </>
                      )}
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
