import { useEffect, useState, useRef } from 'react';

export default function ReadinessScore({ score, size = 120, strokeWidth = 8, showLabel = true }) {
  const [displayScore, setDisplayScore] = useState(score);
  const [glowing, setGlowing] = useState(false);
  const prevScore = useRef(score);

  useEffect(() => {
    if (prevScore.current === score) {
      setDisplayScore(score);
      return;
    }

    setGlowing(true);
    const start = prevScore.current;
    const startTime = performance.now();
    const duration = 600;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayScore(Math.round(start + (score - start) * eased));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => setGlowing(false), 500);
      }
    };

    requestAnimationFrame(animate);
    prevScore.current = score;
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (displayScore / 100) * circumference;

  const getColor = () => {
    if (displayScore >= 90) return '#16a34a';
    if (displayScore >= 75) return '#c6993e';
    if (displayScore >= 60) return '#d97706';
    return '#dc2626';
  };

  const getLabel = () => {
    if (score >= 90) return 'Ready';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Needs Work';
    return 'At Risk';
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg
        width={size}
        height={size}
        className={`transition-all duration-300 ${glowing ? 'animate-score-glow' : ''}`}
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dasharray 0.6s ease-out, stroke 0.3s ease' }}
        />
        {/* Score number */}
        <text
          x={size / 2}
          y={size / 2 - 2}
          textAnchor="middle"
          dominantBaseline="central"
          className="font-sans font-bold"
          style={{ fontSize: size * 0.28, fill: '#0f172a' }}
        >
          {displayScore}
        </text>
        {/* /100 label */}
        <text
          x={size / 2}
          y={size / 2 + size * 0.16}
          textAnchor="middle"
          dominantBaseline="central"
          className="font-sans"
          style={{ fontSize: size * 0.11, fill: '#64748b' }}
        >
          / 100
        </text>
      </svg>
      {showLabel && (
        <span
          className="text-xs font-semibold tracking-wide uppercase"
          style={{ color: getColor() }}
        >
          {getLabel()}
        </span>
      )}
    </div>
  );
}
