import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  Trash2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getResume, patchResume } from "@/redux/slices/resumeSlice";
import type {
  Resume as ResumeModel,
  ResumeSession as ResumeSessionModel,
  ResumeItem,
} from "@/types/resume";

const uniqueSectionKey = (title: string, existing: string[]) => {
  const base = title.trim();
  let key = base, i = 1;
  while (existing.includes(key)) key = `${base}-${i++}`;
  return key;
};
const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" }) : "-";

function SectionHeader({
  isEdit,
  session,
  onTitle,
  onRemove,
}: {
  isEdit: boolean;
  session: ResumeSessionModel;
  onTitle: (v: string) => void;
  onRemove: () => void;
}) {
  const charCount = useMemo(() => session.items.reduce((n, it) => n + (it.text?.length || 0), 0), [session.items]);
  return (
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center justify-between gap-3 text-xl">
        <div className="flex flex-wrap items-center gap-3">
          {isEdit ? (
            <Input value={session.title} onChange={(e) => onTitle(e.target.value)} className="text-lg border-gray-400 shadow-md font-semibold h-9 w-[min(28rem,90vw)] placeholder:text-gray-400" placeholder="섹션 제목" />
          ) : (
            <span className="font-semibold text-gray-900">{session.title}</span>
          )}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full">{session.items.length}개 항목</Badge>
            <Badge variant="outline" className="rounded-full border-gray-200">{charCount.toLocaleString()}자</Badge>
          </div>
        </div>
        {isEdit && (
          <Button variant="ghost" size="sm" onClick={onRemove} className="text-red-600 hover:text-red-700 hover:bg-red-50" title="섹션 삭제">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardTitle>
    </CardHeader>
  );
}

function ItemBlock({
  isEdit,
  item,
  onChangeText,
  onChangeTitle,
  onRemove,
}: {
  isEdit: boolean;
  item: ResumeItem;
  onChangeText: (v: string) => void;
  onChangeTitle: (v: string) => void;
  onRemove: () => void;
}) {
  return (
    <div
      className={[
        "rounded-xl p-4 transition-shadow",
        isEdit
          ? "ring-1 ring-gray-200 bg-white focus-within:ring-2 focus-within:ring-blue-300"
          : "ring-1 ring-gray-100 bg-white hover:shadow-sm",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-2">
        {isEdit ? (
          <Input
            value={item.title}
            onChange={(e) => onChangeTitle(e.target.value)}
            className="font-medium h-10 w-[min(28rem,90vw)] placeholder:text-gray-400 border-gray-400 shadow-md"
            placeholder="항목 제목"
          />
        ) : (
          <h4 className="font-medium text-gray-900">{item.title}</h4>
        )}

        {isEdit && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            title="항목 삭제"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {item.startDate && item.endDate && (
        <p className="text-xs text-gray-500 mt-1">
          {item.startDate} ~ {item.endDate}
        </p>
      )}

      <div className="mt-3">
        {isEdit ? (
          <Textarea
            value={item.text}
            onChange={(e) => onChangeText(e.target.value)}
            rows={4}
            className="w-full min-h-[96px] border-gray-400 shadow-md placeholder:text-gray-400"
            placeholder="내용을 입력하세요"
          />
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {item.text}
          </p>
        )}
      </div>

      {!isEdit && item.review && (
        <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
          <p className="text-sm text-blue-800">
            <strong>AI 피드백:</strong> {item.review}
          </p>
        </div>
      )}
    </div>
  );
}


export default function ResumeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { resume, loading, error } = useAppSelector((s) => s.resume);
  const [draft, setDraft] = useState<ResumeModel | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [addingKey, setAddingKey] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionItemTitle, setSectionItemTitle] = useState("");
  const [sectionItemText, setSectionItemText] = useState("");

  useEffect(() => { if (id) dispatch(getResume(id)); }, [id, dispatch]);
  useEffect(() => { setDraft(resume ? structuredClone(resume) : null); }, [resume]);
  useEffect(() => { if (error) alert(error); }, [error]);

  const totalChars = useMemo(() => draft?.sessions.reduce((t, s) => t + s.items.reduce((n, it) => n + (it.text?.length || 0), 0), 0) || 0, [draft]);

  const updateDraft = (fn: (d: ResumeModel) => void) => {
    if (!draft) return;
    const copy = structuredClone(draft);
    fn(copy);
    setDraft(copy);
  };

  const saveAll = async () => {
    if (!id || !draft) return;
    try {
      await dispatch(patchResume({ id, patch: { title: draft.title, sessions: draft.sessions, replaceSessions: true } as any })).unwrap();
      setIsEdit(false);
    } catch (e: any) {
      alert(typeof e === "string" ? e : e?.message ?? "저장 실패");
    }
  };

  if (loading && !draft) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
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
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const cancelEdit = () => {
    if (!window.confirm("편집된 내용을 모두 삭제할까요? 저장하지 않은 변경사항이 사라집니다.")) return;
    if (resume) setDraft(structuredClone(resume));
    setIsEdit(false);
    setAddingKey(null);
    setNewTitle("");
    setNewText("");
    setAddSectionOpen(false);
    setSectionTitle("");
    setSectionItemTitle("");
    setSectionItemText("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* top bar */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-200 shadow-[0_1px_0_0_rgba(0,0,0,0.02)]">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <Button onClick={() => navigate("/dashboard")} variant="ghost" size="sm" className="hover:bg-gray-50">
              <ArrowLeft className="h-4 w-4 mr-2" /> 목록으로
            </Button>
            <div className="flex items-center gap-3">
              <Badge> 
                <Star className="h-3 w-3 mr-1" /> {draft.score}점
              </Badge>
              {!isEdit ? (
                <Button onClick={() => setIsEdit(true)} variant="outline" size="sm" className="border-gray-200">
                  <Pencil className="h-4 w-4 mr-2" /> 편집
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button onClick={cancelEdit} variant="outline" size="sm" className="border-gray-200">
                    <ArrowLeft className="h-4 w-4 mr-2" /> 편집 취소
                  </Button>
                  <Button onClick={saveAll} variant="outline" disabled={loading} size="sm" className="border-gray-200">
                    <Save className="h-4 w-4 mr-2" /> 저장
                  </Button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="mb-8 shadow-sm border-gray-100">
          <CardHeader className="pb-3">
            {isEdit ? (
              <Input value={draft.title} onChange={(e) => updateDraft((d) => (d.title = e.target.value))} className="text-2xl font-bold h-11 border-gray-400 shadow-md placeholder:text-gray-400" placeholder="이력서 제목" />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900">{draft.title}</h1>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Info icon={<Calendar className="h-4 w-4 text-gray-500" />} label="마지막 수정" value={formatDate(draft.updatedAt)} />
              <Info icon={<Hash className="h-4 w-4 text-gray-500" />} label="총 글자 수" value={`${totalChars.toLocaleString()}자`} />
              <Info icon={<TrendingUp className="h-4 w-4 text-gray-500" />} label="AI 점수" value={`${draft.score}점`} />
              <Info icon={<FileText className="h-4 w-4 text-gray-500" />} label="섹션 수" value={`${draft.sessions.length}`} />
            </div>
          </CardContent>
        </Card>

        {isEdit && (
          <Card className="mb-6 border-gray-100 shadow-sm">
            <CardContent className="pt-6">
              {addSectionOpen ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      autoFocus
                      placeholder="섹션 제목"
                      value={sectionTitle}
                      onChange={(e) => setSectionTitle(e.target.value)}
                      className="h-10 placeholder:text-gray-400 border-gray-400 shadow-md"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          if (!sectionTitle.trim()) return;
                          updateDraft((d) => {
                            const key = uniqueSectionKey(
                              sectionTitle,
                              d.sessions.map((s) => s.key)
                            );
                            const newSession: ResumeSessionModel = {
                              key,
                              title: sectionTitle.trim(),
                              items: [],
                              wordCount: 0,
                            };
                            const hasFirstItem =
                              sectionItemTitle.trim() !== "" ||
                              sectionItemText.trim() !== "";
                            if (hasFirstItem) {
                              newSession.items.push({
                                title: sectionItemTitle.trim() || "새 항목",
                                text: sectionItemText.trim(),
                              });
                            }

                            d.sessions.push(newSession);
                          });
                          setSectionTitle("");
                          setSectionItemTitle("");
                          setSectionItemText("");
                          setAddSectionOpen(false);
                        }}
                        disabled={!sectionTitle.trim()}
                      >
                        추가
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setAddSectionOpen(false);
                          setSectionTitle("");
                          setSectionItemTitle("");
                          setSectionItemText("");
                        }}
                        className="border-gray-200"
                      >
                        취소
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-xl ring-1 ring-dashed ring-gray-300 p-4 bg-gray-50/60">
                    <div className="space-y-3">
                      <Input
                        placeholder="항목 제목"
                        value={sectionItemTitle}
                        onChange={(e) => setSectionItemTitle(e.target.value)}
                        className="font-medium h-10 placeholder:text-gray-400 border-gray-400 shadow-md"
                      />
                      <Textarea
                        placeholder="내용을 입력하세요"
                        value={sectionItemText}
                        onChange={(e) => setSectionItemText(e.target.value)}
                        className="min-h-[100px] placeholder:text-gray-400 border-gray-400 shadow-md"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setAddSectionOpen(true)} className="border-gray-200">
                  <Plus className="h-4 w-4 mr-2" /> 섹션 추가
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {draft.sessions.map((session) => (
            <Card key={session.key} className="border-gray-100 shadow-sm">
              <SectionHeader
                isEdit={isEdit}
                session={session}
                onTitle={(v) => updateDraft((d) => {
                  const s = d.sessions.find((x) => x.key === session.key);
                  if (s) s.title = v;
                })}
                onRemove={() => {
                  if (!confirm("이 섹션을 삭제할까요?")) return;
                  updateDraft((d) => { d.sessions = d.sessions.filter((s) => s.key !== session.key); });
                }}
              />

              <CardContent className="pt-0">
                <div className="space-y-4">
                  {session.items.length === 0 && !isEdit ? (
                    <div className="text-center py-10 text-gray-500">아직 추가된 항목이 없습니다.</div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {session.items.map((item, idx) => (
                          <ItemBlock
                            key={idx}
                            isEdit={isEdit}
                            item={item}
                            onChangeText={(v) =>
                              updateDraft((d) => {
                                const s = d.sessions.find((x) => x.key === session.key);
                                if (s?.items[idx]) s.items[idx].text = v;
                              })
                            }
                            onChangeTitle={(v) =>
                              updateDraft((d) => {
                                const s = d.sessions.find((x) => x.key === session.key);
                                if (s?.items[idx]) s.items[idx].title = v;
                              })
                            }
                            onRemove={() => {
                              if (!confirm("이 항목을 삭제할까요?")) return;
                              updateDraft((d) => {
                                const s = d.sessions.find((x) => x.key === session.key);
                                if (!s) return;
                                s.items.splice(idx, 1);
                              });
                            }}
                          />
                        ))}
                      </div>
                      {isEdit && (
                        addingKey === session.key ? (
                          <div className="rounded-xl ring-1 ring-dashed ring-gray-300 p-4 bg-gray-50/60">
                            <div className="space-y-3">
                              <Input placeholder="항목 제목" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="font-medium h-10 placeholder:text-gray-400 border-gray-400 shadow-md" />
                              <Textarea placeholder="내용을 입력하세요" value={newText} onChange={(e) => setNewText(e.target.value)} className="min-h-[100px] placeholder:text-gray-400 border-gray-400 shadow-md" />
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => { setAddingKey(null); setNewTitle(""); setNewText(""); }} className="border-gray-200">취소</Button>
                                <Button size="sm" disabled={!newText.trim()} onClick={() => {
                                  if (!newText.trim()) return;
                                  updateDraft((d) => {
                                    const s = d.sessions.find((x) => x.key === session.key);
                                    if (!s) return;
                                    s.items.push({ title: newTitle.trim() || "새 항목", text: newText.trim() });
                                  });
                                  setAddingKey(null); setNewTitle(""); setNewText("");
                                }}>추가</Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <Button variant="outline" className="w-full border-gray-200" onClick={() => setAddingKey(session.key)}>
                            <Plus className="h-4 w-4 mr-2" /> 새 항목 추가하기
                          </Button>
                        )
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {!isEdit && (
          <div className="flex justify-end gap-3 mt-8">
            <Button
              variant="outline"
              onClick={() => navigate(`/analysis/${id}`)}
              className="border-gray-200"
            >
              분석 보러가기
            </Button>

            <Button
              onClick={() => navigate(`/roadmap/${id}`)}
            >
              로드맵 보러가기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2 ring-1 ring-gray-100">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-[11px] uppercase tracking-wide text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
