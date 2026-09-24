import React, { useState } from 'react';
import { Bookmark, X, FolderOpen, Copy, Download, Upload, Check, Trash2, Calendar, Hash, Clock, FileJson } from 'lucide-react';

export default function SavedDatasetsModal({
  isOpen,
  onClose,
  savedDatasets,
  onSaveCurrent,
  onRecall,
  onDeleteSaved,
  onExportJSON,
  onImportJSON,
  currentSeed,
  currentQ,
  currentTasksCount
}) {
  const [importText, setImportText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  const handleCopySingle = (item) => {
    const payload = {
      version: '1.0',
      savedAt: item.savedAt,
      seed: item.seed,
      quantum: item.quantum,
      baseTime: item.baseTime,
      tasks: item.tasks
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleImportSubmit = () => {
    if (!importText.trim()) return;
    onImportJSON(importText.trim());
    setImportText('');
    setShowImportBox(false);
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
      <div className="card" style={{ maxWidth: 740, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="card-header">
          <div className="card-title">
            <Bookmark size={22} color="var(--primary)" />
            <span>บันทึก Seed พารามิเตอร์ และเรียกโจทย์เดิม (Requirement 4)</span>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
          ระบบรองรับการบันทึก Seed, ค่า Quantum (q), วันเวลาฐาน (t₀) และชุดข้อมูลจริง (AT, BT ของทุก Process) เพื่อเรียกโจทย์เดิมกลับมาทดสอบซ้ำได้ 100%
        </p>

        {/* Action bar */}
        <div style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          marginBottom: 18,
          background: 'var(--bg-input)',
          padding: 12,
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
              โจทย์ปัจจุบัน: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>{currentSeed}</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              จำนวน {currentTasksCount} งาน | Quantum q = {currentQ}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-sm" onClick={onSaveCurrent}>
              <Bookmark size={15} />
              <span>บันทึกโจทย์นี้ไว้</span>
            </button>
            <button className="btn btn-outline btn-sm" onClick={onExportJSON} title="คัดลอก JSON โจทย์">
              <Copy size={15} />
              <span>คัดลอก JSON</span>
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowImportBox(!showImportBox)}
            >
              <Upload size={15} />
              <span>นำเข้า JSON</span>
            </button>
          </div>
        </div>

        {/* Import JSON Box */}
        {showImportBox && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px dashed var(--primary)',
            padding: 14,
            borderRadius: 'var(--radius-md)',
            marginBottom: 18
          }}>
            <label className="input-label" style={{ marginBottom: 6 }}>
              วางโค้ด JSON ของโจทย์ที่ต้องการนำเข้า:
            </label>
            <textarea
              className="input-control"
              style={{ width: '100%', minHeight: 90, fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
              placeholder='วาง JSON เช่น {"seed":"SEED-123","quantum":2,"tasks":[...]}'
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
              <button className="btn btn-outline btn-sm" onClick={() => setShowImportBox(false)}>
                ยกเลิก
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleImportSubmit}>
                ยืนยันการนำเข้า
              </button>
            </div>
          </div>
        )}

        {/* Saved List */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <FolderOpen size={16} color="var(--primary)" />
            <span>รายการโจทย์ที่เคยบันทึกไว้ ({savedDatasets.length} รายการ)</span>
          </h4>

          {savedDatasets.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '30px 16px',
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-color)',
              color: 'var(--text-muted)',
              fontSize: '0.875rem'
            }}>
              ยังไม่มีโจทย์ที่บันทึกไว้ คลิกปุ่ม <strong>"บันทึกโจทย์นี้ไว้"</strong> เพื่อเก็บโจทย์ปัจจุบัน
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {savedDatasets.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12
                  }}
                >
                  <div style={{ flex: 1, minWidth: 240 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                        {item.seed}
                      </span>
                      <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                        {item.taskCount || item.tasks.length} งาน
                      </span>
                      <span className="badge" style={{ fontSize: '0.72rem', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                        q = {item.quantum}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, display: 'flex', gap: 12 }}>
                      <span>บันทึกเมื่อ: {item.savedAt}</span>
                      <span>เวลาฐาน: {item.baseTime}</span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                      {item.tasks.map(t => `${t.id}(${t.at},${t.bt})`).join(', ')}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        onRecall(item);
                        onClose();
                      }}
                      title="เรียกโจทย์นี้กลับมาแสดงในหน้าเว็บ"
                    >
                      <FolderOpen size={14} />
                      <span>เรียกโจทย์นี้</span>
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleCopySingle(item)}
                      title="คัดลอก JSON ของโจทย์นี้"
                    >
                      {copiedId === item.id ? <Check size={14} color="var(--emerald)" /> : <Copy size={14} />}
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      style={{ color: '#f43f5e' }}
                      onClick={() => onDeleteSaved(item.id)}
                      title="ลบโจทย์นี้ออกจากบันทึก"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
