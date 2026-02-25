import confetti from "canvas-confetti";

export function makeShot(particleRatio: number, opts: confetti.Options) {
  confetti({
    ...opts,

    particleCount: Math.floor(500 * particleRatio),
  });
}

export function fire() {
  const ang = Math.atan((innerHeight * 2) / innerWidth) * (180 / Math.PI);
  const dist = Math.hypot(innerWidth * 0.5, innerHeight);

  makeShot(0.5, {
    spread: 75,
    origin: { x: 1, y: 1 },
    startVelocity: 0.08 * dist,
    angle: 180 - ang,
  });
  makeShot(0.5, {
    spread: 75,
    origin: { x: 0, y: 1 },
    startVelocity: 0.08 * dist,
    angle: ang,
  });
}
