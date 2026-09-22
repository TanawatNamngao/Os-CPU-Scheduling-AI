import { PROCESS_COLORS } from './prng.js';

export const PRESET_DATASETS = [
  {
    id: 'worksheet_example',
    title: 'ตัวอย่างในใบงาน (หน้า 4–5)',
    description: 'โจทย์มาตรฐาน 4 งาน ใช้ฝึกคิดและตรวจเทียบกับเฉลยในเอกสาร',
    seed: 'DEMO-OS-2024',
    q: 2,
    tasks: [
      { id: 'P1', name: 'แบบฝึกหัด OS', at: 0, bt: 5, color: PROCESS_COLORS[0] },
      { id: 'P2', name: 'รายงาน Database', at: 1, bt: 3, color: PROCESS_COLORS[1] },
      { id: 'P3', name: 'สรุป English', at: 2, bt: 1, color: PROCESS_COLORS[2] },
      { id: 'P4', name: 'แบบฝึกหัด Math', at: 4, bt: 2, color: PROCESS_COLORS[3] },
    ]
  },
  {
    id: 'test_equal_at_bt',
    title: 'กรณีทดสอบ 1: งานมาพร้อมกัน และ BT เท่ากัน',
    description: 'ทดสอบ Tie-breaking เรียงตาม Process ID เมื่อ AT และ BT เท่ากัน (หน้า 10)',
    seed: 'TEST-EQUAL-01',
    q: 2,
    tasks: [
      { id: 'P1', name: 'แบบฝึกหัด OS', at: 0, bt: 3, color: PROCESS_COLORS[0] },
      { id: 'P2', name: 'รายงาน Database', at: 0, bt: 3, color: PROCESS_COLORS[1] },
      { id: 'P3', name: 'สรุป English', at: 2, bt: 4, color: PROCESS_COLORS[2] },
      { id: 'P4', name: 'แบบฝึกหัด Math', at: 2, bt: 4, color: PROCESS_COLORS[3] },
      { id: 'P5', name: 'โครงงาน AI', at: 5, bt: 2, color: PROCESS_COLORS[4] },
    ]
  },
  {
    id: 'test_idle_period',
    title: 'กรณีทดสอบ 2: มีช่วง Idle (ว่างงาน)',
    description: 'งานแรก AT=0, BT=1 จากนั้นงานสองมาที่ AT=5 ทำให้เกิดช่วง Idle 1–5 (หน้า 10)',
    seed: 'TEST-IDLE-02',
    q: 2,
    tasks: [
      { id: 'P1', name: 'แบบฝึกหัด OS', at: 0, bt: 1, color: PROCESS_COLORS[0] },
      { id: 'P2', name: 'รายงาน Database', at: 5, bt: 3, color: PROCESS_COLORS[1] },
      { id: 'P3', name: 'สรุป English', at: 6, bt: 2, color: PROCESS_COLORS[2] },
      { id: 'P4', name: 'แบบฝึกหัด Math', at: 8, bt: 4, color: PROCESS_COLORS[3] },
      { id: 'P5', name: 'การบ้าน Network', at: 9, bt: 2, color: PROCESS_COLORS[4] },
    ]
  },
  {
    id: 'test_boundary_arrival',
    title: 'กรณีทดสอบ 3: งานใหม่เข้าตรงขอบ q และ BT หารไม่ลงตัว',
    description: 'ทดสอบกติกานำงานใหม่เข้าคิวก่อนงานเดิมที่ยังเหลือเศษ BT (หน้า 10)',
    seed: 'TEST-BOUND-03',
    q: 2,
    tasks: [
      { id: 'P1', name: 'แบบฝึกหัด OS', at: 0, bt: 5, color: PROCESS_COLORS[0] },
      { id: 'P2', name: 'รายงาน Database', at: 2, bt: 3, color: PROCESS_COLORS[1] },
      { id: 'P3', name: 'สรุป English', at: 4, bt: 1, color: PROCESS_COLORS[2] },
      { id: 'P4', name: 'แบบฝึกหัด Math', at: 6, bt: 5, color: PROCESS_COLORS[3] },
      { id: 'P5', name: 'โครงงาน AI', at: 8, bt: 3, color: PROCESS_COLORS[4] },
    ]
  },
  {
    id: 'test_full_6_tasks',
    title: 'กรณีทดสอบ 4: สุ่มครบ 6 งาน (P1–P6)',
    description: 'ชุดงาน 6 ชิ้นตามข้อกำหนดใบงานสุ่มเต็มพิกัด',
    seed: 'SEED-FULL-06',
    q: 3,
    tasks: [
      { id: 'P1', name: 'แบบฝึกหัด OS', at: 0, bt: 6, color: PROCESS_COLORS[0] },
      { id: 'P2', name: 'รายงาน Database', at: 2, bt: 4, color: PROCESS_COLORS[1] },
      { id: 'P3', name: 'สรุป English', at: 3, bt: 2, color: PROCESS_COLORS[2] },
      { id: 'P4', name: 'แบบฝึกหัด Math', at: 5, bt: 7, color: PROCESS_COLORS[3] },
      { id: 'P5', name: 'โครงงาน AI', at: 7, bt: 3, color: PROCESS_COLORS[4] },
      { id: 'P6', name: 'แล็บ Data Structure', at: 9, bt: 1, color: PROCESS_COLORS[5] },
    ]
  }
];
