// Pseudo-Random Number Generator (Mulberry32) for reproducible scheduling problems
export function createPRNG(seedInput) {
  let seed = 0;
  if (typeof seedInput === 'number') {
    seed = seedInput >>> 0;
  } else if (typeof seedInput === 'string') {
    for (let i = 0; i < seedInput.length; i++) {
      seed = ((seed << 5) - seed + seedInput.charCodeAt(i)) | 0;
    }
    seed = seed >>> 0;
  } else {
    seed = Math.floor(Math.random() * 2147483647) >>> 0;
  }

  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const COURSE_NAMES = [
  'แบบฝึกหัด OS',
  'รายงาน Database',
  'สรุป English',
  'แบบฝึกหัด Math',
  'โครงงาน AI',
  'การบ้าน Network',
  'แล็บ Data Structure',
  'สไลด์ Software Eng',
  'การบ้าน Algorithm',
  'มินิโปรเจ็ค Web Dev'
];

export const PROCESS_COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ec4899', // pink
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#f97316', // orange
  '#14b8a6', // teal
];

/**
 * Generate randomized tasks according to the worksheet:
 * - 5 to 6 tasks (user selectable or randomized)
 * - Unique IDs: P1, P2, ... Pn
 * - AT in [0, 10], with AT=0 guaranteed for at least one task
 * - BT in [1, 8]
 * - q in [1, 4]
 */
export function generateRandomTaskSet(seedValue, count = 5) {
  const prng = createPRNG(seedValue);
  const taskCount = Math.max(4, Math.min(6, count));

  // Pick unique course names
  const availableNames = [...COURSE_NAMES];
  const shuffledNames = [];
  while (availableNames.length > 0) {
    const idx = Math.floor(prng() * availableNames.length);
    shuffledNames.push(availableNames.splice(idx, 1)[0]);
  }

  // Generate AT in [0, 10], BT in [1, 8]
  const tasks = [];
  const atZeroIndex = Math.floor(prng() * taskCount);

  for (let i = 0; i < taskCount; i++) {
    const id = `P${i + 1}`;
    const name = shuffledNames[i % shuffledNames.length];
    const at = i === atZeroIndex ? 0 : Math.floor(prng() * 11); // 0 to 10
    const bt = Math.floor(prng() * 8) + 1; // 1 to 8
    tasks.push({
      id,
      name,
      at,
      bt,
      color: PROCESS_COLORS[i % PROCESS_COLORS.length]
    });
  }

  // Ensure at least one has AT = 0 if not already guaranteed
  if (!tasks.some(t => t.at === 0)) {
    tasks[0].at = 0;
  }

  // Generate q in [1, 4]
  const q = Math.floor(prng() * 4) + 1;

  return {
    seed: seedValue,
    tasks,
    q
  };
}
