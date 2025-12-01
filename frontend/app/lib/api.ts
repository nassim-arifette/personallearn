import { quizQuestions as fallbackQuestions, QuizQuestion } from "./content";

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000").replace(/\/$/, "");

type BackendQuizQuestion = { q: string; options: string[]; correct: string };

export type ProfileResponse = {
  level: string;
  units: number;
  desc: string;
  efficiency: number;
};

export type CourseResponse = {
  course: any;
  course_pdf_base64?: string;
};

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(detail || res.statusText);
  }
  return (await res.json()) as T;
}

export async function getQuizQuestions(): Promise<QuizQuestion[]> {
  try {
    const data = await fetchJson<{ questions: BackendQuizQuestion[] }>("/quiz");
    return data.questions.map((q) => ({
      prompt: q.q,
      options: q.options,
      correct: q.correct,
    }));
  } catch {
    // Fall back to bundled questions if the backend is unavailable.
    return fallbackQuestions;
  }
}

export async function submitProfile(score: number, durationSeconds: number) {
  return fetchJson<ProfileResponse>("/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score, duration_seconds: durationSeconds }),
  });
}

export async function createCourse(formData: FormData) {
  return fetchJson<CourseResponse>("/course", {
    method: "POST",
    body: formData,
  });
}
