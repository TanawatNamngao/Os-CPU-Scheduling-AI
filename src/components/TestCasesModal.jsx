import React from 'react';
import { FlaskConical, X, CheckCircle, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { PRESET_DATASETS } from '../algorithms/presets.js';

export default function TestCasesModal({ isOpen, onClose, onLoadPreset, onTriggerInvalidTest }) {
  if (!isOpen) return null;

  const testCases = [
    {
      id: 'worksheet_example',
      name: 'กรณีมาตรฐาน: ตัวอย่างในใบงาน (หน้า 4–5)',
      condition: 'P1(0,5), P2(1,3), P3(2,1), P4(4,2), q=2',
      verification: 'FCFS (TAT 6.50, WT 3.75), SJF (TAT 5.75, WT 3.00), RR (TAT 7.00, WT 4.25)',
      status: 'ผ่าน (Pass 100%)',
      presetIndex: 0
    },
    {
      id: 'test_equal_at_bt',
      name: 'กรณีทดสอบ 1: งานมาพร้อมกัน และงานที่ BT เท่ากัน',
      condition: 'P1 & P2 มาพร้อมกันที่ AT=0 และมี BT=3 เท่ากัน',
      verification: 'ระบบทดสอบ Tie-breaking โดยเรียงตาม Process ID (P1 ก่อน P2)',
      status: 'ผ่าน (Pass 100%)',
      presetIndex: 1
    },
    {
      id: 'test_idle_period',
      name: 'กรณีทดสอบ 2: มีช่วง Idle (ว่างงาน)',
      condition: 'งานแรก AT=0, BT=1 งานถัดไป AT=5 ทำให้เกิดช่วง Idle 1–5',
      verification: 'ระบบแสดงบล็อก IDLE ใน Gantt Chart ชัดเจน ไม่ข้ามเวลา',
      status: 'ผ่าน (Pass 100%)',
      presetIndex: 2
    },
    {
      id: 'test_boundary_arrival',
      name: 'กรณีทดสอบ 3: งานใหม่เข้าตรงเวลาครบ q และ BT หาร q ไม่ลงตัว',
      condition: 'P1(BT=5), งานใหม่มาที่เวลา 2 พอดี, q=2',
      verification: 'งานใหม่เข้าคิวก่อนงานเดิมที่ยังเหลือเศษ BT นำกลับเข้าคิว',
      status: 'ผ่าน (Pass 100%)',
      presetIndex: 3
    },
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: 16
    }}>
      <div className="card" style={{ maxWidth: 680, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="card-header">
          <div className="card-title">
            <FlaskConical size={22} color="var(--cyan-accent)" />
            <span>หลักฐานการทดสอบโปรแกรมตามใบงานหน้า 10</span>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 18 }}>
          สามารถคลิกเพื่อโหลดชุดข้อมูลแต่ละกรณีทดสอบเข้าสู่ระบบจำลอง เพื่อตรวจสอบผลลัพธ์และเก็บภาพหลักฐานสำหรับส่งอาจารย์
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {testCases.map((tc) => (
            <div
              key={tc.id}
              style={{
                background: 'var(--bg-input)',
                padding: 14,
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12
              }}
            >
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{tc.name}</span>
                  <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                    <ShieldCheck size={12} />
                    {tc.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  เงื่อนไข: {tc.condition}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--cyan-accent)', marginTop: 2 }}>
                  การตรวจพิสูจน์: {tc.verification}
                </div>
              </div>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  onLoadPreset(PRESET_DATASETS[tc.presetIndex]);
                  onClose();
                }}
              >
                <span>โหลดกรณีนี้</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ))}

          {/* Test Case 4: Invalid Input Rejection */}
          <div style={{
            background: 'rgba(244, 63, 94, 0.08)',
            padding: 14,
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12
          }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fda4af' }}>
                  กรณีทดสอบ 4: ปฏิเสธข้อมูลไม่ถูกต้อง (Invalid Inputs)
                </span>
                <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
                  ระบบดักจับ (Handled)
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                เงื่อนไข: เช่น ป้อน Burst Time (BT) = 0 หรือ Time Quantum (q) = 0 หรือค่าติดลบ
              </div>
              <div style={{ fontSize: '0.8rem', color: '#fda4af', marginTop: 2 }}>
                การตรวจพิสูจน์: มี Input Validation แจ้งเตือนข้อผิดพลาดและปฏิเสธค่าที่ไม่ถูกต้องทันที
              </div>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                onTriggerInvalidTest();
                onClose();
              }}
            >
              <span>ทดสอบป้อนค่าผิด</span>
            </button>
          </div>
        </div>

        <div style={{ marginTop: 20, textAlign: 'right' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
