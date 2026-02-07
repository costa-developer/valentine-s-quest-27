import { Heart, PartyPopper, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Confetti } from "./Confetti";
import { LoveMeter } from "./LoveMeter";

interface SuccessScreenProps {
  loveMeterValue: number;
}

export const SuccessScreen = ({ loveMeterValue }: SuccessScreenProps) => {
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
              You Said Yes! 💕
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

            <div className="mb-4">
              <LoveMeter value={loveMeterValue} />
            </div>

            <p className="text-valentine-red font-romantic text-2xl mt-6">
              I love you! 💕
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};