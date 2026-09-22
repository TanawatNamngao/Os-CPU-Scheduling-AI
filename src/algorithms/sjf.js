/**
 * Shortest Job First (SJF) - Non-preemptive Scheduling Algorithm
 * Rules:
 * - Single worker, non-preemptive
 * - When CPU is free, select task with minimum Burst Time (BT) from ready tasks (AT <= currentTime)
 * - Tie-breaking 1: If BT is equal, select task with earliest AT (Arrival Time)
 * - Tie-breaking 2: If AT is also equal, sort by Process ID number (P1 < P2 < P10)
 * - If CPU is empty and no task ready, mark as IDLE until next arrival
 */
export function runSJF(tasks) {
  const n = tasks.length;
  if (n === 0) {
    return { timeline: [], results: [], avgTAT: 0, avgWT: 0 };
  }

  const unfinished = tasks.map(t => ({ ...t }));
  let currentTime = 0;
  const timeline = [];
  const results = [];

  const getProcessNumber = (id) => parseInt(id.replace(/\D/g, ''), 10) || 0;

  while (unfinished.length > 0) {
    // Find all tasks that have arrived by currentTime
    const readyTasks = unfinished.filter(t => t.at <= currentTime);

    if (readyTasks.length === 0) {
      // Idle time: advance to earliest arrival time among remaining tasks
      const nextArrival = Math.min(...unfinished.map(t => t.at));
      timeline.push({
        id: 'IDLE',
        name: 'Idle (ว่างงาน)',
        start: currentTime,
        end: nextArrival,
        duration: nextArrival - currentTime,
        isIdle: true,
        color: '#64748b'
      });
      currentTime = nextArrival;
      continue;
    }

    // Sort ready tasks by BT ascending -> AT ascending -> Process ID ascending
    readyTasks.sort((a, b) => {
      if (a.bt !== b.bt) return a.bt - b.bt;
      if (a.at !== b.at) return a.at - b.at;
      return getProcessNumber(a.id) - getProcessNumber(b.id);
    });

    const chosen = readyTasks[0];
    const index = unfinished.findIndex(t => t.id === chosen.id);
    unfinished.splice(index, 1);

    const start = currentTime;
    const end = start + chosen.bt;
    currentTime = end;

    timeline.push({
      id: chosen.id,
      name: chosen.name,
      start,
      end,
      duration: chosen.bt,
      isIdle: false,
      color: chosen.color
    });

    const ct = end;
    const tat = ct - chosen.at;
    const wt = tat - chosen.bt;

    results.push({
      id: chosen.id,
      name: chosen.name,
      at: chosen.at,
      bt: chosen.bt,
      color: chosen.color,
      ct,
      tat,
      wt
    });
  }

  // Sort results by Process ID
  results.sort((a, b) => getProcessNumber(a.id) - getProcessNumber(b.id));

  const totalTAT = results.reduce((sum, r) => sum + r.tat, 0);
  const totalWT = results.reduce((sum, r) => sum + r.wt, 0);
  const avgTAT = parseFloat((totalTAT / n).toFixed(2));
  const avgWT = parseFloat((totalWT / n).toFixed(2));

  return {
    algorithm: 'SJF',
    name: 'Shortest Job First (Non-preemptive)',
    timeline,
    results,
    totalTAT,
    totalWT,
    avgTAT,
    avgWT
  };
}
