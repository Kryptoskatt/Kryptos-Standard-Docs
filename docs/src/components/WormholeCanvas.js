import { useEffect, useRef } from "react";

export default function WormholeCanvas() {
  const canvasRef = useRef(null);
  const animationRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        width = rect.width;
        height = rect.height;
        canvas.width = width;
        canvas.height = height;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const portalX = () => width * 0.5;
    const portalY = () => height * 0.5;
    const portalRadius = () => Math.min(width, height) * 0.38;

    // Initialize nodes
    const nodes = [];
    for (let i = 0; i < 50; i++) {
      nodes.push({
        x: Math.random() * (width || 800),
        y: Math.random() * (height || 600),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.2,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Portal particles
    const particles = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        angle: (Math.PI * 2 * i) / 80,
        radius: (portalRadius() || 100) * (0.5 + Math.random() * 0.8),
        speed: 0.005 + Math.random() * 0.01,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.6 + 0.2,
      });
    }

    const primaryColor = { r: 16, g: 185, b: 129 }; // Kryptos emerald
    const secondaryColor = { r: 52, g: 211, b: 153 };

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.016;

      const px = portalX();
      const py = portalY();
      const pr = portalRadius();

      // Draw portal glow
      const portalGlow = ctx.createRadialGradient(px, py, 0, px, py, pr * 1.5);
      const glowPulse = 0.08 + Math.sin(time * 2) * 0.03;
      portalGlow.addColorStop(0, `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${glowPulse})`);
      portalGlow.addColorStop(0.5, `rgba(${secondaryColor.r}, ${secondaryColor.g}, ${secondaryColor.b}, ${glowPulse * 0.5})`);
      portalGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.beginPath();
      ctx.fillStyle = portalGlow;
      ctx.arc(px, py, pr * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Draw portal particles
      particles.forEach((p) => {
        p.angle += p.speed;
        const x = px + Math.cos(p.angle) * p.radius;
        const y = py + Math.sin(p.angle) * p.radius;

        const particleGlow = ctx.createRadialGradient(x, y, 0, x, y, p.size * 3);
        particleGlow.addColorStop(0, `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${p.opacity})`);
        particleGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.beginPath();
        ctx.fillStyle = particleGlow;
        ctx.arc(x, y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.arc(x, y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connection nodes
      const connectionDistance = 150;
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        node.x = Math.max(0, Math.min(width, node.x));
        node.y = Math.max(0, Math.min(height, node.y));

        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        const pulse = Math.sin(time * 2 + node.pulsePhase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${node.opacity * pulse})`;
        ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.7,
      }}
    />
  );
}
