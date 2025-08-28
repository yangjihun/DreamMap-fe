import React, { useMemo, useCallback, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Plus } from "lucide-react";

const KEYWORDS = ['경력', '학력', '프로젝트', '수상', '인증', '활동', '경험', 'project', 'award'];

export type DraftItem = {
  id: string;
  title: string;
  companyAddress: string;
  startDate: string;
  endDate: string;
  text: string;
};

export type DraftSection = {
  id: string;
  title: string;
  items: DraftItem[];
  key: string;
};

interface TextUploadProps {
  sections: DraftSection[];
  onChange: (sections: DraftSection[]) => void;
}

export function hasRealContent(text: string): boolean {
  const cleanText = text.replace(/^•\s*/gm, "").trim();
  return cleanText.length > 0;
}

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

/** 제로폭 문자/비표준 공백 제거 유틸 */
const clean = (raw: string) =>
  (raw ?? "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\u00A0/g, " ");

const ItemBlock: React.FC<{
  item: DraftItem;
  canRemove: boolean;
  onChange: (id: string, patch: Partial<DraftItem>) => void;
  onRemove: (id: string) => void;
}> = ({ item, canRemove, onChange, onRemove }) => {
  const composingRef = useRef(false);

  const showMeta = useMemo(() => {
    const trimTitle = (item.title ?? "").trim();
    if (!trimTitle) return false;
    return KEYWORDS.some((k) => trimTitle.includes(k));
  }, [item.title]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextTitle = e.target.value;
    onChange(item.id, { title: nextTitle });
  };

  const handleCompanyAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(item.id, { companyAddress: e.target.value });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(item.id, { startDate: e.target.value });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(item.id, { endDate: e.target.value });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (composingRef.current) return;

    if (e.key === "Enter") {
      e.preventDefault();
      const { selectionStart, selectionEnd, value } = e.currentTarget;
      const before = value.substring(0, selectionStart);
      const after = value.substring(selectionEnd);
      const currentLine = before.split('\n').pop() || "";
      const shouldAddBullet = currentLine.trim() !== "" && currentLine.trim() !== "•";
      const insert = "\n" + (shouldAddBullet ? "• " : "");
      onChange(item.id, { text: before + insert + after });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const raw0 = e.target.value;
    const raw = clean(raw0);

    if (composingRef.current) {
      onChange(item.id, { text: raw });
      return;
    }

    const trimmed = raw.trim();
    if (trimmed === "" || trimmed === "•" || trimmed === "•") {
      onChange(item.id, { text: "" });
      return;
    }
    const next = raw.startsWith("• ") ? raw : `• ${raw}`;
    onChange(item.id, { text: next });
  };

  return (
    <div className="rounded-xl p-4 ring-1 ring-gray-200 bg-white focus-within:ring-2 focus-within:ring-blue-300 transition-shadow">
      <div className="flex items-center justify-between gap-2 mb-3">
        <input
          placeholder="아이템 제목"
          value={item.title}
          onChange={handleTitleChange}
          className="font-medium h-10 border-2 border-gray-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 px-3 rounded-md flex-1"
        />
        {canRemove && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            aria-label="항목 삭제"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </Button>
        )}
      </div>

      {showMeta && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-3">
          <div>
            <h1>회사/기관/개인</h1>
            <input
              placeholder="회사/기관/개인"
              value={item.companyAddress}
              onChange={handleCompanyAddressChange}
              className="h-10 border-2 border-gray-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 px-3 rounded-md"
            />
          </div>
          <div>
            <h1 className="text-gray-600">시작날짜</h1>
            <input
              type="month"
              placeholder="시작날짜"
              value={item.startDate}
              onChange={handleStartDateChange}
              className="h-10 border-2 border-gray-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 px-10 rounded-md"
            />
          </div>
          <div>
            <h1>종료날짜</h1>
            <input
              type="month"
              placeholder="종료날짜"
              value={item.endDate}
              onChange={handleEndDateChange}
              className="h-10 border-2 border-gray-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 px-10 rounded-md"
            />
          </div>
        </div>
      )}

      <textarea
        placeholder="내용을 입력하세요"
        value={item.text}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => { composingRef.current = true; }}
        onCompositionEnd={(e) => {
          composingRef.current = false;
          const raw = clean(e.currentTarget.value);
          const trimmed = raw.trim();
          if (trimmed === "" || trimmed === "•") {
            onChange(item.id, { text: "" });
          } else if (!raw.startsWith("• ")) {
            onChange(item.id, { text: `• ${raw}` });
          }
        }}
        autoComplete="off"
        spellCheck={false}
        className="border-2 border-gray-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 min-h-[100px] w-full px-3 py-2 rounded-md resize-none"
      />
      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
        <span>문자수: {item.text.replace(/^•\s*/gm, "").trim().length}자</span>
      </div>
    </div>
  );
};

const SectionCard: React.FC<{
  section: DraftSection;
  index: number;
  canRemove: boolean;
  onChange: (id: string, patch: Partial<DraftSection>) => void;
  onRemove: (id: string) => void;
  onItemChange: (
    sectionId: string,
    itemId: string,
    patch: Partial<DraftItem>
  ) => void;
  onItemAdd: (sectionId: string) => void;
  onItemRemove: (sectionId: string, itemId: string) => void;
}> = ({
  section,
  index,
  canRemove,
  onChange,
  onRemove,
  onItemChange,
  onItemAdd,
  onItemRemove,
}) => {
  const totalChars = useMemo(
    () =>
      section.items.reduce((acc, item) => {
        const realContent = item.text.replace(/^•\s*/gm, "").trim();
        return acc + realContent.length;
      }, 0),
    [section.items]
  );

  const handleAddItem = () => {
    onItemAdd(section.id);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col gap-3">
          <input
            placeholder="섹션 제목"
            value={section.title}
            onChange={(e) => onChange(section.id, { title: e.target.value })}
            className="border-2 border-gray-200 bg-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 px-3 py-2 rounded-md"
          />
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full text-xs">
              {section.items.length}개 항목
            </Badge>
            <Badge
              variant="outline"
              className="rounded-full border-gray-200 text-xs"
            >
              {totalChars.toLocaleString()}자
            </Badge>
          </div>
        </div>
        {canRemove && (
          <Button
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onRemove(section.id)}
            aria-label={`${section.title} 삭제`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        <div className="space-y-3">
          {section.items.map((item) => (
            <ItemBlock
              key={item.id}
              item={item}
              canRemove={section.items.length > 1}
              onChange={(itemId, patch) =>
                onItemChange(section.id, itemId, patch)
              }
              onRemove={(itemId) => onItemRemove(section.id, itemId)}
            />
          ))}

          <Button
            variant="outline"
            className="w-full border-gray-200 border-dashed hover:scale-100"
            onClick={handleAddItem}
          >
            <Plus className="h-4 w-4 mr-2" /> 새 항목 추가하기
          </Button>
        </div>
      </div>
    </div>
  );
};

const TextUpload: React.FC<TextUploadProps> = ({ sections, onChange }) => {
  useEffect(() => {
    let dirty = false;
    const fixed = sections.map((sec) => {
      const items = sec.items.map((it) => {
        const v = clean(it.text ?? "");
        const t = v.trim();
        if (t === "" || t === "•") {
          if (it.text !== "") dirty = true;
          return { ...it, text: "" };
        }
        return it;
      });
      const changed =
        items.length !== sec.items.length ||
        items.some((it, idx) => it.text !== sec.items[idx].text);
      return changed ? { ...sec, items } : sec;
    });
    if (dirty) onChange(fixed);
  }, []);

  const addSection = useCallback(() => {
    const existingKeys = sections.map((s) => s.key);
    const key = uniqueKey(`section-${sections.length + 1}`, existingKeys);
    const newSections = [
      ...sections,
      {
        id: crypto.randomUUID(),
        title: "",
        items: [{ id: crypto.randomUUID(), title: "", text: "", companyAddress: "", startDate: "", endDate: "" }],
        key,
      },
    ];
    onChange(newSections);
  }, [sections, onChange]);

  const removeSection = useCallback(
    (id: string) => {
      const newSections = sections.filter((s) => s.id !== id);
      onChange(newSections);
    },
    [sections, onChange]
  );

  const updateSection = useCallback(
    (id: string, patch: Partial<DraftSection>) => {
      const newSections = sections.map((s) => {
        if (s.id !== id) return s;
        const next: DraftSection = { ...s, ...patch };
        if (typeof patch.title === "string") {
          const existingKeys = sections
            .filter((x) => x.id !== id)
            .map((x) => x.key);
          next.key = uniqueKey(patch.title || "section", existingKeys);
        }
        return next;
      });
      onChange(newSections);
    },
    [sections, onChange]
  );

  const updateItem = useCallback(
    (sectionId: string, itemId: string, patch: Partial<DraftItem>) => {
      const newSections = sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId ? { ...item, ...patch } : item
              ),
            }
          : section
      );
      onChange(newSections);
    },
    [sections, onChange]
  );

  const addItem = useCallback(
    (sectionId: string) => {
      const newSections = sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: [
                ...section.items,
                { id: crypto.randomUUID(), title: "", text: "", companyAddress: "", startDate: "", endDate: "" },
              ],
            }
          : section
      );
      onChange(newSections);
    },
    [sections, onChange]
  );

  const removeItem = useCallback(
    (sectionId: string, itemId: string) => {
      const newSections = sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.filter((item) => item.id !== itemId),
            }
          : section
      );
      onChange(newSections);
    },
    [sections, onChange]
  );

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center justify-end">
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
          onItemChange={updateItem}
          onItemAdd={addItem}
          onItemRemove={removeItem}
        />
      ))}
    </div>
  );
};

export default TextUpload;
