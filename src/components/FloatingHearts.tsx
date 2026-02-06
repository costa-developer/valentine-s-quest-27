import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

interface FloatingHeart {
  id: number;
  left: number;
  delay: number;
  size: number;
  duration: number;
}

export const FloatingHearts = () => {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    const createHeart = () => {
      const newHeart: FloatingHeart = {
        id: Date.now() + Math.random(),
        left: Math.random() * 100,
        delay: Math.random() * 2,
        size: Math.random() * 20 + 12,
        duration: Math.random() * 3 + 3,
      };
      setHearts((prev) => [...prev, newHeart]);

      // Remove heart after animation
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, (newHeart.duration + newHeart.delay) * 1000);
    };

    // Create initial hearts
    for (let i = 0; i < 5; i++) {
      setTimeout(createHeart, i * 500);
    }

    // Continue creating hearts
    const interval = setInterval(createHeart, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <Heart
          key={heart.id}
          className="absolute bottom-0 text-valentine-pink fill-valentine-pink opacity-60"
          style={{
            left: `${heart.left}%`,
            width: heart.size,
            height: heart.size,
            animation: `float-up ${heart.duration}s ease-out ${heart.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
};
