import React from 'react';
import { Cpu, Printer, Moon, Sun, User, FlaskConical, Sparkles, BookOpen } from 'lucide-react';

export default function Header({
  theme,
  onToggleTheme,
  studentInfo,
  onOpenStudentModal,
  onOpenTestCases,
  onOpenWorksheet,
}) {
  return (
    <header className="card" style={{ marginBottom: 24, padding: '16px 24px' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16
      }}>
        {/* Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 46,
            height: 46,
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
            color: '#fff'
          }}>
            <Cpu size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              เว็บการจัดตารางงานส่วนบุคคล ด้วย CPU Scheduling
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 2 }}>
              FCFS • SJF (Non-preemptive) • Round Robin | มินิโปรเจ็ควิชาระบบปฏิบัติการ
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Student Info Trigger */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={onOpenStudentModal}
            title="ระบุข้อมูลนักศึกษาสำหรับพิมพ์ใบงาน"
          >
            <User size={16} />
            <span>
              {studentInfo.fullName ? studentInfo.fullName : 'ข้อมูลผู้จัดทำ'}
            </span>
            {studentInfo.studentId && (
              <span className="badge badge-primary" style={{ padding: '2px 6px', fontSize: '0.72rem' }}>
                {studentInfo.studentId}
              </span>
            )}
          </button>

          {/* Test Cases Trigger */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={onOpenTestCases}
            title="เลือกโจทย์กรณีทดสอบพิเศษตามใบงานหน้า 10"
          >
            <FlaskConical size={16} color="var(--cyan-accent)" />
            <span>กรณีทดสอบ</span>
          </button>

          {/* Print / Worksheet Trigger */}
          <button
            className="btn btn-primary btn-sm"
            onClick={onOpenWorksheet}
            title="เปิดใบงานมินิโปรเจ็คและพิมพ์เป็น PDF"
          >
            <Printer size={16} />
            <span>พิมพ์ใบงาน (Print)</span>
          </button>

          {/* Theme Toggle */}
          <button
            className="btn btn-outline btn-sm"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'}
            aria-label="Toggle Theme"
            style={{ width: 38, padding: 0 }}
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>
        </div>
      </div>
    </header>
  );
}
