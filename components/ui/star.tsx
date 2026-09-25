// 8-point star: 4 long cardinal spikes, 4 short diagonal ones.
const STAR_POINTS = Array.from({ length: 16 }, (_, k) => {
  const angle = ((-90 + k * 22.5) * Math.PI) / 180;
  const radius = k % 2 === 1 ? 7 : k % 4 === 0 ? 50 : 26;
  return `${(radius * Math.cos(angle)).toFixed(2)},${(radius * Math.sin(angle)).toFixed(2)}`;
}).join(" ");

export function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="-50 -50 100 100" className={className} fill="currentColor" aria-hidden>
      <polygon points={STAR_POINTS} />
    </svg>
  );
}
