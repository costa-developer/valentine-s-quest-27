import { Heart, PartyPopper, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Confetti } from "./Confetti";
import { LoveMeter } from "./LoveMeter";

interface SuccessScreenProps {
  loveMeterValue: number;
  onReset: () => void;
  onViewDashboard: () => void;
}

export const SuccessScreen = ({ loveMeterValue, onReset, onViewDashboard }: SuccessScreenProps) => {
  return (
    <>
      <Confetti />
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-card/95 backdrop-blur-sm shadow-2xl border-2 border-valentine-rose animate-bounce-in">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <PartyPopper className="w-16 h-16 mx-auto text-valentine-pink animate-wiggle" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-romantic text-valentine-red mb-4">
              She Said Yes! 💕
            </h1>
            
            <div className="flex justify-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Heart
                  key={i}
                  className="w-8 h-8 text-valentine-pink fill-valentine-pink animate-pulse-love"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>

            <p className="text-lg text-muted-foreground mb-8">
              Get ready for the most romantic Valentine's Day ever! 
              <Sparkles className="inline w-5 h-5 ml-1 text-valentine-pink" />
            </p>

            <div className="mb-8">
              <LoveMeter value={loveMeterValue} />
            </div>

            <div className="flex flex-col gap-3">
              <Button variant="valentine" size="lg" onClick={onViewDashboard} className="w-full">
                <Heart className="w-5 h-5 mr-2" />
                View Love Dashboard
              </Button>
              <Button variant="reset" size="default" onClick={onReset} className="w-full">
                Ask Again 💌
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
