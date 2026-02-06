import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Sparkles } from "lucide-react";

interface Question {
  id: number;
  text: string;
  yesText: string;
  maybeText: string;
  noText: string;
}

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: "yes" | "maybe" | "no") => void;
  questionNumber: number;
  totalQuestions: number;
}

export const QuestionCard = ({
  question,
  onAnswer,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shakeNo, setShakeNo] = useState(false);

  const handleAnswer = (answer: "yes" | "maybe" | "no") => {
    if (answer === "no") {
      setShakeNo(true);
      setTimeout(() => setShakeNo(false), 500);
      return;
    }
    
    setIsAnimating(true);
    setTimeout(() => {
      onAnswer(answer);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <Card 
      className={`w-full max-w-lg mx-auto bg-card/90 backdrop-blur-sm shadow-xl border-2 border-valentine-rose overflow-hidden transition-all duration-300 ${
        isAnimating ? "animate-bounce-in" : ""
      }`}
    >
      <div className="bg-gradient-to-r from-valentine-pink to-valentine-red p-4">
        <div className="flex items-center justify-center gap-2">
          <Heart className="w-5 h-5 text-primary-foreground fill-current" />
          <span className="text-primary-foreground font-medium">
            Question {questionNumber} of {totalQuestions}
          </span>
          <Heart className="w-5 h-5 text-primary-foreground fill-current" />
        </div>
      </div>
      
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <Sparkles className="w-8 h-8 mx-auto mb-4 text-valentine-pink animate-sparkle" />
          <h2 className="text-2xl md:text-3xl font-romantic text-foreground leading-relaxed">
            {question.text}
          </h2>
        </div>

        <div className={`flex flex-col gap-4 ${shakeNo ? "animate-shake-no" : ""}`}>
          <Button
            variant="yes"
            size="xl"
            onClick={() => handleAnswer("yes")}
            className="w-full animate-wiggle"
          >
            {question.yesText}
          </Button>
          
          <Button
            variant="maybe"
            size="lg"
            onClick={() => handleAnswer("maybe")}
            className="w-full"
          >
            {question.maybeText}
          </Button>
          
          <Button
            variant="no"
            size="lg"
            onClick={() => handleAnswer("no")}
            className="w-full text-sm"
          >
            {question.noText}
          </Button>
        </div>

        {shakeNo && (
          <p className="text-center mt-4 text-valentine-red font-medium animate-bounce-in">
            Nice try! But that button doesn't work 😘
          </p>
        )}
      </CardContent>
    </Card>
  );
};
