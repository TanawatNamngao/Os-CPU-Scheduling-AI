import React from 'react';
import { Calculator, Info } from 'lucide-react';

export default function ResultTable({ results, avgTAT, avgWT, totalTAT, totalWT }) {
  const n = results.length;

  return (
    <div style={{ marginTop: 20 }}>
      {/* Formula Explanatory Note */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 16px',
        background: 'rgba(99, 102, 241, 0.08)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        marginBottom: 14,
        fontSize: '0.825rem',
        color: 'var(--text-muted)'
      }}>
        <Info size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
        <div>
          <span>สูตรคำนวณตามใบงาน: </span>
          <strong style={{ color: 'var(--text-main)' }}>CT</strong> = เวลาสิ้นสุดใน Gantt Chart |{' '}
          <strong style={{ color: 'var(--text-main)' }}>TAT</strong> = CT − AT |{' '}
          <strong style={{ color: 'var(--text-main)' }}>WT</strong> = TAT − BT |{' '}
          <strong style={{ color: 'var(--text-main)' }}>ค่าเฉลี่ย</strong> = ผลรวม ÷ จำนวนงาน ({n} งาน)
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>รหัสงาน</th>
              <th>รายละเอียดงาน / วิชา</th>
              <th style={{ textAlign: 'center' }}>AT (เวลามาถึง)</th>
              <th style={{ textAlign: 'center' }}>BT (ระยะเวลา)</th>
              <th style={{ textAlign: 'center' }}>CT (เวลาเสร็จ)</th>
              <th style={{ textAlign: 'center' }}>TAT (เวลารวม)</th>
              <th style={{ textAlign: 'center' }}>WT (เวลารอ)</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row) => (
              <tr key={row.id}>
                <td>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: `${row.color}22`,
                      color: row.color,
                      border: `1px solid ${row.color}55`,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700
                    }}
                  >
                    {row.id}
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>{row.name}</td>
                <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{row.at}</td>
                <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{row.bt}</td>
                <td style={{
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: 'var(--primary)'
                }}>
                  {row.ct}
                </td>
                <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                  {row.tat}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginLeft: 4 }}>
                    ({row.ct} − {row.at})
                  </span>
                </td>
                <td style={{
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: row.wt === 0 ? 'var(--emerald-accent)' : 'inherit'
                }}>
                  {row.wt}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginLeft: 4 }}>
                    ({row.tat} − {row.bt})
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5} style={{ textAlign: 'right', fontWeight: 700 }}>
                ผลรวมทั้งหมด:
              </td>
              <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                {totalTAT}
              </td>
              <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                {totalWT}
              </td>
            </tr>
            <tr>
              <td colSpan={5} style={{ textAlign: 'right', fontWeight: 800, color: 'var(--primary)' }}>
                ค่าเฉลี่ย (Average):
              </td>
              <td style={{
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                fontSize: '1rem',
                color: 'var(--cyan-accent)'
              }}>
                {avgTAT.toFixed(2)} หน่วย
                <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                  ({totalTAT}/{n})
                </div>
              </td>
              <td style={{
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                fontSize: '1rem',
                color: 'var(--emerald-accent)'
              }}>
                {avgWT.toFixed(2)} หน่วย
                <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                  ({totalWT}/{n})
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
