"use client";

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";

/**
 * A stretch of sea with hamsi (Black Sea anchovies) behind the page. Every movement is a
 * CSS transition or keyframe: script only picks a new target for a fish every
 * few seconds and writes it to CSS variables, so nothing renders per frame.
 * Tapping the water drops food that floats on the surface; the nearest hamsi
 * rise, race for it and dive back down.
 *
 * Deliberately not gated on prefers-reduced-motion: the drift is slow, small
 * and never flashes, and the pond is the page's whole point.
 */

/**
 * A hamsi seen from above, head to the right: a dark slate spindle with a
 * forked tail, two side fins and a pale glint along the back. Drawn at 70×16
 * and scaled into the 120×48 fish box, so the snout sits 56 units ahead of
 * the centre.
 */
function Hamsi() {
  const id = useId();
  return (
    <svg viewBox="0 0 70 16" className="hamsi-body" fill="none" aria-hidden>
      <defs>
        <linearGradient id={`${id}-body`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="45%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>
      {/* Forked tail */}
      <path className="hamsi-tail" d="M12 8 L2 3 C4 6 5 8 5 8 C5 8 4 10 2 13 Z" fill="#334155" opacity="0.8" />
      {/* Side fins */}
      <path className="hamsi-fin hamsi-fin-l" d="M42 6 C37 3 34 2 33 3 C34 5 36 6 39 7 Z" fill="#64748b" opacity="0.6" />
      <path className="hamsi-fin hamsi-fin-r" d="M42 10 C37 13 34 14 33 13 C34 11 36 10 39 9 Z" fill="#64748b" opacity="0.6" />
      {/* Body */}
      <path d="M68 8 C60 5.2 44 4.5 28 6.5 C18 7.5 12 8 10 8 C12 8 18 8.5 28 9.5 C44 11.5 60 10.8 68 8 Z" fill={`url(#${id}-body)`} />
      {/* Glint along the back */}
      <path d="M62 8 C52 7 35 6.5 22 7.8" stroke="#94a3b8" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

/**
 * A shark seen from above, head to the right: broad pectoral fins, a strong
 * tail, gill slits and the line of the dorsal fin. Drawn at 100×36 into a
 * 240×86 box.
 */
function Shark() {
  const id = useId();
  return (
    <svg viewBox="0 0 100 36" className="shark-body" fill="none" aria-hidden>
      <defs>
        <linearGradient id={`${id}-body`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0b1329" />
          <stop offset="45%" stopColor="#1c2541" />
          <stop offset="100%" stopColor="#3a506b" />
        </linearGradient>
      </defs>
      {/* Fins and tail are lighter than the body, with a pale edge, so they read on dark water. */}
      <g stroke="#7d93b2" strokeWidth="0.5" strokeLinejoin="round">
        {/* Small rear fins */}
        <path d="M28 14 C24 12 21 12 20 13 C21 15 22 15 24 15 Z" fill="#3f5675" />
        <path d="M28 22 C24 24 21 24 20 23 C21 21 22 21 24 21 Z" fill="#3f5675" />
        {/* Tail */}
        <path className="shark-tail" d="M14 18 L2 5 C5 12 7 17 7 18 C7 19 5 24 2 31 L14 18 Z" fill="#3f5675" />
        {/* Pectoral fins, the shark's signature from above */}
        <path className="shark-fin shark-fin-l" d="M56 12 C44 2 37 -1 35 1 C38 6 42 12 46 15 Z" fill="#4a6385" />
        <path className="shark-fin shark-fin-r" d="M56 24 C44 34 37 37 35 35 C38 30 42 24 46 21 Z" fill="#4a6385" />
      </g>
      {/* Body */}
      <path
        d="M96 18 C82 11 65 9 40 13 C24 15 15 17.5 11 18 C15 18.5 24 21 40 23 C65 27 82 25 96 18 Z"
        fill={`url(#${id}-body)`}
        stroke="#6b84a3"
        strokeWidth="0.5"
      />
      {/* Dorsal fin seen from above */}
      <path d="M58 18 C46 16.5 35 17 31 18 C35 19 46 19.5 58 18 Z" fill="#0b1329" opacity="0.6" />
      {/* Gill slits: pale, so they stand out against the head's own colour. */}
      <path d="M72 14 C70.5 15 70.5 21 72 22 M75 14.5 C73.5 15.5 73.5 20.5 75 21.5 M78 15 C76.5 16 76.5 20 78 21" stroke="#c3d0e0" strokeWidth="0.9" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

/**
 * A crab seen from above, claws forward. On the sea floor it is turned so its
 * claws point up the screen and it walks sideways, as crabs do.
 */
function Crab() {
  const id = useId();
  return (
    <svg viewBox="0 0 84 64" className="crab-body" fill="none" aria-hidden>
      <defs>
        <linearGradient id={`${id}-shell`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="50%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>
      {/* Walking legs, one side and the other */}
      <g className="crab-legs crab-legs-a" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
        <path d="M44 20 Q40 8 30 5" />
        <path d="M38 22 Q32 10 20 10" />
        <path d="M32 25 Q24 14 12 18" />
      </g>
      <g className="crab-legs crab-legs-b" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
        <path d="M44 44 Q40 56 30 59" />
        <path d="M38 42 Q32 54 20 54" />
        <path d="M32 39 Q24 50 12 46" />
      </g>
      {/* Claws */}
      <path d="M48 24 C54 16 62 14 68 18" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <path d="M68 18 C72 13 78 14 80 17 C76 19 72 20 68 18 Z" fill="#334155" />
      <path d="M68 18 C73 18 78 21 78 22 C74 23 70 21 68 18 Z" fill="#1e293b" />
      <path d="M48 40 C54 48 62 50 68 46" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <path d="M68 46 C72 51 78 50 80 47 C76 45 72 44 68 46 Z" fill="#334155" />
      <path d="M68 46 C73 46 78 43 78 42 C74 41 70 43 68 46 Z" fill="#1e293b" />
      {/* Carapace */}
      <path d="M26 32 C26 21 34 18 45 18 C56 18 60 25 60 32 C60 39 56 46 45 46 C34 46 26 43 26 32 Z" fill={`url(#${id}-shell)`} />
      <path d="M34 32 Q45 28 52 32" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      <path d="M38 27 Q46 32 38 37" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      {/* Eyes */}
      <circle cx="58" cy="28" r="1.5" fill="#0f172a" />
      <circle cx="58.5" cy="28" r="0.6" fill="#94a3b8" />
      <circle cx="58" cy="36" r="1.5" fill="#0f172a" />
      <circle cx="58.5" cy="36" r="0.6" fill="#94a3b8" />
    </svg>
  );
}

/** A scallop shell lying on the sea floor. */
function Shell() {
  const id = useId();
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden>
      <defs>
        <linearGradient id={`${id}-shell`} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="50%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>
      {/* Hinge */}
      <path d="M19 51 H45 L42 45 H22 Z" fill="#0f172a" opacity="0.95" />
      {/* Fan */}
      <path
        d="M24 45 C16 38 10 27 12 21 C13 16 17 14 20 16 C22 12 27 9 32 9 C37 9 42 12 44 16 C47 14 51 16 52 21 C54 27 48 38 40 45 Z"
        fill={`url(#${id}-shell)`}
      />
      {/* Ribs */}
      <g stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" opacity="0.55">
        <path d="M32 45 L32 9.5" />
        <path d="M32 45 Q26 27 20.5 15.5" />
        <path d="M32 45 Q38 27 43.5 15.5" />
        <path d="M32 45 Q19 31 12.5 21" />
        <path d="M32 45 Q45 31 51.5 21" />
      </g>
      {/* Growth rings */}
      <path d="M18 28 Q32 35 46 28" stroke="#94a3b8" strokeWidth="0.9" strokeLinecap="round" opacity="0.35" />
      <path d="M22 37 Q32 42 42 37" stroke="#94a3b8" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

const MAX_SHELLS = 5;

/** `count` spots across the floor, in %, at least `gap` apart. */
function scatter(count: number, gap: number) {
  const spots: number[] = [];
  for (let tries = 0; spots.length < count && tries < 200; tries++) {
    const at = 4 + Math.random() * 92;
    if (spots.every((s) => Math.abs(s - at) >= gap)) spots.push(at);
  }
  return spots;
}

/**
 * The sea floor: shells lying about and a crab that scuttles between them,
 * laid out at random on every visit. The layout is picked after mount, so
 * server and client render the same markup; until then the floor is empty.
 */
function SeaFloor() {
  const floor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = floor.current;
    if (!el) return;
    const shells = el.querySelectorAll<HTMLElement>(".shell");
    const count = 3 + Math.floor(Math.random() * (MAX_SHELLS - 2));
    const spots = scatter(count, 9);
    shells.forEach((shell, n) => {
      const at = spots[n];
      if (at === undefined) {
        shell.hidden = true;
        return;
      }
      const size = 22 + Math.random() * 20;
      shell.hidden = false;
      shell.style.left = `${at}%`;
      shell.style.width = shell.style.height = `${size}px`;
      shell.style.bottom = `${6 + Math.random() * 16}px`;
      shell.style.rotate = `${-30 + Math.random() * 60}deg`;
    });
    // Four stops for the crab's walk, in vw, starting from a random one.
    scatter(4, 12).forEach((stop, n) => el.style.setProperty(`--c${n}`, `${stop * 0.92}vw`));
    el.style.setProperty("--crab-start", `${-Math.random() * 64}s`);
    el.setAttribute("data-placed", "");
  }, []);

  return (
    <div ref={floor} className="pond-floor">
      {Array.from({ length: MAX_SHELLS }, (_, n) => (
        <span key={n} className="shell" hidden>
          <Shell />
        </span>
      ))}
      <span className="crab">
        <Crab />
      </span>
    </div>
  );
}

/**
 * Seaweed along the bottom: clumps of blades, each a tapering ribbon that
 * sways from its root. Positions and timings are fixed so server and client
 * render the same thing.
 */
const clumps = [
  { left: 3, blades: [150, 110, 180] },
  { left: 14, blades: [90, 130] },
  { left: 27, blades: [120, 170, 100] },
  { left: 43, blades: [80, 115] },
  { left: 58, blades: [140, 190, 110] },
  { left: 72, blades: [100, 75] },
  { left: 84, blades: [160, 120, 200] },
  { left: 95, blades: [110, 85] },
];

function Seaweed() {
  return (
    <div className="pond-weeds">
      {clumps.map((clump, c) =>
        clump.blades.map((height, b) => (
          <svg
            key={`${c}-${b}`}
            viewBox="0 0 20 100"
            preserveAspectRatio="none"
            className="weed"
            data-tone={(c + b) % 3}
            style={
              {
                left: `calc(${clump.left}% + ${(b - 1) * 14}px)`,
                height,
                width: 18 + ((c + b) % 3) * 6,
                "--sway": `${5.5 + ((c * 3 + b) % 5) * 0.9}s`,
                "--delay": `${-((c * 7 + b * 3) % 10) * 0.6}s`,
              } as CSSProperties
            }
          >
            <path d="M10 100 C4 82 15 66 8 47 C3 30 13 16 10 0 C15 15 8 30 13 47 C18 66 7 82 12 100 Z" />
          </svg>
        )),
      )}
    </div>
  );
}

interface Fish {
  x: number;
  y: number;
  /** Heading in degrees, unwrapped so a turn never spins the long way round. */
  angle: number;
  /** Drawn scale; sets how far ahead of the centre the mouth sits. */
  scale: number;
  timer?: ReturnType<typeof setTimeout>;
  chasing?: number;
  /** Until when a fish fleeing the shark ignores further alarms. */
  fleeUntil?: number;
  /** Second leg of a banked turn. */
  leg?: ReturnType<typeof setTimeout>;
}

interface Point {
  x: number;
  y: number;
}

interface Pellet {
  id: number;
  x: number;
  y: number;
  /** Just eaten: shows a splash for a moment before it goes. */
  eaten?: boolean;
}

// Hamsi swim in schools: many small fish at an unhurried pace.
const FISH = 16;
const PHONE_FISH = 12;
const SIZES = [0.62, 0.55, 0.7, 0.5, 0.66, 0.58, 0.52, 0.68];
const WANDER_SPEED = 24; // px per second
const CHASE_SPEED = 90;
const MARGIN = 40;
// Turns sharper than this (degrees) are banked through a short arc.
const BANK_FROM = 70;
// Snout tip to the box centre in px at scale 1 (tip at 68 of 70, drawn 120 wide).
const MOUTH = 56;
// How much bigger a fish draws at the surface than at scale 1; matches pond.css.
const SURFACE = 1.12;
// Uneaten food sinks out of reach after this long, counted from landing.
const SINK_MS = 14000;

// A feeding frenzy draws a shark: it wanders through the food, eating what lies
// on its path, and the hamsi it heads for scatter. It needs a burst of taps
// first (FRENZY_TAPS within FRENZY_WINDOW); then any one of the rest starts a
// frenzy, checked on every drop and once a second.
const FRENZY_TAPS = 3;
const FRENZY_DROPS = 9; // pellets dropped within FRENZY_WINDOW, eaten or not
const FRENZY_WINDOW = 6000;
const FRENZY_FLOATING = 6; // pellets in the water at once
const FRENZY_CROWD = 7; // hamsi bunched around one pellet
const CROWD_RADIUS = 160;
const SHARK_SPEED = 260;
const SHARK_MOUTH = 110; // snout tip to centre in px (tip at 96 of 100, drawn 240 wide)
const SHARK_REACH = 70; // how far either side of its path it snaps up food
const SHARK_REST = 3000; // quiet time after it leaves
const FLEE_SPEED = 200;
// Hamsi bolt as soon as the shark is in sight if they are in the lane ahead of
// it (SIGHT long, LANE either side), or if it comes within CLOSE.
const SIGHT = 650;
const LANE = 230;
const CLOSE = 260;

/**
 * Joins waypoints with a centripetal Catmull-Rom curve and samples it about
 * every `step` px, so something swimming it point to point follows a smooth
 * arc. The centripetal form never loops or kinks where a long leg meets a
 * short one, which the plain form does.
 */
function smooth(points: Point[], step: number): Point[] {
  const mirror = (a: Point, b: Point): Point => ({ x: 2 * a.x - b.x, y: 2 * a.y - b.y });
  const knot = (a: Point, b: Point) => Math.max(1e-3, Math.sqrt(Math.hypot(b.x - a.x, b.y - a.y)));
  const out: Point[] = [points[0]!];
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p0 = points[i - 1] ?? mirror(p1, p2);
    const p3 = points[i + 2] ?? mirror(p2, p1);
    const t1 = knot(p0, p1);
    const t2 = t1 + knot(p1, p2);
    const t3 = t2 + knot(p2, p3);
    const lerp = (a: Point, b: Point, ta: number, tb: number, u: number): Point => ({
      x: ((tb - u) * a.x + (u - ta) * b.x) / (tb - ta),
      y: ((tb - u) * a.y + (u - ta) * b.y) / (tb - ta),
    });
    const steps = Math.max(2, Math.ceil(Math.hypot(p2.x - p1.x, p2.y - p1.y) / step));
    for (let n = 1; n <= steps; n++) {
      const u = t1 + ((t2 - t1) * n) / steps;
      const a1 = lerp(p0, p1, 0, t1, u);
      const a2 = lerp(p1, p2, t1, t2, u);
      const a3 = lerp(p2, p3, t2, t3, u);
      const b1 = lerp(a1, a2, 0, t2, u);
      const b2 = lerp(a2, a3, t1, t3, u);
      out.push(lerp(b1, b2, t1, t2, u));
    }
  }
  return out;
}

/** Distance from p to the segment a–b. */
function nearSegment(p: Point, a: Point, b: Point) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(p.x - (a.x + dx * t), p.y - (a.y + dy * t));
}

const random = (min: number, max: number) => min + Math.random() * (max - min);

export function HamsiPond() {
  const pondRef = useRef<HTMLDivElement>(null);
  const fishEls = useRef<(HTMLDivElement | null)[]>([]);
  const sharkRef = useRef<HTMLDivElement>(null);
  const [pellets, setPellets] = useState<Pellet[]>([]);

  useEffect(() => {
    const pond = pondRef.current;
    if (!pond) return;
    const bounds = () => pond.getBoundingClientRect();
    let nextId = 0;
    // Phones get smaller sea life, so the school isn't crowded into a narrow screen.
    const k = matchMedia("(max-width: 640px)").matches ? 0.8 : 1;
    pond.style.setProperty("--k", String(k));

    const { width, height } = bounds();
    const school = k < 1 ? PHONE_FISH : FISH;
    fishEls.current.forEach((el, i) => el?.toggleAttribute("hidden", i >= school));
    const fish: Fish[] = Array.from({ length: school }, (_, i) => ({
      x: random(MARGIN, width - MARGIN),
      y: random(MARGIN, height - MARGIN),
      angle: random(0, 360),
      scale: SIZES[i % SIZES.length]! * k,
    }));

    /**
     * Where a fish is right now, mid-transition. `f.x`/`f.y` hold where it is
     * headed, which for a fish racing to far-off food is nowhere near it.
     */
    function where(i: number) {
      const f = fish[i]!;
      const el = fishEls.current[i];
      if (!el) return { x: f.x, y: f.y };
      const [tx, ty] = getComputedStyle(el).translate.split(" ").map(parseFloat);
      return Number.isFinite(tx) ? { x: tx!, y: Number.isFinite(ty) ? ty! : 0 } : { x: f.x, y: f.y };
    }

    /**
     * Sends a fish to (x, y) and returns how long the swim takes in ms. With
     * `mouth`, it stops with its snout on that point instead of its middle.
     * A sharp turn is banked: a short arc between the old heading and the new
     * one first, so the fish curves round instead of pivoting on the spot.
     */
    function swim(i: number, x: number, y: number, speed: number, mouth = false) {
      const f = fish[i];
      if (!f || !fishEls.current[i]) return 0;
      clearTimeout(f.leg);

      // Start from wherever the fish is mid-transition, not where it was headed.
      const from = where(i);
      const heading = Math.atan2(y - from.y, x - from.x);
      if (mouth) {
        // Chasing fish swim at the surface, drawn larger, so the snout reaches further.
        x -= Math.cos(heading) * MOUTH * f.scale * SURFACE;
        y -= Math.sin(heading) * MOUTH * f.scale * SURFACE;
      }
      const turn = (((heading * 180) / Math.PI - (f.angle % 360) + 540) % 360) - 180;
      const dist = Math.hypot(x - from.x, y - from.y);
      if (Math.abs(turn) < BANK_FROM || dist < 90) return move(i, from, x, y, speed);

      const bank = ((f.angle + turn / 2) * Math.PI) / 180;
      const reach = Math.min(dist * 0.35, 55);
      const mid = { x: from.x + Math.cos(bank) * reach, y: from.y + Math.sin(bank) * reach };
      // Head on before the arc quite ends, so the two legs blend into one curve.
      const lead = move(i, from, mid.x, mid.y, speed) * 0.8;
      f.leg = setTimeout(() => move(i, where(i), x, y, speed), lead);
      return lead + Math.max(600, (Math.hypot(x - mid.x, y - mid.y) / speed) * 1000);
    }

    /** One straight leg from `from` to (x, y); returns its duration in ms. */
    function move(i: number, from: Point, x: number, y: number, speed: number) {
      const f = fish[i]!;
      const el = fishEls.current[i];
      if (!el) return 0;
      const dx = x - from.x;
      const dy = y - from.y;
      const target = (Math.atan2(dy, dx) * 180) / Math.PI;
      const delta = ((target - (f.angle % 360) + 540) % 360) - 180;
      f.angle += delta;
      f.x = x;
      f.y = y;

      const duration = Math.max(600, (Math.hypot(dx, dy) / speed) * 1000);
      el.style.setProperty("--x", `${x}px`);
      el.style.setProperty("--y", `${y}px`);
      el.style.setProperty("--a", `${f.angle}deg`);
      el.style.setProperty("--d", `${duration}ms`);
      return duration;
    }

    /** Pellets still in the water, so a fish can go on to the next one. */
    const pending = new Map<number, Pellet>();
    const timers = new Set<ReturnType<typeof setTimeout>>();

    function wander(i: number) {
      const f = fish[i];
      if (!f) return;
      // Back down to cruising depth.
      fishEls.current[i]?.removeAttribute("data-surface");
      const { width, height } = bounds();
      // Short legs that bend away from the current heading read as swimming, not teleporting.
      const heading = (f.angle * Math.PI) / 180 + random(-1.1, 1.1);
      const reach = random(70, 200);
      const x = Math.min(width - MARGIN, Math.max(MARGIN, f.x + Math.cos(heading) * reach));
      const y = Math.min(height - MARGIN, Math.max(MARGIN, f.y + Math.sin(heading) * reach));
      const duration = swim(i, x, y, WANDER_SPEED * random(0.75, 1.25));
      clearTimeout(f.timer);
      // Between legs, a fish that spots food nearby goes for it.
      f.timer = setTimeout(() => seek(i, 260) || wander(i), duration * random(0.75, 0.95));
    }

    function chase(i: number, p: Pellet, pace = 1) {
      const f = fish[i]!;
      f.chasing = p.id;
      clearTimeout(f.timer);
      // Rise toward the surface on the way to the food.
      fishEls.current[i]?.setAttribute("data-surface", "");
      const duration = swim(i, p.x, p.y, CHASE_SPEED * pace, true);
      f.timer = setTimeout(() => {
        if (f.chasing === p.id) eat(p.id, i);
      }, duration);
    }

    /** Sends a fish to the nearest pellet within `reach` that nobody is after yet. */
    function seek(i: number, reach: number) {
      // Nobody goes for food while the shark is about.
      if (shark.active) return false;
      const here = where(i);
      const claimed = new Set(fish.map((o) => o.chasing));
      let best: Pellet | undefined;
      let bestDist = reach;
      for (const p of pending.values()) {
        const dist = Math.hypot(here.x - p.x, here.y - p.y);
        if (!claimed.has(p.id) && dist < bestDist) {
          best = p;
          bestDist = dist;
        }
      }
      if (!best) return false;
      chase(i, best);
      return true;
    }

    function eat(pelletId: number, eater: number) {
      pending.delete(pelletId);
      setPellets((list) => list.map((p) => (p.id === pelletId ? { ...p, eaten: true } : p)));
      setTimeout(() => setPellets((list) => list.filter((p) => p.id !== pelletId)), 700);
      // Whoever else was after this pellet looks for another, or drifts off.
      fish.forEach((f, i) => {
        if (f.chasing !== pelletId) return;
        f.chasing = undefined;
        if (i !== eater && !seek(i, 320)) wander(i);
      });
      const el = fishEls.current[eater];
      if (el) {
        el.dataset.gulp = "true";
        setTimeout(() => delete el.dataset.gulp, 400);
      }
      // A short gulp, then on to the next pellet if one is near.
      const f = fish[eater]!;
      clearTimeout(f.timer);
      f.timer = setTimeout(() => seek(eater, 420) || wander(eater), 450);
    }

    /** Takes a pellet out of the water, with a splash if eaten, and frees anyone after it. */
    function remove(pelletId: number, splash: boolean) {
      if (!pending.delete(pelletId)) return false;
      if (splash) {
        setPellets((list) => list.map((p) => (p.id === pelletId ? { ...p, eaten: true } : p)));
        timers.add(setTimeout(() => setPellets((list) => list.filter((p) => p.id !== pelletId)), 700));
      } else {
        setPellets((list) => list.filter((p) => p.id !== pelletId));
      }
      fish.forEach((f, i) => {
        if (f.chasing !== pelletId) return;
        f.chasing = undefined;
        if (!seek(i, 320)) wander(i);
      });
      return true;
    }

    const shark: { active: boolean; restUntil: number; dir: Point; anim?: Animation; tailAnim?: Animation } = {
      active: false,
      restUntil: 0,
      dir: { x: 1, y: 0 },
    };
    /** When recent pellets landed and taps came, to spot a burst of feeding. */
    let landed: number[] = [];
    let taps: number[] = [];

    function frenzy() {
      if (shark.active || pending.size === 0 || Date.now() < shark.restUntil) return false;
      const now = Date.now();
      taps = taps.filter((t) => now - t < FRENZY_WINDOW);
      if (taps.length < FRENZY_TAPS) return false;
      landed = landed.filter((t) => now - t < FRENZY_WINDOW);
      if (landed.length >= FRENZY_DROPS || pending.size >= FRENZY_FLOATING) return true;
      // A crowd: many hamsi within reach of the same pellet.
      const spots = fish.map((_, i) => where(i));
      for (const p of pending.values()) {
        const near = spots.filter((s) => Math.hypot(s.x - p.x, s.y - p.y) < CROWD_RADIUS).length;
        if (near >= FRENZY_CROWD) return true;
      }
      return false;
    }

    /**
     * Sends the shark on a wandering pass through the food: in from beyond a
     * random edge, straight at the food, a turn or two onward, and out. The
     * waypoints are joined by a smooth curve, and the whole pass plays as one
     * Web Animation (position and heading at every point along it), so the
     * browser runs it at its own frame rate with no hitches between steps.
     * The tail bends against each turn the same way. A light tick eats the
     * food its snout passes and warns the hamsi in its path.
     */
    function summonShark() {
      const el = sharkRef.current;
      const tail = el?.querySelector<SVGPathElement>(".shark-tail");
      if (!el || !tail || pending.size === 0) return;
      shark.active = true;
      // This frenzy is spent; the next needs its own burst of feeding.
      landed = [];
      taps = [];
      const { width, height } = bounds();

      const food = [...pending.values()];
      const cx = food.reduce((sum, p) => sum + p.x, 0) / food.length;
      const cy = food.reduce((sum, p) => sum + p.y, 0) / food.length;
      const far = Math.hypot(width, height) / 2 + 200;
      const enter = random(0, Math.PI * 2);
      const route: Point[] = [{ x: width / 2 - Math.cos(enter) * far, y: height / 2 - Math.sin(enter) * far }];
      // Straight in at the food, lining up a short way before it so the long
      // approach and the short legs after it meet evenly. Then a turn or two
      // onward: each waypoint lies ahead of the last heading, bent at most
      // ~45°, so the curve sweeps in wide arcs and never doubles back.
      const target = { x: cx + random(-50, 50) * k, y: cy + random(-50, 50) * k };
      let course = Math.atan2(target.y - route[0]!.y, target.x - route[0]!.x);
      route.push({ x: target.x - Math.cos(course) * 260 * k, y: target.y - Math.sin(course) * 260 * k }, target);
      const turns = Math.random() < 0.5 ? 1 : 2;
      for (let t = 0; t < turns; t++) {
        course += random(-0.8, 0.8);
        const from = route[route.length - 1]!;
        const reach = random(220, 340) * k;
        route.push({ x: from.x + Math.cos(course) * reach, y: from.y + Math.sin(course) * reach });
      }
      // Leave roughly the way it was going, bent a little.
      course += random(-0.5, 0.5);
      const last = route[route.length - 1]!;
      route.push({ x: last.x + Math.cos(course) * far * 1.8, y: last.y + Math.sin(course) * far * 1.8 });

      const path = smooth(route, 40);
      const speed = SHARK_SPEED * random(0.9, 1.1);

      // Distance along the curve, and an unwrapped heading at every point.
      const along = [0];
      const angles: number[] = [];
      for (let n = 1; n < path.length; n++) {
        const a = path[n - 1]!;
        const b = path[n]!;
        along.push(along[n - 1]! + Math.hypot(b.x - a.x, b.y - a.y));
        const h = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
        const prev = angles[angles.length - 1];
        angles.push(prev === undefined ? h : prev + ((((h - (prev % 360)) % 360) + 540) % 360) - 180);
      }
      angles.unshift(angles[0]!);
      const total = along[along.length - 1]!;
      const duration = (total / speed) * 1000;
      const offsets = along.map((d) => d / total);

      // The tail swings out against the turn: how fast the heading changes
      // around each point, per 50 px, doubled and capped.
      const bends = angles.map((_, n) => {
        const lo = Math.max(0, n - 2);
        const hi = Math.min(angles.length - 1, n + 2);
        const span = along[hi]! - along[lo]! || 1;
        const rate = ((angles[hi]! - angles[lo]!) / span) * 50;
        return Math.max(-14, Math.min(14, -rate * 2));
      });

      shark.anim?.cancel();
      shark.tailAnim?.cancel();
      shark.anim = el.animate(
        path.map((p, n) => ({ translate: `${p.x}px ${p.y}px`, rotate: `${angles[n]}deg`, offset: offsets[n] })),
        { duration, easing: "linear", fill: "forwards" },
      );
      shark.tailAnim = tail.animate(
        bends.map((b, n) => ({ rotate: `${b}deg`, offset: offsets[n] })),
        { duration, easing: "linear", fill: "forwards" },
      );
      el.setAttribute("data-active", "");

      // Once its body is clear of the screen it is gone, as far as the hamsi know.
      const clear = 140 * k;
      const onScreen = (p: Point) => p.x > -clear && p.x < width + clear && p.y > -clear && p.y < height + clear;
      let lastOn = 0;
      path.forEach((p, n) => {
        if (onScreen(p)) lastOn = n;
      });
      const leaves = (along[Math.min(path.length - 1, lastOn + 1)]! / speed) * 1000;

      let prev: Point | null = null;
      const tick = setInterval(() => {
        const [sx = 0, sy = 0] = getComputedStyle(el).translate.split(" ").map(parseFloat);
        const pos = { x: sx, y: sy };
        if (prev) {
          const dx = pos.x - prev.x;
          const dy = pos.y - prev.y;
          const len = Math.hypot(dx, dy);
          if (len > 0.5) {
            shark.dir = { x: dx / len, y: dy / len };
            // Food its snout passed since the last tick.
            const reach = SHARK_MOUTH * k;
            const m0 = { x: prev.x + shark.dir.x * reach, y: prev.y + shark.dir.y * reach };
            const m1 = { x: pos.x + shark.dir.x * reach, y: pos.y + shark.dir.y * reach };
            for (const p of pending.values()) {
              if (nearSegment(p, m0, m1) > SHARK_REACH * k) continue;
              if (!remove(p.id, true)) continue;
              el.dataset.gulp = "true";
              timers.add(setTimeout(() => delete el.dataset.gulp, 300));
            }
          }
        }
        prev = pos;
        dodge(pos);
      }, 200);

      timers.add(
        setTimeout(() => {
          clearInterval(tick);
          shark.active = false;
          shark.restUntil = Date.now() + SHARK_REST;
          // Food dropped while it was about goes to the nearest free hamsi.
          for (const id of pending.keys()) handOff(id);
        }, leaves),
      );
      timers.add(setTimeout(() => el.removeAttribute("data-active"), duration));
    }

    /**
     * Hamsi in the shark's path bolt as soon as it is in sight: anything in a
     * lane ahead of it, or anything it gets close to. Those well beside or
     * behind it stay put.
     */
    function dodge(s: Point) {
      const { width, height } = bounds();
      if (s.x < -80 || s.x > width + 80 || s.y < -80 || s.y > height + 80) return;
      const now = Date.now();
      const dir = shark.dir;
      fish.forEach((f, i) => {
        if (now < (f.fleeUntil ?? 0)) return;
        const here = where(i);
        const dx = here.x - s.x;
        const dy = here.y - s.y;
        const dist = Math.hypot(dx, dy) || 1;
        const ahead = dx * dir.x + dy * dir.y;
        const aside = Math.abs(dx * dir.y - dy * dir.x);
        const inLane = ahead > 0 && ahead < SIGHT * k && aside < LANE * k;
        if (!inLane && dist > CLOSE * k) return;
        // Away from it and off its line, toward the side the fish is already on.
        const side = dx * dir.y - dy * dir.x >= 0 ? 1 : -1;
        let ux = (dx / dist) * 0.5 + dir.y * side * 0.85 + dir.x * 0.15;
        let uy = (dy / dist) * 0.5 - dir.x * side * 0.85 + dir.y * 0.15;
        const norm = Math.hypot(ux, uy) || 1;
        ux /= norm;
        uy /= norm;
        const push = random(220, 320) * k;
        const x = Math.min(width - MARGIN, Math.max(MARGIN, here.x + ux * push));
        const y = Math.min(height - MARGIN, Math.max(MARGIN, here.y + uy * push));
        f.chasing = undefined;
        clearTimeout(f.timer);
        fishEls.current[i]?.removeAttribute("data-surface");
        const fled = swim(i, x, y, FLEE_SPEED * random(0.9, 1.15));
        f.fleeUntil = now + fled * 0.6;
        f.timer = setTimeout(() => wander(i), fled + random(200, 700));
      });
    }

    /** Food nobody reached has sunk: it goes, and anyone after it looks elsewhere. */
    function sink(pelletId: number) {
      remove(pelletId, false);
    }

    /** Gives an abandoned pellet to the nearest fish that is not after anything. */
    function handOff(pelletId: number) {
      const p = pending.get(pelletId);
      if (!p || shark.active) return;
      let best = -1;
      let bestDist = Infinity;
      fish.forEach((f, i) => {
        if (f.chasing !== undefined) return;
        const here = where(i);
        const dist = Math.hypot(here.x - p.x, here.y - p.y);
        if (dist < bestDist) {
          best = i;
          bestDist = dist;
        }
      });
      if (best >= 0) chase(best, p);
    }

    function feed(clientX: number, clientY: number) {
      const rect = bounds();
      const drops: Pellet[] = Array.from({ length: 3 }, () => ({
        id: nextId++,
        x: clientX - rect.left + random(-18, 18),
        y: clientY - rect.top + random(-18, 18),
      }));
      drops.forEach((p) => {
        landed.push(Date.now());
        pending.set(p.id, p);
        timers.add(setTimeout(() => sink(p.id), SINK_MS + 500));
      });
      setPellets((list) => [...list, ...drops]);

      if (frenzy()) {
        summonShark();
        return;
      }
      if (shark.active) return;

      // The closest hamsi go for each pellet; arrival eats it. A fish already
      // racing for food switches when the new pellet is much closer, so food
      // dropped beside the school is never ignored for food far away.
      const spots = fish.map((_, i) => where(i));
      drops.forEach((p, n) => {
        fish
          .map((f, i) => {
            const here = spots[i]!;
            const dist = Math.hypot(here.x - p.x, here.y - p.y);
            const current = f.chasing === undefined ? undefined : pending.get(f.chasing);
            const free = !current || Math.hypot(here.x - current.x, here.y - current.y) > dist * 1.6;
            return { i, dist, free };
          })
          .filter((c) => c.free)
          .sort((a, b) => a.dist - b.dist)
          .slice(0, n === 0 ? 3 : 2)
          .forEach(({ i }, k) => {
            const left = fish[i]!.chasing;
            chase(i, p, k === 0 ? 1 : 0.85);
            // Food it gave up on goes to whoever is now closest and free.
            if (left !== undefined && pending.has(left) && !fish.some((o) => o.chasing === left)) handOff(left);
          });
      });
    }

    fish.forEach((f, i) => {
      const el = fishEls.current[i];
      if (!el) return;
      // Place without a transition, then start swimming.
      el.style.setProperty("--d", "0ms");
      el.style.setProperty("--x", `${f.x}px`);
      el.style.setProperty("--y", `${f.y}px`);
      el.style.setProperty("--a", `${f.angle}deg`);
      f.timer = setTimeout(() => wander(i), random(50, 1200));
    });

    // Listen on the window: content sits above the pond, and only clicks that
    // land on nothing interactive count as a tap on the water.
    // `click`, not `pointerdown`: on a phone, a finger that starts a scroll is not a tap.
    const onTap = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if ((e.target as Element | null)?.closest("a, button, input, label, [data-hamsi-avoid]")) return;
      taps.push(Date.now());
      feed(e.clientX, e.clientY);
    };
    window.addEventListener("click", onTap);
    // A crowd can gather, or the rest can end, between taps.
    const watch = setInterval(() => frenzy() && summonShark(), 1000);
    return () => {
      clearInterval(watch);
      window.removeEventListener("click", onTap);
      fish.forEach((f) => {
        clearTimeout(f.timer);
        clearTimeout(f.leg);
      });
      timers.forEach(clearTimeout);
      shark.anim?.cancel();
      shark.tailAnim?.cancel();
    };
  }, []);

  // Everything but the food never changes after mount; built once so eating a
  // pellet re-renders only the food layer, not sixteen fish and the sea floor.
  const scene = useMemo(
    () => (
      <>
        <div className="pond-rays" />
        <div className="pond-caustics" />
        <div className="pond-waves" />
        <div className="pond-waves pond-waves-back" />
        <SeaFloor />
        <Seaweed />
        {Array.from({ length: FISH }, (_, i) => (
          <div
            key={i}
            ref={(el) => {
              fishEls.current[i] = el;
            }}
            className="hamsi"
            style={{ "--s": SIZES[i % SIZES.length] } as CSSProperties}
          >
            <Hamsi />
          </div>
        ))}
        <div ref={sharkRef} className="shark">
          <Shark />
        </div>
      </>
    ),
    [],
  );

  return (
    <div ref={pondRef} aria-hidden className="pond">
      {scene}
      {/* Food floats on the surface, so from above it sits over the fish. */}
      {pellets.map((p) => (
        <span key={p.id} className="pond-pellet" data-eaten={p.eaten || undefined} style={{ "--x": `${p.x}px`, "--y": `${p.y}px`, "--sink": `${SINK_MS}ms` } as CSSProperties}>
          {p.eaten ? <span key="splash" className="pond-splash" /> : <span key="ripple" className="pond-ripple" />}
        </span>
      ))}
    </div>
  );
}
