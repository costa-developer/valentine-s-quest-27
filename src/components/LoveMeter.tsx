import { Heart } from "lucide-react";

interface LoveMeterProps {
  value: number; // 0-100
}

export const LoveMeter = ({ value }: LoveMeterProps) => {
  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">Love Meter</span>
        <Heart 
          className={`w-5 h-5 text-valentine-red fill-valentine-red ${value > 50 ? 'animate-pulse-love' : ''}`} 
        />
      </div>
      <div className="h-4 bg-valentine-rose rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-valentine-pink to-valentine-red transition-all duration-700 ease-out rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="text-center mt-2 text-sm font-medium text-valentine-red">
        {value}% Love ❤️
      </p>
    </div>
  );
};
