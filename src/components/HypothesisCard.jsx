import React, { useState } from 'react';
import { HelpCircle, Eye, EyeOff, CheckCircle2, Sparkles, BrainCircuit } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HypothesisCard({
  isRevealed,
  onToggleReveal,
  hypothesis,
  onUpdateHypothesis,
  tasks
}) {
  const [isOpen, setIsOpen] = useState(true);

  const handleReveal = () => {
    if (!isRevealed) {
      // Trigger subtle celebration confetti
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Ignore if confetti fails
      }
    }
    onToggleReveal(!isRevealed);
  };

  return (
    <div className="hypothesis-box" style={{ marginBottom: 24 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BrainCircuit size={24} color="var(--primary)" />
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
              สมมติฐานและการฝึกคิดก่อนเปิดเฉลย (Pre-Calculation Hypothesis)
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
              ตามข้อกำหนดใบงานหน้า 6 ให้นักศึกษาฝึกคำนวณด้วยมือก่อนเปิดดูเฉลยของระบบ
            </p>
          </div>
        </div>

        <button
          className={`btn ${isRevealed ? 'btn-secondary' : 'btn-primary'}`}
          onClick={handleReveal}
        >
          {isRevealed ? (
            <>
              <EyeOff size={18} />
              <span>ซ่อนผลเฉลย (กลับไปคิดด้วยมือ)</span>
            </>
          ) : (
            <>
              <Eye size={18} />
              <span>เปิดเฉลยและแสดงผลการจำลอง</span>
            </>
          )}
        </button>
      </div>

      {isOpen && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
          marginTop: 14,
          paddingTop: 14,
          borderTop: '1px solid var(--border-color)'
        }}>
          {/* Question 1 */}
          <div className="input-group">
            <label className="input-label">
              1. คาดว่าอัลกอริทึมใดจะมี WT เฉลี่ยน้อยที่สุด?
            </label>
            <select
              className="input-control"
              value={hypothesis.lowestWTAlgo || ''}
              onChange={(e) => onUpdateHypothesis('lowestWTAlgo', e.target.value)}
            >
              <option value="">-- เลือกอัลกอริทึม --</option>
              <option value="SJF">SJF (Shortest Job First)</option>
              <option value="FCFS">FCFS (First-Come First-Served)</option>
              <option value="RR">Round Robin (RR)</option>
            </select>
            <input
              type="text"
              className="input-control"
              placeholder="เพราะเหตุใด..."
              value={hypothesis.lowestWTReason || ''}
              onChange={(e) => onUpdateHypothesis('lowestWTReason', e.target.value)}
              style={{ fontSize: '0.85rem', marginTop: 4 }}
            />
          </div>

          {/* Question 2 */}
          <div className="input-group">
            <label className="input-label">
              2. งานใดน่าจะรอนานที่สุด?
            </label>
            <select
              className="input-control"
              value={hypothesis.longestWaitTask || ''}
              onChange={(e) => onUpdateHypothesis('longestWaitTask', e.target.value)}
            >
              <option value="">-- เลือกรหัสงาน --</option>
              {tasks.map(t => (
                <option key={t.id} value={t.id}>{t.id} ({t.name}, BT={t.bt})</option>
              ))}
            </select>
            <input
              type="text"
              className="input-control"
              placeholder="ลักษณะโจทย์ข้อใดทำให้คาดเช่นนั้น..."
              value={hypothesis.longestWaitReason || ''}
              onChange={(e) => onUpdateHypothesis('longestWaitReason', e.target.value)}
              style={{ fontSize: '0.85rem', marginTop: 4 }}
            />
          </div>

          {/* Question 3 */}
          <div className="input-group">
            <label className="input-label">
              3. หากเพิ่มค่า q คาดว่าลำดับงานหรือเวลารอจะเปลี่ยนอย่างไร?
            </label>
            <textarea
              className="input-control"
              rows={2}
              placeholder="เช่น ถ้า q มีค่ามากขึ้น RR จะทำงานคล้ายกับ FCFS มากขึ้น..."
              value={hypothesis.qChangeEffect || ''}
              onChange={(e) => onUpdateHypothesis('qChangeEffect', e.target.value)}
              style={{ resize: 'vertical', fontSize: '0.85rem' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
