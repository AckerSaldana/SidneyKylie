import React, { useRef, useEffect } from "react";

const ClickSpark = ({ children }) => {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);

  // Configuration
  const sparkColor = "#74C5FF";
  const sparkSize = 12;
  const sparkRadius = 30;
  const sparkCount = 12;
  const duration = 800;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const easeOut = (t) => {
    return t * (2 - t);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationId = null;

    const draw = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) {
          return false;
        }

        const progress = elapsed / duration;
        const eased = easeOut(progress);

        const distance = eased * sparkRadius;
        const lineLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.save();
        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        ctx.globalAlpha = (1 - eased) * 0.8;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();

        return true;
      });

      if (sparksRef.current.length > 0) {
        animationId = requestAnimationFrame(draw);
      } else {
        animationId = null;
      }
    };

    const handleClick = (e) => {
      const now = performance.now();
      const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
        x: e.clientX,
        y: e.clientY,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now,
      }));

      sparksRef.current.push(...newSparks);
      
      if (!animationId) {
        animationId = requestAnimationFrame(draw);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9999
        }}
      />
      {children}
    </>
  );
};

export default ClickSpark;