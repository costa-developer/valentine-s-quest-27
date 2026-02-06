import { useState } from "react";
import { FloatingHearts } from "@/components/FloatingHearts";
import { QuestionCard } from "@/components/QuestionCard";
import { SuccessScreen } from "@/components/SuccessScreen";
import { Dashboard } from "@/components/Dashboard";
import { LoveMeter } from "@/components/LoveMeter";
import { useValentineState } from "@/hooks/useValentineState";
import { questions, maybeMessages } from "@/data/questions";
import { Heart } from "lucide-react";
import { toast } from "sonner";

type View = "questions" | "success" | "dashboard";

const Index = () => {
  const {
    responses,
    loveMeterValue,
    accepted,
    acceptedAt,
    currentQuestion,
    addResponse,
    setAccepted,
    reset,
  } = useValentineState();

  const [view, setView] = useState<View>(accepted ? "success" : "questions");
  const [maybeCount, setMaybeCount] = useState(0);

  const handleAnswer = (answer: "yes" | "maybe" | "no") => {
    if (answer === "no") return; // Handled in QuestionCard

    const questionId = questions[currentQuestion].id;
    addResponse(answer, questionId);

    if (answer === "maybe") {
      const message = maybeMessages[maybeCount % maybeMessages.length];
      toast(message, {
        icon: "💕",
        duration: 3000,
      });
      setMaybeCount((prev) => prev + 1);
    }

    // Check if this was the last question or they said yes on any
    if (answer === "yes" || currentQuestion >= questions.length - 1) {
      setAccepted();
      setView("success");
    }
  };

  const handleReset = () => {
    reset();
    setView("questions");
    setMaybeCount(0);
  };

  const handleViewDashboard = () => {
    setView("dashboard");
  };

  const handleBackFromDashboard = () => {
    setView(accepted ? "success" : "questions");
  };

  if (view === "dashboard") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-valentine-blush">
        <FloatingHearts />
        <Dashboard
          responses={responses}
          loveMeterValue={loveMeterValue}
          accepted={accepted}
          acceptedAt={acceptedAt}
          onBack={handleBackFromDashboard}
          onReset={handleReset}
        />
      </div>
    );
  }

  if (view === "success" || accepted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-valentine-blush">
        <FloatingHearts />
        <SuccessScreen
          loveMeterValue={loveMeterValue}
          onReset={handleReset}
          onViewDashboard={handleViewDashboard}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-valentine-blush flex flex-col items-center justify-center p-4">
      <FloatingHearts />
      
      {/* Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="w-10 h-10 text-valentine-red fill-current animate-pulse-love" />
          <h1 className="text-4xl md:text-6xl font-romantic text-valentine-red">
            Be My Valentine?
          </h1>
          <Heart className="w-10 h-10 text-valentine-red fill-current animate-pulse-love" />
        </div>
        <p className="text-lg text-muted-foreground">
          Answer a few questions for me... 💕
        </p>
      </div>

      {/* Love Meter */}
      <div className="w-full max-w-xs mb-8 relative z-10">
        <LoveMeter value={loveMeterValue} />
      </div>

      {/* Question Card */}
      <div className="w-full relative z-10">
        {currentQuestion < questions.length ? (
          <QuestionCard
            question={questions[currentQuestion]}
            onAnswer={handleAnswer}
            questionNumber={currentQuestion + 1}
            totalQuestions={questions.length}
          />
        ) : (
          <div className="text-center">
            <p className="text-xl text-muted-foreground">
              Processing your love... 💕
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
