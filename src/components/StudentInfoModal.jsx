import React from 'react';
import { User, X, Check, BookOpen, Calendar, Users, Award } from 'lucide-react';

export default function StudentInfoModal({ isOpen, onClose, studentInfo, onSave }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updated = {
      fullName: formData.get('fullName') || '',
      studentId: formData.get('studentId') || '',
      section: formData.get('section') || '',
      teamMembers: formData.get('teamMembers') || '',
      testDate: formData.get('testDate') || new Date().toISOString().split('T')[0],
      instructor: formData.get('instructor') || '',
    };
    onSave(updated);
    onClose();
  };

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
      <div className="card" style={{ maxWidth: 540, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="card-header">
          <div className="card-title">
            <User size={22} color="var(--primary)" />
            <span>ข้อมูลผู้จัดทำ (สำหรับพิมพ์ใบงาน)</span>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group">
            <label className="input-label">ชื่อ-นามสกุล นักศึกษา</label>
            <input
              type="text"
              name="fullName"
              defaultValue={studentInfo.fullName}
              className="input-control"
              placeholder="เช่น นายสมชาย ใจดี"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="input-group">
              <label className="input-label">รหัสนักศึกษา</label>
              <input
                type="text"
                name="studentId"
                defaultValue={studentInfo.studentId}
                className="input-control"
                placeholder="เช่น 65010000"
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">กลุ่มเรียน / Section</label>
              <input
                type="text"
                name="section"
                defaultValue={studentInfo.section}
                className="input-control"
                placeholder="เช่น กลุ่ม 1"
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">สมาชิกกลุ่ม (ถ้ามี)</label>
            <input
              type="text"
              name="teamMembers"
              defaultValue={studentInfo.teamMembers}
              className="input-control"
              placeholder="ระบุรายชื่อเพื่อนร่วมกลุ่ม"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="input-group">
              <label className="input-label">วันที่ทดลอง</label>
              <input
                type="date"
                name="testDate"
                defaultValue={studentInfo.testDate || new Date().toISOString().split('T')[0]}
                className="input-control"
              />
            </div>
            <div className="input-group">
              <label className="input-label">อาจารย์ผู้สอน</label>
              <input
                type="text"
                name="instructor"
                defaultValue={studentInfo.instructor}
                className="input-control"
                placeholder="เช่น อ.ดร. นามสมมติ"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              ยกเลิก
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={18} />
              บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
