import React from 'react';
import { Award, BarChart2, CheckCircle2, TrendingUp, Lightbulb } from 'lucide-react';

export default function ComparisonView({ fcfs, sjf, rr }) {
  const algorithms = [
    { key: 'fcfs', name: 'FCFS', full: 'First-Come First-Served', data: fcfs, color: '#6366f1' },
    { key: 'sjf', name: 'SJF', full: 'Shortest Job First', data: sjf, color: '#10b981' },
    { key: 'rr', name: `RR (q=${rr.quantum})`, full: `Round Robin (q=${rr.quantum})`, data: rr, color: '#f59e0b' },
  ];

  // Find minimum WT and minimum TAT
  const minWT = Math.min(fcfs.avgWT, sjf.avgWT, rr.avgWT);
  const minTAT = Math.min(fcfs.avgTAT, sjf.avgTAT, rr.avgTAT);

  const maxWT = Math.max(fcfs.avgWT, sjf.avgWT, rr.avgWT, 1);
  const maxTAT = Math.max(fcfs.avgTAT, sjf.avgTAT, rr.avgTAT, 1);

  return (
    <div className="card" style={{ marginTop: 24 }}>
      <div className="card-header">
        <div>
          <div className="card-title">
            <BarChart2 size={22} color="var(--primary)" />
            <span>ตารางเปรียบเทียบผลการทดลองทั้ง 3 อัลกอริทึม (Performance Summary)</span>
          </div>
          <p className="card-subtitle">
            วิเคราะห์เปรียบเทียบผลลัพธ์จากชุดข้อมูลเดียวกันตามข้อกำหนดใบงานหน้า 5 และหน้า 10
          </p>
        </div>
      </div>

      {/* Cards comparison */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        {algorithms.map((algo) => {
          const isBestWT = algo.data.avgWT === minWT;
          const isBestTAT = algo.data.avgTAT === minTAT;

          return (
            <div
              key={algo.key}
              style={{
                background: 'var(--bg-input)',
                border: isBestWT ? `2px solid ${algo.color}` : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: 18,
                position: 'relative',
                boxShadow: isBestWT ? `0 4px 16px ${algo.color}33` : 'none'
              }}
            >
              {isBestWT && (
                <div style={{
                  position: 'absolute',
                  top: -12,
                  right: 16,
                  background: algo.color,
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <Award size={13} />
                  <span>เวลารอน้อยที่สุด (Best WT)</span>
                </div>
              )}

              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: algo.color }}>
                {algo.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 14 }}>
                {algo.full}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: 10,
                  borderRadius: 'var(--radius-sm)'
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>WT เฉลี่ย</div>
                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    color: isBestWT ? 'var(--emerald-accent)' : 'inherit'
                  }}>
                    {algo.data.avgWT.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>หน่วยเวลา</div>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: 10,
                  borderRadius: 'var(--radius-sm)'
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TAT เฉลี่ย</div>
                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    color: isBestTAT ? 'var(--cyan-accent)' : 'inherit'
                  }}>
                    {algo.data.avgTAT.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>หน่วยเวลา</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Bar Comparison */}
      <div style={{
        background: 'var(--bg-input)',
        padding: 20,
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        marginBottom: 20
      }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={16} color="var(--primary)" />
          <span>กราฟเปรียบเทียบเวลารอเฉลี่ย (Average Waiting Time)</span>
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {algorithms.map((algo) => {
            const widthPct = Math.max(12, (algo.data.avgWT / maxWT) * 100);
            return (
              <div key={algo.key} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 90, fontSize: '0.85rem', fontWeight: 700, textAlign: 'right' }}>
                  {algo.name}
                </div>
                <div style={{ flex: 1, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 9999, height: 22, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${widthPct}%`,
                      height: '100%',
                      background: algo.color,
                      borderRadius: 9999,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: 10,
                      color: '#fff',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      transition: 'width 0.4s ease'
                    }}
                  >
                    {algo.data.avgWT.toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Theoretical Discussion Card */}
      <div style={{
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: 16,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12
      }}>
        <Lightbulb size={22} color="var(--emerald-accent)" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--emerald-accent)' }}>สรุปการแปลผลตามทฤษฎีระบบปฏิบัติการ:</strong>
          <ul style={{ paddingLeft: 18, marginTop: 6, color: 'var(--text-muted)' }}>
            <li>
              <strong>SJF (Shortest Job First):</strong> ให้เวลารอเฉลี่ย (Average WT) ต่ำที่สุด เนื่องจากเลือกงานที่ใช้เวลาสั้นทำก่อน ทำให้งานจำนวนมากเสร็จสิ้นและออกจากคิวได้เร็วที่สุด
            </li>
            <li>
              <strong>Round Robin (RR):</strong> ช่วยแบ่งโอกาสการเริ่มทำงานอย่างเท่าเทียม (Fairness) ไม่ทำให้งานสั้นต้องรอคอยงานยาวนานเกินไป แม้เวลารอเฉลี่ยรวมอาจสูงกว่า SJF
            </li>
            <li>
              <strong>Time Quantum (q):</strong> หากเพิ่มค่า $q$ สูงขึ้น ลำดับการสลับงานของ Round Robin จะใกล้เคียงกับ FCFS มากขึ้นตามลำดับ
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
