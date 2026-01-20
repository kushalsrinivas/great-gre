export type GREQuestionType =
  | 'equivalent_meaning'
  | 'single_blank'
  | 'double_blank'
  | 'triple_blank'
  | string;

export type GREOptionId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface GREOption {
  id: GREOptionId;
  text: string;
  raw: string;
}

export interface GREQuestionRaw {
  url?: string;
  type?: GREQuestionType;
  question: string;
  options: string[];
  answer: string[]; // letters: ["A"], ["B","F"], etc.
  explanation?: string;
}

export interface GREQuestionNormalized {
  questionKey: string;
  sourceUrl?: string;
  type: GREQuestionType;
  question: string;
  options: GREOption[];
  correctOptionIds: GREOptionId[];
  requiredSelectionCount: number;
  explanation: string;
}

const OPTION_RE = /^\s*([A-F])[\.\)]?\s+(.*)\s*$/;

export function normalizeGREOption(raw: string): GREOption | null {
  const match = raw.match(OPTION_RE);
  if (!match) return null;
  const id = match[1] as GREOptionId;
  const text = match[2] ?? '';
  return { id, text, raw };
}

export function createQuestionKey(q: Pick<GREQuestionRaw, 'url' | 'type' | 'question'>): string {
  const url = (q.url ?? '').trim();
  if (url.length > 0) return url;
  const type = (q.type ?? 'unknown').trim();
  return `${type}::${q.question}`;
}

export function normalizeGREQuestion(raw: GREQuestionRaw): GREQuestionNormalized {
  const type: GREQuestionType = raw.type ?? 'unknown';
  const options = raw.options
    .map((o) => normalizeGREOption(o))
    .filter((o): o is GREOption => Boolean(o));

  const correctOptionIds = (raw.answer ?? [])
    .map((a) => (a ?? '').trim().toUpperCase())
    .filter((a): a is GREOptionId => ['A', 'B', 'C', 'D', 'E', 'F'].includes(a)) as GREOptionId[];

  const requiredSelectionCount =
    type === 'equivalent_meaning' ? 2 : Math.max(1, correctOptionIds.length || 1);

  return {
    questionKey: createQuestionKey(raw),
    sourceUrl: (raw.url ?? '').trim() || undefined,
    type,
    question: raw.question,
    options,
    correctOptionIds,
    requiredSelectionCount,
    explanation: raw.explanation ?? '',
  };
}

export interface LoadGREQuestionsParams {
  includeTypes?: GREQuestionType[];
}

export function loadGREQuestions(params: LoadGREQuestionsParams = {}): GREQuestionNormalized[] {
  // Keep these `require`s static so Metro can bundle them.
  const seq: GREQuestionRaw[] = require('../../questions/gre_questions_seq.json');
  const tcq: GREQuestionRaw[] = require('../../questions/gre_questions_tcq.json');
  const all = [...seq, ...tcq].map(normalizeGREQuestion);

  const includeTypes = params.includeTypes?.length ? new Set(params.includeTypes) : null;
  return includeTypes ? all.filter((q) => includeTypes.has(q.type)) : all;
}

