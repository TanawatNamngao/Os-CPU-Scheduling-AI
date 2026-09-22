import React from 'react';
import { Printer, X, Download, FileText, CheckCircle } from 'lucide-react';

export default function WorksheetModal({
  isOpen,
  onClose,
  studentInfo,
  seed,
  quantum,
  baseTime,
  tasks,
  hypothesis,
  fcfs,
  sjf,
  rr
}) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: 16
    }}>
      <div className="card" style={{
        maxWidth: 900,
        width: '100%',
        maxHeight: '94vh',
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileText size={22} color="var(--primary)" />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                ดูตัวอย่างและพิมพ์ใบงานมินิโปรเจ็ค (Worksheet Print Preview)
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                จัดรูปแบบกระดาษ A4 ตามมาตรฐานใบงานวิชาระบบปฏิบัติการ พร้อมส่งอาจารย์
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              <Printer size={16} />
              <span>สั่งพิมพ์ / บันทึกเป็น PDF</span>
            </button>
            <button className="btn btn-outline btn-sm" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '32px 40px',
          background: '#ffffff',
          color: '#0f172a',
          fontFamily: 'var(--font-main)',
          fontSize: '13px',
          lineHeight: 1.5
        }} id="printable-worksheet">
          
          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: 24, borderBottom: '2px solid #0f172a', paddingBottom: 16 }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>CPU Scheduling Mini-Project</div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, marginTop: 4, color: '#0f172a' }}>
              ใบงานมินิโปรเจ็ควิชาระบบปฏิบัติการ
            </h2>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#4338ca', marginTop: 2 }}>
              เว็บการจัดตารางงานส่วนบุคคล ด้วย CPU Scheduling (FCFS, SJF, Round Robin)
            </h3>
          </div>

          {/* Student Info Box */}
          <div style={{
            border: '1px solid #cbd5e1',
            borderRadius: 6,
            padding: 12,
            marginBottom: 20,
            background: '#f8fafc',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px 24px'
          }}>
            <div><strong>ชื่อ-นามสกุล:</strong> {studentInfo.fullName || '...................................................'}</div>
            <div><strong>รหัสนักศึกษา:</strong> {studentInfo.studentId || '...................................'}</div>
            <div><strong>กลุ่มเรียน:</strong> {studentInfo.section || '...................................'}</div>
            <div><strong>วันที่ทดลอง:</strong> {studentInfo.testDate || new Date().toLocaleDateString('th-TH')}</div>
            <div><strong>สมาชิกกลุ่ม:</strong> {studentInfo.teamMembers || '...................................................'}</div>
            <div><strong>อาจารย์ผู้สอน:</strong> {studentInfo.instructor || '...................................'}</div>
          </div>

          {/* Simulation Parameters */}
          <div style={{ marginBottom: 18 }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #e2e8f0', paddingBottom: 4, marginBottom: 8 }}>
              1. พารามิเตอร์การจำลองและโจทย์สุ่ม
            </h4>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 10, background: '#f1f5f9', padding: 8, borderRadius: 4 }}>
              <div><strong>Seed:</strong> <span style={{ fontFamily: 'monospace' }}>{seed}</span></div>
              <div><strong>จำนวนงาน:</strong> {tasks.length} งาน</div>
              <div><strong>Time Quantum (q):</strong> {quantum} หน่วยเวลา</div>
              <div><strong>วันเวลาฐาน (t₀):</strong> {baseTime}</div>
            </div>

            {/* Task Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #94a3b8', textAlign: 'left', marginBottom: 14 }}>
              <thead>
                <tr style={{ background: '#e2e8f0' }}>
                  <th style={{ border: '1px solid #94a3b8', padding: '6px 8px' }}>Process</th>
                  <th style={{ border: '1px solid #94a3b8', padding: '6px 8px' }}>งานหรือวิชา</th>
                  <th style={{ border: '1px solid #94a3b8', padding: '6px 8px', textAlign: 'center' }}>Arrival Time (AT)</th>
                  <th style={{ border: '1px solid #94a3b8', padding: '6px 8px', textAlign: 'center' }}>Burst Time (BT)</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(t => (
                  <tr key={t.id}>
                    <td style={{ border: '1px solid #94a3b8', padding: '5px 8px', fontWeight: 700 }}>{t.id}</td>
                    <td style={{ border: '1px solid #94a3b8', padding: '5px 8px' }}>{t.name}</td>
                    <td style={{ border: '1px solid #94a3b8', padding: '5px 8px', textAlign: 'center' }}>{t.at}</td>
                    <td style={{ border: '1px solid #94a3b8', padding: '5px 8px', textAlign: 'center' }}>{t.bt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Hypothesis section */}
          <div style={{ marginBottom: 18 }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #e2e8f0', paddingBottom: 4, marginBottom: 8 }}>
              2. สมมติฐานก่อนการคำนวณ (Hypothesis)
            </h4>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: 10, borderRadius: 4, fontSize: '12px' }}>
              <p><strong>1. คาดว่าอัลกอริทึมใดจะมี WT เฉลี่ยน้อยที่สุด:</strong> {hypothesis.lowestWTAlgo || '...................'} | เหตุผล: {hypothesis.lowestWTReason || '................................................................................................'}</p>
              <p style={{ marginTop: 4 }}><strong>2. งานใดน่าจะรอนานที่สุด:</strong> {hypothesis.longestWaitTask || '...................'} | เหตุผล: {hypothesis.longestWaitReason || '................................................................................................'}</p>
              <p style={{ marginTop: 4 }}><strong>3. หากเพิ่มค่า q ผลจะเปลี่ยนอย่างไร:</strong> {hypothesis.qChangeEffect || '....................................................................................................................................'}</p>
            </div>
          </div>

          {/* Algorithms Detail Breakdown */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #e2e8f0', paddingBottom: 4, marginBottom: 8 }}>
              3. ผลลัพธ์การจัดตารางงาน (Gantt Chart & Result Tables)
            </h4>

            {[
              { name: 'FCFS (First-Come First-Served)', data: fcfs },
              { name: 'SJF (Shortest Job First - Non-preemptive)', data: sjf },
              { name: `Round Robin (q = ${quantum})`, data: rr }
            ].map(({ name, data }, idx) => (
              <div key={idx} style={{ marginBottom: 16, border: '1px solid #cbd5e1', padding: 10, borderRadius: 4 }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#1e293b', marginBottom: 6 }}>
                  {name} — ค่าเฉลี่ย TAT = {data.avgTAT.toFixed(2)} หน่วย | ค่าเฉลี่ย WT = {data.avgWT.toFixed(2)} หน่วย
                </div>

                {/* Timeline display */}
                <div style={{
                  display: 'flex',
                  border: '1px solid #64748b',
                  height: 26,
                  marginBottom: 4,
                  fontSize: '11px',
                  fontWeight: 700
                }}>
                  {data.timeline.map((sl, i) => {
                    const totalDur = data.timeline[data.timeline.length - 1].end;
                    const w = (sl.duration / totalDur) * 100;
                    return (
                      <div
                        key={i}
                        style={{
                          width: `${w}%`,
                          borderRight: '1px solid #64748b',
                          background: sl.isIdle ? '#e2e8f0' : '#f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {sl.isIdle ? 'IDLE' : sl.id} ({sl.duration})
                      </div>
                    );
                  })}
                </div>

                {/* Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #94a3b8', textAlign: 'center', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ border: '1px solid #cbd5e1', padding: 4 }}>งาน</th>
                      <th style={{ border: '1px solid #cbd5e1', padding: 4 }}>AT</th>
                      <th style={{ border: '1px solid #cbd5e1', padding: 4 }}>BT</th>
                      <th style={{ border: '1px solid #cbd5e1', padding: 4 }}>CT</th>
                      <th style={{ border: '1px solid #cbd5e1', padding: 4 }}>TAT (CT - AT)</th>
                      <th style={{ border: '1px solid #cbd5e1', padding: 4 }}>WT (TAT - BT)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.results.map(r => (
                      <tr key={r.id}>
                        <td style={{ border: '1px solid #cbd5e1', padding: 3, fontWeight: 600 }}>{r.id}</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: 3 }}>{r.at}</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: 3 }}>{r.bt}</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: 3, fontWeight: 700 }}>{r.ct}</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: 3 }}>{r.tat}</td>
                        <td style={{ border: '1px solid #cbd5e1', padding: 3 }}>{r.wt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* Comparison Summary Table */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #e2e8f0', paddingBottom: 4, marginBottom: 8 }}>
              4. ตารางสรุปผลการทดลองเปรียบเทียบ (ตามใบงานหน้า 10)
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #94a3b8', textAlign: 'center', marginBottom: 16 }}>
              <thead>
                <tr style={{ background: '#e2e8f0' }}>
                  <th style={{ border: '1px solid #94a3b8', padding: '6px 8px' }}>อัลกอริทึม</th>
                  <th style={{ border: '1px solid #94a3b8', padding: '6px 8px' }}>TAT เฉลี่ย (โปรแกรม)</th>
                  <th style={{ border: '1px solid #94a3b8', padding: '6px 8px' }}>WT เฉลี่ย (โปรแกรม)</th>
                  <th style={{ border: '1px solid #94a3b8', padding: '6px 8px' }}>TAT เฉลี่ย (คำนวณมือ)</th>
                  <th style={{ border: '1px solid #94a3b8', padding: '6px 8px' }}>WT เฉลี่ย (คำนวณมือ)</th>
                  <th style={{ border: '1px solid #94a3b8', padding: '6px 8px' }}>ผลตรงกันหรือไม่</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #94a3b8', padding: 5, fontWeight: 700 }}>FCFS</td>
                  <td style={{ border: '1px solid #94a3b8', padding: 5 }}>{fcfs.avgTAT.toFixed(2)}</td>
                  <td style={{ border: '1px solid #94a3b8', padding: 5 }}>{fcfs.avgWT.toFixed(2)}</td>
                  <td style={{ border: '1px solid #94a3b8', padding: 5 }}></td>
                  <td style={{ border: '1px solid #94a3b8', padding: 5 }}></td>
                  <td style={{ border: '1px solid #94a3b8', padding: 5 }}>[ ] ตรง [ ] ไม่ตรง</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #94a3b8', padding: 5, fontWeight: 700 }}>SJF</td>
                  <td style={{ border: '1px solid #94a3b8', padding: 5 }}>{sjf.avgTAT.toFixed(2)}</td>
                  <td style={{ border: '1px solid #94a3b8', padding: 5 }}>{sjf.avgWT.toFixed(2)}</td>
                  <td style={{ border: '1px solid #94a3b8', padding: 5 }}></td>
                  <td style={{ border: '1px solid #94a3b8', padding: 5 }}></td>
                  <td style={{ border: '1px solid #94a3b8', padding: 5 }}>[ ] ตรง [ ] ไม่ตรง</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #94a3b8', padding: 5, fontWeight: 700 }}>Round Robin</td>
                  <td style={{ border: '1px solid #94a3b8', padding: 5 }}>{rr.avgTAT.toFixed(2)}</td>
                  <td style={{ border: '1px solid #94a3b8', padding: 5 }}>{rr.avgWT.toFixed(2)}</td>
                  <td style={{ border: '1px solid #94a3b8', padding: 5 }}></td>
                  <td style={{ border: '1px solid #94a3b8', padding: 5 }}></td>
                  <td style={{ border: '1px solid #94a3b8', padding: 5 }}>[ ] ตรง [ ] ไม่ตรง</td>
                </tr>
              </tbody>
            </table>

            {/* Signature Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <div>ลงชื่อ ................................................................ นักศึกษา</div>
                <div style={{ marginTop: 4 }}>( {studentInfo.fullName || '................................................................'} )</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div>ลงชื่อ ................................................................ ผู้ตรวจ/อาจารย์</div>
                <div style={{ marginTop: 4 }}>วันที่ ........ / ........ / ................</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
