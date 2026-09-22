import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, FastForward, CheckCircle2, ArrowRight } from 'lucide-react';

export default function StepSimulator({ steps, quantum }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  if (!steps || steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <div style={{
      marginTop: 24,
      padding: 20,
      borderRadius: 'var(--radius-lg)',
      background: 'rgba(99, 102, 241, 0.05)',
      border: '1px solid rgba(99, 102, 241, 0.2)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16
      }}>
        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
            โหมดจำลองการทำงานทีละขั้นตอน (Step-by-Step Simulator)
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            สังเกตการจัดการ Ready Queue และการสลับงานในแต่ละรอบ (Quantum q = {quantum})
          </p>
        </div>

        {/* Player Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => { setCurrentStepIndex(0); setIsPlaying(false); }}
            title="เริ่มใหม่"
          >
            <RotateCcw size={15} />
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            title="ขั้นตอนก่อนหน้า"
          >
            <SkipBack size={15} />
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'หยุดชั่วคราว' : 'เล่นอัตโนมัติ'}
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            <span>{isPlaying ? 'หยุด' : 'เล่น'}</span>
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))}
            disabled={currentStepIndex === steps.length - 1}
            title="ขั้นตอนถัดไป"
          >
            <SkipForward size={15} />
          </button>
          <span style={{ fontSize: '0.825rem', fontFamily: 'var(--font-mono)', marginLeft: 8 }}>
            สเต็ป {currentStepIndex + 1} / {steps.length}
          </span>
        </div>
      </div>

      {/* Step Detail Card */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 16
      }}>
        {/* Active Task Info */}
        <div style={{
          background: 'var(--bg-input)',
          padding: 14,
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>
            ช่วงเวลาที่กำลังทำงาน (Time Slice):
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              color: 'var(--cyan-accent)'
            }}>
              เวลา {currentStep.timeRange}
            </span>
            <span className="badge badge-primary">
              {currentStep.duration} ชม.
            </span>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>งานที่ได้ CPU:</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: 2 }}>
              {currentStep.taskId}: {currentStep.taskName}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: 4 }}>
              BT คงเหลือ: {currentStep.remainingBefore} →{' '}
              <strong style={{ color: currentStep.remainingAfter === 0 ? 'var(--emerald-accent)' : 'inherit' }}>
                {currentStep.remainingAfter} ชม.
              </strong>{' '}
              {currentStep.isCompleted && <span style={{ color: 'var(--emerald-accent)' }}>★ ทำเสร็จสมบูรณ์!</span>}
            </div>
          </div>
        </div>

        {/* Ready Queue State */}
        <div style={{
          background: 'var(--bg-input)',
          padding: 14,
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>
            สถานะ Ready Queue เมื่อจบรอบนี้ (เรียงเข้าก่อน-ออกก่อน):
          </div>

          <div className="queue-box">
            {currentStep.queueAfter.length === 0 ? (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                [คิวว่าง ไม่มีงานค้าง]
              </span>
            ) : (
              currentStep.queueAfter.map((id, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className="queue-item">
                    {id}
                  </div>
                  {idx < currentStep.queueAfter.length - 1 && (
                    <ArrowRight size={13} color="var(--text-subtle)" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* New Arrivals Event */}
          <div style={{ marginTop: 10, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {currentStep.newArrivals.length > 0 ? (
              <span style={{ color: 'var(--cyan-accent)' }}>
                + งานใหม่ที่มาถึงรอบนี้: {currentStep.newArrivals.join(', ')} (เข้าคิวก่อนงานเดิม)
              </span>
            ) : (
              <span>ไม่มีงานใหม่เข้ามาในรอบนี้</span>
            )}
            {currentStep.requeued && (
              <div style={{ color: 'var(--amber-accent)', marginTop: 2 }}>
                ↺ {currentStep.taskId} ยังไม่เสร็จ นำกลับไปต่อท้ายคิว
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
