import React, { useEffect, useRef } from 'react';

interface FeatherParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  life: number;
  maxLife: number;
  swaySpeed: number;
  swayOffset: number;
}

export const FeatherCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef({ x: -100, y: -100, lastX: -100, lastY: -100 });
  const particles = useRef<FeatherParticle[]>([]);
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Draw an authentic, delicate TERRACOTTA BROWN feather matching the top bar
    const drawBrownFeather = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      opacity: number
    ) => {
      c.save();
      c.translate(x, y);
      c.rotate(rotation);
      c.globalAlpha = Math.max(0, Math.min(1, opacity));

      // Feather subtle ambient glow/drop shadow
      c.shadowColor = 'rgba(166, 91, 46, 0.2)';
      c.shadowBlur = 4;
      c.shadowOffsetX = 1;
      c.shadowOffsetY = 2;

      // Central Quill / Shaft (Deep Terracotta Brown)
      c.beginPath();
      c.moveTo(0, -size);
      c.quadraticCurveTo(size * 0.08, 0, 0, size);
      c.strokeStyle = `rgba(166, 91, 46, ${opacity * 0.95})`;
      c.lineWidth = 1.3;
      c.stroke();

      // Left Vane (Warm Terracotta Brown Translucent)
      c.beginPath();
      c.moveTo(0, -size);
      c.bezierCurveTo(-size * 0.42, -size * 0.45, -size * 0.38, size * 0.4, 0, size);
      c.fillStyle = `rgba(181, 114, 72, ${opacity * 0.65})`;
      c.fill();
      c.strokeStyle = `rgba(166, 91, 46, ${opacity * 0.6})`;
      c.lineWidth = 0.6;
      c.stroke();

      // Right Vane (Warm Camel Tan Translucent)
      c.beginPath();
      c.moveTo(0, -size);
      c.bezierCurveTo(size * 0.35, -size * 0.4, size * 0.3, size * 0.35, 0, size);
      c.fillStyle = `rgba(202, 137, 96, ${opacity * 0.6})`;
      c.fill();
      c.strokeStyle = `rgba(166, 91, 46, ${opacity * 0.6})`;
      c.lineWidth = 0.6;
      c.stroke();

      // Delicate fine brown barbules
      for (let i = -0.7; i < 0.8; i += 0.3) {
        c.beginPath();
        const startY = i * size;
        c.moveTo(0, startY);
        c.lineTo(-size * 0.32, startY + size * 0.12);
        c.strokeStyle = `rgba(166, 91, 46, ${opacity * 0.7})`;
        c.lineWidth = 0.6;
        c.stroke();

        c.beginPath();
        c.moveTo(0, startY);
        c.lineTo(size * 0.25, startY + size * 0.12);
        c.strokeStyle = `rgba(181, 114, 72, ${opacity * 0.7})`;
        c.lineWidth = 0.6;
        c.stroke();
      }

      c.restore();
    };

    const onMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      const dx = x - mousePos.current.lastX;
      const dy = y - mousePos.current.lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      mousePos.current.x = x;
      mousePos.current.y = y;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${x - 80}px, ${y - 80}px, 0)`;
      }

      // Spawn very few delicate brown feathers matching top bar (max 8)
      if (speed > 13 && particles.current.length < 8 && Math.random() < 0.35) {
        particles.current.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 0.8 - dx * 0.04,
          vy: Math.random() * 0.5 + 0.35, // Slow gentle drift
          size: Math.random() * 8 + 14,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.025,
          opacity: 0.9,
          life: 0,
          maxLife: Math.random() * 30 + 55,
          swaySpeed: Math.random() * 0.04 + 0.02,
          swayOffset: Math.random() * Math.PI * 2,
        });
      }

      mousePos.current.lastX = x;
      mousePos.current.lastY = y;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.life++;

        p.x += p.vx + Math.sin(p.life * p.swaySpeed + p.swayOffset) * 0.7;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity = 0.9 * (1 - p.life / p.maxLife);

        drawBrownFeather(ctx, p.x, p.y, p.size, p.rotation, p.opacity);

        if (p.life >= p.maxLife || p.opacity <= 0) {
          particles.current.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Soft Brown Ambient Glow Follower */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-[160px] h-[160px] rounded-full pointer-events-none z-[9998] transition-opacity duration-300 opacity-30 mix-blend-multiply"
        style={{
          background: 'radial-gradient(circle, rgba(166, 91, 46, 0.25) 0%, rgba(181, 114, 72, 0.1) 50%, transparent 70%)',
          willChange: 'transform',
        }}
      />

      {/* Floating Canvas Terracotta Brown Feathers */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9999]"
      />
    </>
  );
};
