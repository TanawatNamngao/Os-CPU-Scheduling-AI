import React, { useState } from 'react';
import { Dice5, Copy, Check, Hash, Clock, Layers, Sparkles, Sliders, AlertCircle } from 'lucide-react';
import { PRESET_DATASETS } from '../algorithms/presets.js';

export default function ControlPanel({
  seed,
  onRandomize,
  onSetSeed,
  taskCount,
  onSetTaskCount,
  quantum,
  onSetQuantum,
  baseTime,
  onSetBaseTime,
  onSelectPreset,
  validationError
}) {
  const [seedInput, setSeedInput] = useState(seed);
  const [copied, setCopied] = useState(false);
  const [qInput, setQInput] = useState(quantum);

  const handleCopySeed = () => {
    navigator.clipboard.writeText(seed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSeedSubmit = (e) => {
    e.preventDefault();
    if (seedInput.trim()) {
      onSetSeed(seedInput.trim());
    }
  };

  const handleQChange = (val) => {
    setQInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 1 && num <= 4) {
      onSetQuantum(num);
    }
  };

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div className="card-header">
        <div>
          <div className="card-title">
            <Sliders size={20} color="var(--primary)" />
            <span>แผงควบคุมและกำหนดพารามิเตอร์การจำลอง</span>
          </div>
          <p className="card-subtitle">
            กำหนดค่าเริ่มต้น, สุ่มโจทย์ใหม่ด้วย Seed หรือเลือกชุดข้อมูลตัวอย่าง
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={onRandomize}>
          <Dice5 size={18} />
          <span>สุ่มโจทย์ใหม่</span>
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16
      }}>
        {/* Seed Controller */}
        <div className="input-group">
          <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>รหัสสุ่มโจทย์ (Seed)</span>
            <button
              type="button"
              onClick={handleCopySeed}
              style={{
                background: 'none',
                border: 'none',
                color: copied ? 'var(--emerald-accent)' : 'var(--primary)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
            </button>
          </label>
          <form onSubmit={handleSeedSubmit} style={{ display: 'flex', gap: 6 }}>
            <input
              type="text"
              className="input-control"
              style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
              value={seedInput}
              onChange={(e) => setSeedInput(e.target.value)}
              placeholder="ใส่ Seed เช่น 12345"
            />
            <button type="submit" className="btn btn-secondary btn-sm" title="โหลดโจทย์จาก Seed นี้">
              ใช้
            </button>
          </form>
        </div>

        {/* Task Count (5-6 as per requirement) */}
        <div className="input-group">
          <label className="input-label">จำนวนงานที่สุ่ม (งาน)</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {[4, 5, 6].map((num) => (
              <button
                key={num}
                type="button"
                className={`btn btn-sm ${taskCount === num ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
                onClick={() => onSetTaskCount(num)}
              >
                {num} งาน
              </button>
            ))}
          </div>
        </div>

        {/* Time Quantum (q = 1-4) */}
        <div className="input-group">
          <label className="input-label">
            Time Quantum (q) [1–4]
          </label>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                type="button"
                className={`btn btn-sm ${quantum === num ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, fontFamily: 'var(--font-mono)' }}
                onClick={() => handleQChange(num)}
              >
                q = {num}
              </button>
            ))}
          </div>
        </div>

        {/* Base Time (t0) */}
        <div className="input-group">
          <label className="input-label">วันและเวลาฐานเริ่มต้น (t₀)</label>
          <input
            type="text"
            className="input-control"
            value={baseTime}
            onChange={(e) => onSetBaseTime(e.target.value)}
            placeholder="เช่น 09:00 วันจันทร์"
          />
        </div>
      </div>

      {/* Preset Selector Bar */}
      <div style={{
        marginTop: 18,
        paddingTop: 14,
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10
      }}>
        <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          ชุดโจทย์ตัวอย่างรวดเร็ว:
        </span>
        {PRESET_DATASETS.slice(0, 4).map((preset) => (
          <button
            key={preset.id}
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => onSelectPreset(preset)}
            style={{ fontSize: '0.8rem', padding: '5px 10px' }}
          >
            {preset.title.split(':')[0]}
          </button>
        ))}
      </div>

      {validationError && (
        <div style={{
          marginTop: 14,
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          color: '#fda4af',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: '0.875rem'
        }}>
          <AlertCircle size={18} />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
}
