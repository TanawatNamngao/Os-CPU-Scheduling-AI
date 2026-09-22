import React, { useState } from 'react';
import { ListFilter, Edit3, Plus, Trash2, Check, RefreshCw, AlertTriangle } from 'lucide-react';
import { COURSE_NAMES, PROCESS_COLORS } from '../algorithms/prng.js';

export default function TaskTable({
  tasks,
  onUpdateTasks,
  baseTime,
  isManualEdit,
  setIsManualEdit
}) {
  const [localTasks, setLocalTasks] = useState(tasks);

  // Synchronize when tasks prop changes externally
  React.useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleFieldChange = (index, field, value) => {
    const updated = [...localTasks];
    if (field === 'at' || field === 'bt') {
      const parsed = parseInt(value, 10);
      updated[index][field] = isNaN(parsed) ? 0 : parsed;
    } else {
      updated[index][field] = value;
    }
    setLocalTasks(updated);
  };

  const handleSave = () => {
    // Basic validation
    let hasError = false;
    for (const t of localTasks) {
      if (t.bt <= 0) {
        alert('Burst Time (BT) ต้องเป็นจำนวนเต็มมากกว่า 0');
        return;
      }
      if (t.at < 0) {
        alert('Arrival Time (AT) ต้องไม่ติดลบ');
        return;
      }
    }
    if (!localTasks.some(t => t.at === 0)) {
      alert('ตามข้อกำหนดใบงาน ต้องมีอย่างน้อยหนึ่งงานที่มี Arrival Time = 0 (AT = 0)');
      return;
    }
    onUpdateTasks(localTasks);
    setIsManualEdit(false);
  };

  const handleAddTask = () => {
    if (localTasks.length >= 8) {
      alert('จำกัดงานสูงสุดไม่เกิน 8 งาน');
      return;
    }
    const nextNum = localTasks.length + 1;
    const newTask = {
      id: `P${nextNum}`,
      name: COURSE_NAMES[(nextNum - 1) % COURSE_NAMES.length],
      at: Math.max(...localTasks.map(t => t.at)) + 1,
      bt: 3,
      color: PROCESS_COLORS[(nextNum - 1) % PROCESS_COLORS.length]
    };
    setLocalTasks([...localTasks, newTask]);
  };

  const handleDeleteTask = (index) => {
    if (localTasks.length <= 2) {
      alert('ต้องมีอย่างน้อย 2 งานสำหรับการจำลอง');
      return;
    }
    const updated = localTasks.filter((_, i) => i !== index);
    // Re-index IDs
    const reindexed = updated.map((t, i) => ({
      ...t,
      id: `P${i + 1}`
    }));
    setLocalTasks(reindexed);
  };

  // Calculate simulated time from baseTime string
  const formatSimulatedTime = (at) => {
    return `${at} ชม. หลังจาก t₀`;
  };

  const hasAtZero = tasks.some(t => t.at === 0);

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div className="card-header">
        <div>
          <div className="card-title">
            <ListFilter size={20} color="var(--primary)" />
            <span>ตารางรายการงานที่ต้องทำ (Task & Process List)</span>
          </div>
          <p className="card-subtitle">
            จำลองสถานการณ์นักศึกษาทำงานครั้งละ 1 ชิ้น โดยใช้ชุดข้อมูลนี้เปรียบเทียบทั้ง 3 อัลกอริทึม
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {isManualEdit ? (
            <>
              <button className="btn btn-secondary btn-sm" onClick={handleAddTask}>
                <Plus size={16} />
                <span>เพิ่มงาน</span>
              </button>
              <button className="btn btn-success btn-sm" onClick={handleSave}>
                <Check size={16} />
                <span>บันทึกการแก้ไข</span>
              </button>
            </>
          ) : (
            <button className="btn btn-secondary btn-sm" onClick={() => setIsManualEdit(true)}>
              <Edit3 size={16} />
              <span>แก้ไขโจทย์เอง</span>
            </button>
          )}
        </div>
      </div>

      {!hasAtZero && (
        <div style={{
          marginBottom: 16,
          padding: '10px 14px',
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 'var(--radius-md)',
          color: '#fcd34d',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: '0.85rem'
        }}>
          <AlertTriangle size={18} />
          <span>คำเตือน: ตามข้อกำหนดในใบงาน ต้องมีอย่างน้อยหนึ่งงานที่มี AT = 0</span>
        </div>
      )}

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '12%' }}>รหัสงาน (ID)</th>
              <th style={{ width: '38%' }}>รายละเอียดงาน / วิชา</th>
              <th style={{ width: '25%' }}>เวลาที่รับงาน (AT: Arrival Time)</th>
              <th style={{ width: '25%' }}>ระยะเวลาทำงาน (BT: Burst Time)</th>
              {isManualEdit && <th style={{ width: '10%' }}>จัดการ</th>}
            </tr>
          </thead>
          <tbody>
            {(isManualEdit ? localTasks : tasks).map((task, idx) => (
              <tr key={task.id}>
                <td>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: `${task.color}22`,
                      color: task.color,
                      border: `1px solid ${task.color}55`,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700
                    }}
                  >
                    {task.id}
                  </span>
                </td>
                <td>
                  {isManualEdit ? (
                    <input
                      type="text"
                      className="input-control"
                      value={task.name}
                      onChange={(e) => handleFieldChange(idx, 'name', e.target.value)}
                      style={{ padding: '6px 10px', fontSize: '0.9rem' }}
                    />
                  ) : (
                    <span style={{ fontWeight: 600 }}>{task.name}</span>
                  )}
                </td>
                <td>
                  {isManualEdit ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        className="input-control"
                        value={task.at}
                        onChange={(e) => handleFieldChange(idx, 'at', e.target.value)}
                        style={{ width: 80, padding: '6px 10px', fontSize: '0.9rem' }}
                      />
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ชม.</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem' }}>
                        {task.at}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                        ({formatSimulatedTime(task.at)})
                      </span>
                    </div>
                  )}
                </td>
                <td>
                  {isManualEdit ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        className="input-control"
                        value={task.bt}
                        onChange={(e) => handleFieldChange(idx, 'bt', e.target.value)}
                        style={{ width: 80, padding: '6px 10px', fontSize: '0.9rem' }}
                      />
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ชม.</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: 'var(--cyan-accent)'
                      }}>
                        {task.bt}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ชั่วโมง</span>
                    </div>
                  )}
                </td>
                {isManualEdit && (
                  <td>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleDeleteTask(idx)}
                      style={{ color: 'var(--rose-accent)', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                      title="ลบงานนี้"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
