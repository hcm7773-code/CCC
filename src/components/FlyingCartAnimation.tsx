import React, { useEffect, useState } from 'react';

export interface FlyingParticle {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  image?: string;
  startTime: number;
}

interface FlyingCartAnimationProps {
  particles: FlyingParticle[];
  onParticleComplete: (id: string) => void;
}

export const FlyingCartAnimation: React.FC<FlyingCartAnimationProps> = ({
  particles,
  onParticleComplete,
}) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (particles.length === 0) return;

    let frameId: number;
    const animate = () => {
      setTick((t) => t + 1);

      const now = Date.now();
      particles.forEach((p) => {
        if (now - p.startTime >= 750) {
          onParticleComplete(p.id);
        }
      });

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [particles, onParticleComplete]);

  const now = Date.now();

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => {
        const elapsed = now - p.startTime;
        const progress = Math.min(1, Math.max(0, elapsed / 700));

        // Ease out quadratic
        const easeProgress = 1 - Math.pow(1 - progress, 2);

        // Parabolic arc (curves upwards)
        const currentX = p.startX + (p.endX - p.startX) * easeProgress;
        const arcHeight = Math.min(180, Math.abs(p.startX - p.endX) * 0.4 + 80);
        const currentY =
          p.startY + (p.endY - p.startY) * easeProgress - arcHeight * Math.sin(progress * Math.PI);

        const scale = 1 - progress * 0.5;
        const rotation = progress * 720; // Spins twice on fly

        return (
          <div
            key={p.id}
            style={{
              transform: `translate3d(${currentX - 20}px, ${currentY - 20}px, 0) scale(${scale}) rotate(${rotation}deg)`,
              opacity: progress > 0.85 ? (1 - progress) / 0.15 : 1,
            }}
            className="absolute top-0 left-0 w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 p-0.5 shadow-[0_0_20px_rgba(245,158,11,0.8)] flex items-center justify-center transition-opacity"
          >
            {p.image ? (
              <img
                src={p.image}
                alt="flying dish"
                className="w-full h-full object-cover rounded-full border border-white/80"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-amber-400 flex items-center justify-center text-amber-950 font-black text-xs">
                🍔
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
