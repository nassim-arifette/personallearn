"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GradientButton, GlassCard, TopBar } from "../components/ui";
import { QuizQuestion } from "../lib/content";
import { getQuizQuestions, submitProfile } from "../lib/api";

type Theme = "dark" | "light";

export default function QuizPage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setStartTime(Date.now());
    getQuizQuestions()
      .then((qs) => {
        setQuestions(qs);
        setAnswers(Array(qs.length).fill(""));
      })
      .catch((err) => setError(err.message || "Failed to load questions"))
      .finally(() => setLoading(false));
  }, []);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const handleOptionSelect = (option: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQuestion] = option;
      return next;
    });
  };

  const totalQuestions = questions.length || 1;
  const selectedOption = answers[currentQuestion];
  const answeredCount = answers.filter(Boolean).length;
  const progress = Math.round((answeredCount / totalQuestions) * 100);
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  const computeScore = () =>
    answers.reduce((acc, ans, idx) => {
      const correct = questions[idx]?.correct;
      if (ans && correct && ans === correct) return acc + 1;
      return acc;
    }, 0);

  const finishQuiz = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const durationSeconds = startTime ? (Date.now() - startTime) / 1000 : 0;
      const score = computeScore();
      const profile = await submitProfile(score, durationSeconds);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "personalLearnProfile",
          JSON.stringify({ profile, score, durationSeconds })
        );
      }
      router.push("/profile");
    } catch (err: any) {
      setError(err.message || "Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion === 0) return;
    setCurrentQuestion((prev) => prev - 1);
  };

  const jumpToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  if (loading) {
    return (
      <div className="page-shell">
        <main className="content">
          <GlassCard className="quiz-panel">Loading questions...</GlassCard>
        </main>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="page-shell">
      <div className="nebula nebula-a" />
      <div className="nebula nebula-b" />
      <div className="nebula nebula-c" />
      <TopBar />
      <div className="top-actions theme-toggle">
        <button className="toggle" onClick={toggleTheme}>
          {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
        </button>
      </div>

      <main className="content">
        <GlassCard className="quiz-panel">
          <div className="quiz-header">
            <span className="muted small">
              Step 2 - Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <div className="progress">
              <span className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="quiz-nav">
            {questions.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`question-chip ${currentQuestion === index ? "active" : ""} ${
                  answers[index] ? "answered" : ""
                }`}
                onClick={() => jumpToQuestion(index)}
                aria-pressed={currentQuestion === index}
              >
                Q{index + 1}
              </button>
            ))}
            <span className="muted small">Jump to any question and your answers stay saved.</span>
          </div>
          {error && (
            <p className="upload-error small" role="alert">
              {error}
            </p>
          )}
          <h2 className="quiz-question">{question?.prompt}</h2>
          <div className="quiz-options">
            {question?.options.map((option) => (
              <button
                key={option}
                className={`option ${selectedOption === option ? "selected" : ""}`}
                type="button"
                aria-pressed={selectedOption === option}
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="quiz-actions">
            <GradientButton ghost onClick={handlePrevious} disabled={currentQuestion === 0}>
              Previous
            </GradientButton>
            <GradientButton onClick={handleNext} disabled={submitting}>
              {isLastQuestion ? "Continue to Profile" : "Next question"}
            </GradientButton>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
