/**
 * Round Robin (RR) Scheduling Algorithm
 * Rules:
 * - Single worker, preemptive by Time Quantum q
 * - FIFO Ready Queue
 * - When q expires or task completes earlier (BT <= q), slice ends
 * - Critical Rule (Page 3 & 5):
 *   When a new task arrives during the round or exactly at the boundary of q,
 *   new arrivals enter the ready queue BEFORE the requeued unfinished task.
 *   New arrivals are ordered by AT ascending, then by Process ID number ascending.
 * - If current task finishes (remainingBT == 0), it is not requeued.
 * - Idle intervals handled when ready queue is empty and tasks remain.
 */
export function runRoundRobin(tasks, q = 2) {
  const quantum = Math.max(1, parseInt(q, 10) || 2);
  const n = tasks.length;

  if (n === 0) {
    return { timeline: [], results: [], avgTAT: 0, avgWT: 0, steps: [] };
  }

  const getProcessNumber = (id) => parseInt(id.replace(/\D/g, ''), 10) || 0;

  // Initialize task states
  const taskState = tasks.map(t => ({
    ...t,
    remainingBT: t.bt,
    isCompleted: false,
    ct: 0,
    tat: 0,
    wt: 0
  }));

  let currentTime = 0;
  const readyQueue = [];
  const timeline = [];
  const steps = [];
  const enqueuedSet = new Set();

  // Find tasks that arrived at or before currentTime (t = 0)
  const initialArrivals = taskState
    .filter(t => t.at <= currentTime && !enqueuedSet.has(t.id))
    .sort((a, b) => {
      if (a.at !== b.at) return a.at - b.at;
      return getProcessNumber(a.id) - getProcessNumber(b.id);
    });

  for (const t of initialArrivals) {
    readyQueue.push(t);
    enqueuedSet.add(t.id);
  }

  let stepCounter = 1;

  while (taskState.some(t => !t.isCompleted)) {
    // If ready queue is empty, fast-forward to the next arriving task
    if (readyQueue.length === 0) {
      const remainingUnarrived = taskState.filter(t => !t.isCompleted && !enqueuedSet.has(t.id));
      if (remainingUnarrived.length === 0) break; // All completed

      const nextArrivalTime = Math.min(...remainingUnarrived.map(t => t.at));

      if (currentTime < nextArrivalTime) {
        timeline.push({
          id: 'IDLE',
          name: 'Idle (ว่างงาน)',
          start: currentTime,
          end: nextArrivalTime,
          duration: nextArrivalTime - currentTime,
          isIdle: true,
          color: '#64748b',
          remainingAfter: 0
        });
        currentTime = nextArrivalTime;
      }

      // Enqueue tasks arriving at this time
      const newlyArrived = remainingUnarrived
        .filter(t => t.at <= currentTime)
        .sort((a, b) => {
          if (a.at !== b.at) return a.at - b.at;
          return getProcessNumber(a.id) - getProcessNumber(b.id);
        });

      for (const t of newlyArrived) {
        readyQueue.push(t);
        enqueuedSet.add(t.id);
      }
    }

    const currentTask = readyQueue.shift();
    const queueBefore = readyQueue.map(t => t.id);
    const runDuration = Math.min(currentTask.remainingBT, quantum);
    const start = currentTime;
    const end = start + runDuration;
    const remainingBefore = currentTask.remainingBT;
    currentTask.remainingBT -= runDuration;
    currentTime = end;

    timeline.push({
      id: currentTask.id,
      name: currentTask.name,
      start,
      end,
      duration: runDuration,
      isIdle: false,
      color: currentTask.color,
      remainingAfter: currentTask.remainingBT
    });

    // Check newly arrived tasks during (start, end]
    const arrivingDuringRound = taskState
      .filter(t => !enqueuedSet.has(t.id) && t.at > start && t.at <= end)
      .sort((a, b) => {
        if (a.at !== b.at) return a.at - b.at;
        return getProcessNumber(a.id) - getProcessNumber(b.id);
      });

    const newArrivalIds = [];
    for (const t of arrivingDuringRound) {
      readyQueue.push(t);
      enqueuedSet.add(t.id);
      newArrivalIds.push(t.id);
    }

    // If current task still has remaining burst time, requeue it at the end
    let requeued = false;
    if (currentTask.remainingBT > 0) {
      readyQueue.push(currentTask);
      requeued = true;
    } else {
      currentTask.isCompleted = true;
      currentTask.ct = end;
      currentTask.tat = currentTask.ct - currentTask.at;
      currentTask.wt = currentTask.tat - currentTask.bt;
    }

    // Record step detail
    steps.push({
      step: stepCounter++,
      timeRange: `${start}–${end}`,
      start,
      end,
      duration: runDuration,
      taskId: currentTask.id,
      taskName: currentTask.name,
      remainingBefore,
      remainingAfter: currentTask.remainingBT,
      queueBefore,
      newArrivals: newArrivalIds,
      requeued,
      queueAfter: readyQueue.map(t => t.id),
      isCompleted: currentTask.isCompleted,
      ct: currentTask.isCompleted ? currentTask.ct : null
    });
  }

  // Compile final results table
  const results = taskState.map(t => ({
    id: t.id,
    name: t.name,
    at: t.at,
    bt: t.bt,
    color: t.color,
    ct: t.ct,
    tat: t.tat,
    wt: t.wt
  }));

  results.sort((a, b) => getProcessNumber(a.id) - getProcessNumber(b.id));

  const totalTAT = results.reduce((sum, r) => sum + r.tat, 0);
  const totalWT = results.reduce((sum, r) => sum + r.wt, 0);
  const avgTAT = parseFloat((totalTAT / n).toFixed(2));
  const avgWT = parseFloat((totalWT / n).toFixed(2));

  return {
    algorithm: 'RR',
    name: `Round Robin (q = ${quantum})`,
    quantum,
    timeline,
    results,
    steps,
    totalTAT,
    totalWT,
    avgTAT,
    avgWT
  };
}
