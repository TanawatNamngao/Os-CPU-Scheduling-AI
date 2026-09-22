/**
 * First-Come, First-Served (FCFS) Scheduling Algorithm
 * Rules:
 * - Single worker, non-preemptive
 * - Select task with earliest AT (Arrival Time)
 * - Tie-breaking: If AT is equal, sort by Process ID number (P1 < P2 < P10)
 * - If CPU is empty and no task ready, mark as IDLE until next arrival
 */
export function runFCFS(tasks) {
  // Deep copy and validate
  const taskList = tasks.map(t => ({ ...t }));
  const n = taskList.length;

  if (n === 0) {
    return { timeline: [], results: [], avgTAT: 0, avgWT: 0 };
  }

  // Sort by AT ascending, then by numeric Process ID
  taskList.sort((a, b) => {
    if (a.at !== b.at) return a.at - b.at;
    const numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });

  let currentTime = 0;
  const timeline = [];
  const results = [];

  for (const task of taskList) {
    // If CPU is idle before this task arrives
    if (currentTime < task.at) {
      timeline.push({
        id: 'IDLE',
        name: 'Idle (ว่างงาน)',
        start: currentTime,
        end: task.at,
        duration: task.at - currentTime,
        isIdle: true,
        color: '#64748b'
      });
      currentTime = task.at;
    }

    const start = currentTime;
    const end = start + task.bt;
    currentTime = end;

    timeline.push({
      id: task.id,
      name: task.name,
      start,
      end,
      duration: task.bt,
      isIdle: false,
      color: task.color
    });

    const ct = end;
    const tat = ct - task.at;
    const wt = tat - task.bt;

    results.push({
      id: task.id,
      name: task.name,
      at: task.at,
      bt: task.bt,
      color: task.color,
      ct,
      tat,
      wt
    });
  }

  // Sort results back by Process ID for clean presentation
  results.sort((a, b) => {
    const numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });

  const totalTAT = results.reduce((sum, r) => sum + r.tat, 0);
  const totalWT = results.reduce((sum, r) => sum + r.wt, 0);
  const avgTAT = parseFloat((totalTAT / n).toFixed(2));
  const avgWT = parseFloat((totalWT / n).toFixed(2));

  return {
    algorithm: 'FCFS',
    name: 'First-Come, First-Served',
    timeline,
    results,
    totalTAT,
    totalWT,
    avgTAT,
    avgWT
  };
}
