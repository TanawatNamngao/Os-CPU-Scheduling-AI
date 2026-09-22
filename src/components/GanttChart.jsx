import React, { useState } from 'react';
import { BarChart3, Clock } from 'lucide-react';

export default function GanttChart({ timeline, title = 'Gantt Chart' }) {
  const [hoveredSlice, setHoveredSlice] = useState(null);

  if (!timeline || timeline.length === 0) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>
        ไม่มีข้อมูล Timeline
      </div>
    );
  }

  const totalDuration = timeline[timeline.length - 1].end;

  // Build unique boundary ticks
  const boundaryPoints = new Set([0]);
  timeline.forEach(slice => {
    boundaryPoints.add(slice.end);
  });
  const sortedBoundaries = Array.from(boundaryPoints).sort((a, b) => a - b);

  return (
    <div style={{ margin: '16px 0' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Clock size={16} color="var(--primary)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{title}</span>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          เวลารวม: {totalDuration} หน่วยเวลา
        </span>
      </div>

      <div className="gantt-wrapper">
        {/* Main Gantt Bar */}
        <div className="gantt-chart">
          {timeline.map((slice, index) => {
            const widthPercent = totalDuration > 0 ? (slice.duration / totalDuration) * 100 : 0;
            const isIdle = slice.isIdle;

            return (
              <div
                key={index}
                className={`gantt-block ${isIdle ? 'idle' : ''}`}
                style={{
                  width: `${widthPercent}%`,
                  backgroundColor: isIdle ? undefined : slice.color,
                }}
                onMouseEnter={() => setHoveredSlice(slice)}
                onMouseLeave={() => setHoveredSlice(null)}
              >
                <span className="gantt-block-title">
                  {isIdle ? 'IDLE' : slice.id}
                </span>
                {!isIdle && (
                  <span className="gantt-block-subtitle">
                    {slice.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Timeline Ticks at Boundaries */}
        <div className="gantt-timeline-ticks">
          {sortedBoundaries.map((point) => {
            const leftPercent = totalDuration > 0 ? (point / totalDuration) * 100 : 0;
            return (
              <div
                key={point}
                className="gantt-tick-boundary"
                style={{ left: `${leftPercent}%` }}
              >
                <div className="gantt-tick-line" />
                <span>{point}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hover Information Pill */}
      <div style={{
        minHeight: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4
      }}>
        {hoveredSlice ? (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            padding: '4px 14px',
            borderRadius: '9999px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            fontSize: '0.825rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <span style={{ fontWeight: 700, color: hoveredSlice.color || 'var(--text-main)' }}>
              {hoveredSlice.isIdle ? 'ช่วงว่างงาน (IDLE)' : `${hoveredSlice.id}: ${hoveredSlice.name}`}
            </span>
            <span>
              ช่วงเวลา: <strong>{hoveredSlice.start} – {hoveredSlice.end}</strong>
            </span>
            <span>
              ระยะเวลาทำงาน: <strong>{hoveredSlice.duration} ชม.</strong>
            </span>
            {hoveredSlice.remainingAfter !== undefined && !hoveredSlice.isIdle && (
              <span>
                งานที่เหลือเมื่อจบรอบ: <strong>{hoveredSlice.remainingAfter} ชม.</strong>
              </span>
            )}
          </div>
        ) : (
          <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
            * นำเมาส์ไปชี้ที่แถบ Gantt Chart เพื่อดูรายละเอียดช่วงเวลา
          </span>
        )}
      </div>
    </div>
  );
}
