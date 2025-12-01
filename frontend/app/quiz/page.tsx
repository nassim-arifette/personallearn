"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GradientButton, GlassCard, TopBar } from "../components/ui";
import { quizQuestions } from "../lib/content";

type Theme = "dark" | "light";

export default function QuizPage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const totalQuestions = quizQuestions.length;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(() =>
    Array(totalQuestions).fill(null)
  );
  const router = useRouter();
  const question = quizQuestions[currentQuestion];
  const selectedOption = answers[currentQuestion];
  const answeredCount = answers.filter(Boolean).length;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const handleOptionSelect = (option: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQuestion] = option;
      return next;
    });
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      router.push("/profile");
    }
  };

  const handlePrevious = () => {
    if (currentQuestion === 0) return;
    setCurrentQuestion((prev) => prev - 1);
  };

  const jumpToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  const progress = Math.round((answeredCount / totalQuestions) * 100);
  const isLastQuestion = currentQuestion === totalQuestions - 1;

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
            {quizQuestions.map((_, index) => (
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
          <h2 className="quiz-question">{question.prompt}</h2>
          <div className="quiz-options">
            {question.options.map((option) => (
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
            <GradientButton onClick={handleNext}>
              {isLastQuestion ? "Continue to Profile" : "Next question"}
            </GradientButton>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
