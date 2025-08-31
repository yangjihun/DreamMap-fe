import { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/ui/header";
import { LoadingAnimation } from "@/components/ui/loading-animation";
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
import {
  getAiReview,
  getResume,
  patchResume,
  setHasFeedbackResume,
  setIsEdit,
} from "@/redux/slices/resumeSlice";
import type {
  Resume as ResumeModel,
  ResumeSession as ResumeSessionModel,
  ResumeItem,
} from "@/types/resume";

const KEYWORDS = [
  "경력",
  "학력",
  "프로젝트",
  "수상",
  "인증",
  "활동",
  "경험",
  "project",
  "award",
];
const SKILL_KEYWORDS = ["기술", "스킬", "스택", "skills"];

const uniqueSectionKey = (title: string, existing: string[]) => {
  const base = title.trim();
  let key = base,
    i = 1;
  while (existing.includes(key)) key = `${base}-${i++}`;
  return key;
};
const formatDate = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";
const clean = (raw: string) =>
  (raw ?? "").replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/\u00A0/g, " ");
const hasKeyword = (title?: string) => {
  const t = (title ?? "").trim();
  if (!t) return false;
  return KEYWORDS.some((k) => t.includes(k));
};

const hasSkillKeyword = (title?: string) => {
  const t = (title ?? "").trim();
  if (!t) return false;
  return SKILL_KEYWORDS.some((k) => t.includes(k));
};

function normalizeSkillSections(d: ResumeModel): ResumeModel {
  if (!d || !d.sessions) return d;

  const copy = structuredClone(d);
  copy.sessions = copy.sessions.map((s) => {
    if (hasSkillKeyword(s.title)) {
      const first = s.items?.[0] ?? { text: "" };
      return {
        ...s,
        items: [
          {
            title: "",
            text: first.text ?? "",
            companyAddress: "",
            startDate: "",
            endDate: "",
          },
        ],
      };
    }
    return s;
  });
  return copy;
}

function BulletTextarea({
  value,
  onChange,
  placeholder = "내용을 입력하세요",
  className = "",
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}) {
  const composingRef = useRef(false);
  return (
    <Textarea
      value={value}
      placeholder={placeholder}
      rows={rows}
      className={className}
      autoComplete="off"
      spellCheck={false}
      onChange={(e) => {
        const raw = clean(e.target.value);
        if (composingRef.current) {
          onChange(raw);
          return;
        }
        const t = raw.trim();
        if (t === "" || t === "•" || t === "• ") {
          onChange("");
          return;
        }
        onChange(raw.startsWith("• ") ? raw : `• ${raw}`);
      }}
      onKeyDown={(e) => {
        if (composingRef.current) return;
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          const { selectionStart, selectionEnd, value } = e.currentTarget;
          const before = value.substring(0, selectionStart);
          const after = value.substring(selectionEnd);
          const currentLine = before.split("\n").pop() || "";
          const shouldAddBullet =
            currentLine.trim() !== "" && currentLine.trim() !== "•";
          const insert = "\n" + (shouldAddBullet ? "• " : "");
          onChange(before + insert + after);
        }
      }}
      onCompositionStart={() => {
        composingRef.current = true;
      }}
      onCompositionEnd={(e) => {
        composingRef.current = false;
        const raw = clean(e.currentTarget.value);
        const t = raw.trim();
        if (t === "" || t === "•") onChange("");
        else if (!raw.startsWith("• ")) onChange(`• ${raw}`);
        else onChange(raw);
      }}
    />
  );
}

function ItemMetaFields({
  companyAddress,
  startDate,
  endDate,
  onCompanyAddress,
  onStartDate,
  onEndDate,
  className = "grid grid-cols-1 md:grid-cols-3 gap-2 mt-3",
}: {
  companyAddress: string;
  startDate: string;
  endDate: string;
  onCompanyAddress: (v: string) => void;
  onStartDate: (v: string) => void;
  onEndDate: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <div>
        <h1 className="text-sm text-gray-600 mb-1">회사/기관/개인</h1>
        <Input
          placeholder="회사/기관/개인"
          value={companyAddress}
          onChange={(e) => onCompanyAddress(e.target.value)}
          className="h-9 border-gray-400 shadow-sm placeholder:text-gray-400"
        />
      </div>
      <div>
        <h1 className="text-sm text-gray-600 mb-1">시작날짜</h1>
        <Input
          type="month"
          value={startDate}
          onChange={(e) => onStartDate(e.target.value)}
          className="h-9 border-gray-400 shadow-sm placeholder:text-gray-400"
        />
      </div>
      <div>
        <h1 className="text-sm text-gray-600 mb-1">종료날짜</h1>
        <Input
          type="month"
          value={endDate}
          onChange={(e) => onEndDate(e.target.value)}
          className="h-9 border-gray-400 shadow-sm placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}

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
  const charCount = useMemo(() => {
    if (isEdit) {
      return session.items.reduce((acc, item) => {
        const real = item.text.replace(/^•\s*/gm, "").trim();
        return acc + real.length;
      }, 0);
    }
    return session.wordCount || 0;
  }, [isEdit, session.wordCount, session.items]);
  return (
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center justify-between gap-3 text-xl">
        <div className="flex flex-wrap items-center gap-3">
          {isEdit ? (
            <Input
              value={session.title}
              onChange={(e) => onTitle(e.target.value)}
              className="text-lg border-gray-400 shadow-sm font-semibold h-9 w-full md:w-[min(28rem,90vw)] placeholder:text-gray-400"
              placeholder="섹션 제목"
            />
          ) : (
            <span className="font-semibold text-gray-900">{session.title}</span>
          )}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full">
              {session.items.length}개 항목
            </Badge>
            <Badge variant="outline" className="rounded-full border-gray-200">
              {charCount.toLocaleString()}자
            </Badge>
          </div>
        </div>
        {isEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 items-start"
            title="섹션 삭제"
          >
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
  sessionTitle,
  onChangeText,
  onChangeTitle,
  onChangeCompanyAddress,
  onChangeStartDate,
  onChangeEndDate,
  onRemove,
}: {
  isEdit: boolean;
  item: ResumeItem;
  sessionTitle: string;
  onChangeText: (v: string) => void;
  onChangeTitle: (v: string) => void;
  onChangeCompanyAddress: (v: string) => void;
  onChangeStartDate: (v: string) => void;
  onChangeEndDate: (v: string) => void;
  onRemove: () => void;
}) {
  const showMeta = hasKeyword(item.title);
  const showSkillMeta = hasSkillKeyword(sessionTitle);
  return (
    <div
      className={[
        "rounded-xl p-4 transition-shadow",
        isEdit
          ? "ring-1 ring-gray-300 bg-white focus-within:ring-2 focus-within:ring-blue-300"
          : "ring-1 ring-gray-300 bg-white hover:shadow-sm",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-2">
        {isEdit ? (
          !showSkillMeta ? (
            <Input
              value={item.title}
              onChange={(e) => onChangeTitle(e.target.value)}
              className="font-medium h-10 w-[min(28rem,90vw)] placeholder:text-gray-400 border-gray-400 shadow-sm"
              placeholder="항목 제목"
            />
          ) : (
            <div />
          )
        ) : (
          <h4 className="font-medium text-gray-900">
            {showSkillMeta ? "" : item.title}
          </h4>
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

      {isEdit && showMeta && !showSkillMeta && (
        <ItemMetaFields
          companyAddress={item.companyAddress || ""}
          startDate={item.startDate || ""}
          endDate={item.endDate || ""}
          onCompanyAddress={onChangeCompanyAddress}
          onStartDate={onChangeStartDate}
          onEndDate={onChangeEndDate}
        />
      )}

      {!showSkillMeta && (
        <div className="flex">
          {!isEdit && item.companyAddress && (
            <p className="text-xs text-gray-500 mt-1 mr-1">
              {item.companyAddress} |
            </p>
          )}
          {!isEdit && item.startDate && item.endDate && (
            <p className="text-xs text-gray-500 mt-1 mr-1">
              {item.startDate} ~ {item.endDate}
            </p>
          )}
        </div>
      )}

      <div className="mt-3">
        {isEdit ? (
          <BulletTextarea
            value={item.text}
            onChange={onChangeText}
            className="w-full min-h-[96px] border-gray-400 shadow-sm placeholder:text-gray-400"
          />
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {item.text}
          </p>
        )}
      </div>

      {!isEdit && (item as any).review && (
        <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
          <p className="text-sm text-blue-800">
            <strong>AI 피드백:</strong> {(item as any).review}
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
  const { resume, loading, error, isEdit } = useAppSelector((s) => s.resume);
  const [draft, setDraft] = useState<ResumeModel | null>(null);

  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionItemTitle, setSectionItemTitle] = useState("");
  const [sectionItemText, setSectionItemText] = useState("");
  const [sectionCompanyAddress, setSectionCompanyAddress] = useState("");
  const [sectionStartDate, setSectionStartDate] = useState("");
  const [sectionEndDate, setSectionEndDate] = useState("");

  const [addingKey, setAddingKey] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");
  const [newCompanyAddress, setNewCompanyAddress] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");

  const [isReviewing, setIsReviewing] = useState(false);

  useEffect(() => {
    if (id) dispatch(getResume(id));
  }, [id, dispatch]);

  useEffect(() => {
    setDraft(resume ? normalizeSkillSections(resume) : null);
  }, [resume]);

  useEffect(() => {
    if (error) alert(error);
  }, [error]);

  const totalChars = useMemo(() => draft?.totalCount || 0, [draft]);

  const updateDraft = (fn: (d: ResumeModel) => void) => {
    if (!draft) return;
    const copy = structuredClone(draft);
    fn(copy);
    setDraft(copy);
  };

  const saveAll = async () => {
    if (!id || !draft) return;
    try {
      const normalized = normalizeSkillSections(draft);
      await dispatch(
        patchResume({
          id,
          patch: {
            title: normalized.title,
            sessions: normalized.sessions,
            replaceSessions: true,
          } as any,
        })
      ).unwrap();
      dispatch(setIsEdit(false));
    } catch (e: any) {
      alert(typeof e === "string" ? e : e?.message ?? "저장 실패");
    }
  };

  const handleNewReview = async () => {
    setIsReviewing(true);
    if (id) {
      await dispatch(getAiReview(id));
      dispatch(setHasFeedbackResume(false));
      setIsReviewing(false);
      navigate(`/analysis/${id}`);
    }
  };

  if (loading && !draft) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen px-6">
          <div className="text-center space-y-6">
            {/* Loading Icon */}
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div
                className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s",
                }}
              ></div>
            </div>

            {/* Loading Text */}
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-gray-800">
                이력서를 불러오고 있습니다
              </h2>
              <p className="text-gray-600">잠시만 기다려주세요...</p>
            </div>

            {/* Loading Dots */}
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isReviewing) {
    return (
      <>
        <Header />
        <LoadingAnimation
          title="AI 분석 중입니다"
          description="이력서를 분석하고 개선점을 찾아내고 있어요. 잠시만 기다려주세요!"
          progress={60}
          variant="analysis"
        />
      </>
    );
  }

  if (!draft) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            이력서를 찾을 수 없습니다
          </h2>
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const cancelEdit = () => {
    if (
      !window.confirm(
        "편집된 내용을 모두 삭제할까요? 저장하지 않은 변경사항이 사라집니다."
      )
    )
      return;
    if (resume) setDraft(normalizeSkillSections(resume));
    dispatch(setIsEdit(false));
    setAddingKey(null);
    setNewTitle("");
    setNewText("");
    setNewCompanyAddress("");
    setNewStartDate("");
    setNewEndDate("");
    setAddSectionOpen(false);
    setSectionTitle("");
    setSectionItemTitle("");
    setSectionItemText("");
    setSectionCompanyAddress("");
    setSectionStartDate("");
    setSectionEndDate("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-200 shadow-[0_1px_0_0_rgba(0,0,0,0.02)]">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className={`flex ${isEdit ? 'flex-col' : 'flex-row'} md:flex-row items-start md:items-center justify-between`}>
            <Button
              onClick={() => {
                dispatch(setIsEdit(false));
                navigate("/dashboard");
              }}
              variant="ghost"
              size="sm"
              className="hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> 목록으로
            </Button>
            <div className="flex items-center gap-3">
              {!isEdit && (
                <Badge>
                  <Star className="h-3 w-3 mr-1" /> {draft.score}점
                </Badge>
              )}
              {!isEdit ? (
                <Button
                  onClick={() => dispatch(setIsEdit(true))}
                  variant="outline"
                  size="sm"
                  className="border-gray-200"
                >
                  <Pencil className="h-4 w-4 mr-2" /> 편집
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={cancelEdit}
                    variant="outline"
                    size="sm"
                    className="border-gray-200"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" /> 편집 취소
                  </Button>
                  <Button
                    onClick={saveAll}
                    variant="outline"
                    disabled={loading}
                    size="sm"
                    className="border-gray-200"
                  >
                    <Save className="h-4 w-4 mr-2" /> 저장
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="mb-2 shadow-sm border-gray-300">
          <CardHeader className="pb-3">
            {isEdit ? (
              <Input
                value={draft.title}
                onChange={(e) => updateDraft((d) => (d.title = e.target.value))}
                className="text-2xl font-bold h-11 border-gray-400 shadow-sm placeholder:text-gray-400"
                placeholder="이력서 제목"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900">
                {draft.title}
              </h1>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Info
                icon={<Calendar className="h-4 w-4 text-gray-500" />}
                label="마지막 수정"
                value={formatDate(draft.updatedAt)}
              />
              <Info
                icon={<Hash className="h-4 w-4 text-gray-500" />}
                label="총 글자 수"
                value={`${totalChars.toLocaleString()}자`}
              />
              <Info
                icon={<TrendingUp className="h-4 w-4 text-gray-500" />}
                label="AI 점수"
                value={`${draft.score}점`}
              />
              <Info
                icon={<FileText className="h-4 w-4 text-gray-500" />}
                label="섹션 수"
                value={`${draft.sessions.length}`}
              />
            </div>
          </CardContent>
        </Card>

        {isEdit && (
          <Card className="mb-2 border-gray-300 shadow-sm">
            <CardContent className="pt-0">
              {addSectionOpen ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      autoFocus
                      placeholder="섹션 제목"
                      value={sectionTitle}
                      onChange={(e) => setSectionTitle(e.target.value)}
                      className="h-10 placeholder:text-gray-400 border-gray-400 shadow-sm"
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
                            const isSkill = hasSkillKeyword(sectionTitle);
                            const newSession: ResumeSessionModel = {
                              key,
                              title: sectionTitle.trim(),
                              items: [],
                              wordCount: 0,
                            };

                            if (isSkill) {
                              newSession.items = [
                                {
                                  title: "",
                                  text: (sectionItemText ?? "").trim(),
                                  companyAddress: "",
                                  startDate: "",
                                  endDate: "",
                                },
                              ];
                            } else {
                              const hasFirstItem =
                                sectionItemTitle.trim() !== "" ||
                                sectionItemText.trim() !== "";
                              if (hasFirstItem) {
                                newSession.items.push({
                                  title: sectionItemTitle.trim() || "새 항목",
                                  text: sectionItemText.trim() || "",
                                  companyAddress: sectionCompanyAddress.trim(),
                                  startDate: sectionStartDate,
                                  endDate: sectionEndDate,
                                });
                              }
                            }
                            d.sessions.push(newSession);
                          });
                          setSectionTitle("");
                          setSectionItemTitle("");
                          setSectionItemText("");
                          setSectionCompanyAddress("");
                          setSectionStartDate("");
                          setSectionEndDate("");
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
                          setSectionCompanyAddress("");
                          setSectionStartDate("");
                          setSectionEndDate("");
                        }}
                        className="border-gray-200"
                      >
                        취소
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-xl ring-1 ring-dashed ring-gray-300 p-4 bg-gray-50/60">
                    <div className="space-y-3">
                      {!hasSkillKeyword(sectionTitle) && (
                        <Input
                          placeholder="항목 제목"
                          value={sectionItemTitle}
                          onChange={(e) => setSectionItemTitle(e.target.value)}
                          className="font-medium h-10 placeholder:text-gray-400 border-gray-400 shadow-sm"
                        />
                      )}
                      {hasKeyword(sectionItemTitle) && (
                        <ItemMetaFields
                          companyAddress={sectionCompanyAddress}
                          startDate={sectionStartDate}
                          endDate={sectionEndDate}
                          onCompanyAddress={setSectionCompanyAddress}
                          onStartDate={setSectionStartDate}
                          onEndDate={setSectionEndDate}
                          className="grid grid-cols-1 md:grid-cols-3 gap-2"
                        />
                      )}
                      <BulletTextarea
                        placeholder="내용을 입력하세요"
                        value={sectionItemText}
                        onChange={setSectionItemText}
                        className="min-h-[100px] placeholder:text-gray-400 border-gray-400 shadow-sm"
                        rows={5}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setAddSectionOpen(true)}
                  className="border-gray-200"
                >
                  <Plus className="h-4 w-4 mr-2" /> 섹션 추가
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {draft.sessions.map((session) => {
            const isSkillSection = hasSkillKeyword(session.title);
            return (
              <Card key={session.key} className="border-gray-300 shadow-sm">
                <SectionHeader
                  isEdit={isEdit}
                  session={session}
                  onTitle={(v) =>
                    updateDraft((d) => {
                      const s = d.sessions.find((x) => x.key === session.key);
                      if (s) {
                        s.title = v;
                        if (hasSkillKeyword(v)) {
                          const first = s.items?.[0] ?? { text: "" };
                          s.items = [
                            {
                              title: "",
                              text: first.text ?? "",
                              companyAddress: "",
                              startDate: "",
                              endDate: "",
                            },
                          ];
                        }
                      }
                    })
                  }
                  onRemove={() => {
                    if (!confirm("이 섹션을 삭제할까요?")) return;
                    updateDraft((d) => {
                      d.sessions = d.sessions.filter(
                        (s) => s.key !== session.key
                      );
                    });
                  }}
                />

                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {session.items.length === 0 && !isEdit ? (
                      <div className="text-center py-10 text-gray-500">
                        아직 추가된 항목이 없습니다.
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3">
                          {session.items.map((item, idx) => (
                            <ItemBlock
                              key={idx}
                              isEdit={isEdit}
                              sessionTitle={session.title}
                              item={item}
                              onChangeText={(v) =>
                                updateDraft((d) => {
                                  const s = d.sessions.find(
                                    (x) => x.key === session.key
                                  );
                                  if (s?.items[idx]) s.items[idx].text = v;
                                })
                              }
                              onChangeTitle={(v) =>
                                updateDraft((d) => {
                                  const s = d.sessions.find(
                                    (x) => x.key === session.key
                                  );
                                  if (s?.items[idx]) s.items[idx].title = v;
                                })
                              }
                              onChangeCompanyAddress={(v) =>
                                updateDraft((d) => {
                                  const s = d.sessions.find(
                                    (x) => x.key === session.key
                                  );
                                  if (s?.items[idx])
                                    s.items[idx].companyAddress = v;
                                })
                              }
                              onChangeStartDate={(v) =>
                                updateDraft((d) => {
                                  const s = d.sessions.find(
                                    (x) => x.key === session.key
                                  );
                                  if (s?.items[idx]) s.items[idx].startDate = v;
                                })
                              }
                              onChangeEndDate={(v) =>
                                updateDraft((d) => {
                                  const s = d.sessions.find(
                                    (x) => x.key === session.key
                                  );
                                  if (s?.items[idx]) s.items[idx].endDate = v;
                                })
                              }
                              onRemove={() => {
                                if (!confirm("이 항목을 삭제할까요?")) return;
                                updateDraft((d) => {
                                  const s = d.sessions.find(
                                    (x) => x.key === session.key
                                  );
                                  if (!s) return;
                                  s.items.splice(idx, 1);
                                });
                              }}
                            />
                          ))}
                        </div>

                        {isEdit &&
                          (addingKey === session.key ? (
                            <div className="rounded-xl ring-1 ring-dashed ring-gray-300 p-4 bg-gray-50/60">
                              <div className="space-y-3">
                                <Input
                                  placeholder="항목 제목"
                                  value={newTitle}
                                  onChange={(e) => setNewTitle(e.target.value)}
                                  className="font-medium h-10 placeholder:text-gray-400 border-gray-400 shadow-sm"
                                />
                                {hasKeyword(newTitle) && (
                                  <ItemMetaFields
                                    companyAddress={newCompanyAddress}
                                    startDate={newStartDate}
                                    endDate={newEndDate}
                                    onCompanyAddress={setNewCompanyAddress}
                                    onStartDate={setNewStartDate}
                                    onEndDate={setNewEndDate}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-2"
                                  />
                                )}
                                <BulletTextarea
                                  placeholder="내용을 입력하세요"
                                  value={newText}
                                  onChange={setNewText}
                                  className="min-h-[100px] placeholder:text-gray-400 border-gray-400 shadow-sm"
                                  rows={5}
                                />
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setAddingKey(null);
                                      setNewTitle("");
                                      setNewText("");
                                      setNewCompanyAddress("");
                                      setNewStartDate("");
                                      setNewEndDate("");
                                    }}
                                    className="border-gray-200"
                                  >
                                    취소
                                  </Button>
                                  <Button
                                    size="sm"
                                    disabled={!newText.trim()}
                                    onClick={() => {
                                      if (!newText.trim()) return;
                                      updateDraft((d) => {
                                        const s = d.sessions.find(
                                          (x) => x.key === session.key
                                        );
                                        if (!s) return;

                                        if (hasSkillKeyword(s.title)) {
                                          s.items = [
                                            {
                                              title: "",
                                              text: newText.trim(),
                                              companyAddress: "",
                                              startDate: "",
                                              endDate: "",
                                            },
                                          ];
                                        } else {
                                          s.items.push({
                                            title: newTitle.trim() || "새 항목",
                                            text: newText.trim(),
                                            companyAddress:
                                              newCompanyAddress.trim(),
                                            startDate: newStartDate,
                                            endDate: newEndDate,
                                          });
                                        }
                                      });
                                      setAddingKey(null);
                                      setNewTitle("");
                                      setNewText("");
                                      setNewCompanyAddress("");
                                      setNewStartDate("");
                                      setNewEndDate("");
                                    }}
                                  >
                                    추가
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            !isSkillSection && (
                              <Button
                                variant="outline"
                                className="w-full border-gray-200"
                                onClick={() => setAddingKey(session.key)}
                              >
                                <Plus className="h-4 w-4 mr-2" /> 새 항목
                                추가하기
                              </Button>
                            )
                          ))}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {!isEdit && (
          <div className="flex justify-end gap-3 mt-8">
            <Button
              variant="outline"
              onClick={() => {
                const hasOldText = resume?.sessions?.some((session) =>
                  session.items.some((item) => !!(item as any).oldText)
                );
                dispatch(setHasFeedbackResume(!!hasOldText));
                navigate(`/analysis/${id}`);
              }}
              className="border-gray-200"
            >
              이전 분석 보러가기
            </Button>
            <Button
              variant="default"
              onClick={handleNewReview}
              className="border-gray-200"
              disabled={isReviewing}
            >
              {isReviewing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  분석 중...
                </>
              ) : (
                "분석 새로받기"
              )}
            </Button>
            {/* <Button onClick={() => navigate(`/roadmap/${id}`)}>
              로드맵 보러가기
            </Button> */}
          </div>
        )}
      </div>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2 ring-1 ring-gray-100">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-[11px] uppercase tracking-wide text-gray-500">
          {label}
        </p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
