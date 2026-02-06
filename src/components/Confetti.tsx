import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  left: number;
  color: string;
  delay: number;
  rotation: number;
}

export const Confetti = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const colors = [
      "hsl(350, 100%, 70%)",
      "hsl(340, 100%, 65%)",
      "hsl(350, 80%, 55%)",
      "hsl(40, 100%, 70%)",
      "hsl(0, 0%, 100%)",
    ];

    const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      rotation: Math.random() * 360,
    }));

    setPieces(newPieces);

    // Clear after animation
    const timer = setTimeout(() => setPieces([]), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute top-0"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            width: "10px",
            height: "10px",
            borderRadius: piece.id % 2 === 0 ? "50%" : "2px",
            transform: `rotate(${piece.rotation}deg)`,
            animation: `float-up 3s ease-out ${piece.delay}s reverse forwards`,
          }}
        />
      ))}
    </div>
  );
};
