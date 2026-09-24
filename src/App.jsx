import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header.jsx';
import ControlPanel from './components/ControlPanel.jsx';
import TaskTable from './components/TaskTable.jsx';
import HypothesisCard from './components/HypothesisCard.jsx';
import GanttChart from './components/GanttChart.jsx';
import ResultTable from './components/ResultTable.jsx';
import StepSimulator from './components/StepSimulator.jsx';
import ComparisonView from './components/ComparisonView.jsx';
import StudentInfoModal from './components/StudentInfoModal.jsx';
import TestCasesModal from './components/TestCasesModal.jsx';
import WorksheetModal from './components/WorksheetModal.jsx';
import SavedDatasetsModal from './components/SavedDatasetsModal.jsx';

import { generateRandomTaskSet } from './algorithms/prng.js';
import { runFCFS } from './algorithms/fcfs.js';
import { runSJF } from './algorithms/sjf.js';
import { runRoundRobin } from './algorithms/roundRobin.js';
import { PRESET_DATASETS } from './algorithms/presets.js';

import { Layers, CheckCircle2, AlertCircle, BarChart3, Clock, Sparkles } from 'lucide-react';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('os_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('os_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Student Info state
  const [studentInfo, setStudentInfo] = useState(() => {
    const saved = localStorage.getItem('os_student_info');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return {
      fullName: '',
      studentId: '',
      section: '',
      teamMembers: '',
      testDate: new Date().toISOString().split('T')[0],
      instructor: ''
    };
  });

  const handleSaveStudentInfo = (info) => {
    setStudentInfo(info);
    localStorage.setItem('os_student_info', JSON.stringify(info));
  };

  // Seed and Task state
  const [seed, setSeed] = useState('DEMO-OS-2024');
  const [taskCount, setTaskCount] = useState(4); // Default to worksheet example (4 tasks) or 5-6
  const [quantum, setQuantum] = useState(2);
  const [baseTime, setBaseTime] = useState('09:00 วันจันทร์');
  const [tasks, setTasks] = useState(() => PRESET_DATASETS[0].tasks);

  // Hypothesis & Pre-reveal state
  const [isRevealed, setIsRevealed] = useState(true);
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [selectedAlgoTab, setSelectedAlgoTab] = useState('all');

  // Modals state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isTestCasesModalOpen, setIsTestCasesModalOpen] = useState(false);
  const [isWorksheetModalOpen, setIsWorksheetModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Requirement 4: Record Seed, parameters, and actual dataset to reproduce problems
  const [savedDatasets, setSavedDatasets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('os_saved_datasets') || '[]');
    } catch {
      return [];
    }
  });

  const handleSaveCurrentDataset = () => {
    const newItem = {
      id: 'DATASET-' + Date.now(),
      savedAt: new Date().toLocaleString('th-TH'),
      seed,
      quantum,
      baseTime,
      taskCount: tasks.length,
      tasks: JSON.parse(JSON.stringify(tasks))
    };
    const updated = [newItem, ...savedDatasets.filter(d => d.seed !== seed)].slice(0, 20);
    setSavedDatasets(updated);
    localStorage.setItem('os_saved_datasets', JSON.stringify(updated));
    alert(`✅ บันทึก Seed "${seed}" และชุดข้อมูล (${tasks.length} งาน, q=${quantum}) เรียบร้อยแล้ว!`);
  };

  const handleRecallDataset = (dataset) => {
    setSeed(dataset.seed);
    setQuantum(dataset.quantum);
    setBaseTime(dataset.baseTime || '09:00 วันจันทร์');
    setTasks(dataset.tasks);
    setTaskCount(dataset.tasks.length);
    setValidationError(null);
  };

  const handleDeleteSavedDataset = (id) => {
    const updated = savedDatasets.filter(d => d.id !== id);
    setSavedDatasets(updated);
    localStorage.setItem('os_saved_datasets', JSON.stringify(updated));
  };

  const handleExportJSON = () => {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      seed,
      quantum,
      baseTime,
      tasks
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    alert('📋 คัดลอกข้อมูลโจทย์ (JSON) ลงในคลิปบอร์ดแล้ว! สามารถนำไปบันทึกหรือเปิดในโปรแกรมรุ่นเดียวกันได้ทันที');
  };

  const handleImportJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.tasks || !Array.isArray(parsed.tasks) || parsed.tasks.length < 2) {
        throw new Error('รูปแบบ JSON ไม่ถูกต้อง: ต้องมี tasks เป็น Array อย่างน้อย 2 งาน');
      }
      setSeed(parsed.seed || ('IMPORT-' + Math.floor(Math.random() * 10000)));
      if (parsed.quantum && parsed.quantum >= 1 && parsed.quantum <= 4) {
        setQuantum(parsed.quantum);
      }
      if (parsed.baseTime) setBaseTime(parsed.baseTime);
      setTasks(parsed.tasks);
      setTaskCount(parsed.tasks.length);
      setValidationError(null);
      alert(`✅ นำเข้าโจทย์เดิมสำเร็จ (${parsed.tasks.length} งาน, q = ${parsed.quantum || quantum})`);
    } catch (err) {
      alert('❌ ไม่สามารถนำเข้าข้อมูลได้: ' + err.message);
    }
  };

  const [hypothesis, setHypothesis] = useState({
    lowestWTAlgo: 'SJF',
    lowestWTReason: 'เพราะเลือกงานที่ใช้เวลาสั้นทำก่อน ทำให้งานจำนวนมากเสร็จสิ้นเร็วขึ้น',
    longestWaitTask: 'P2',
    longestWaitReason: 'เพราะมี Burst Time นานและถูกแทรกโดยงานที่สั้นกว่า',
    qChangeEffect: 'ถ้าเพิ่มค่า q ลำดับงานจะใกล้เคียงกับ FCFS มากขึ้น และการสลับงานจะลดลง'
  });

  const handleUpdateHypothesis = (field, val) => {
    setHypothesis(prev => ({ ...prev, [field]: val }));
  };

  // Requirement 1: Randomize 5-6 tasks from course names with unique IDs P1..Pn
  // Requirement 5: Show problem before revealing answer
  const handleRandomize = () => {
    const newSeed = 'SEED-' + Math.floor(Math.random() * 900000 + 100000);
    setSeed(newSeed);
    const count = Math.random() < 0.5 ? 5 : 6; // randomly 5 or 6 tasks
    setTaskCount(count);
    const generated = generateRandomTaskSet(newSeed, count);
    setTasks(generated.tasks);
    setQuantum(generated.q);
    setValidationError(null);
    setIsRevealed(false); // Requirement 5: show problem first, user clicks to reveal answer
  };

  // Function to load a specific seed
  const handleSetSeed = (newSeed) => {
    setSeed(newSeed);
    const generated = generateRandomTaskSet(newSeed, taskCount);
    setTasks(generated.tasks);
    setQuantum(generated.q);
    setValidationError(null);
  };

  // Function to load a preset
  const handleSelectPreset = (preset) => {
    setSeed(preset.seed);
    setQuantum(preset.q);
    setTasks(preset.tasks);
    setTaskCount(preset.tasks.length);
    setValidationError(null);
    setIsRevealed(true);
  };

  // Trigger test case 4: invalid input demonstration
  const handleTriggerInvalidTest = () => {
    setValidationError('ตรวจพบข้อผิดพลาด: Burst Time (BT) ต้องเป็นจำนวนเต็ม > 0 และ Quantum (q) ต้องอยู่ในช่วง 1–4');
  };

  // Run Scheduling Calculations (Memoized for peak performance)
  const fcfsResult = useMemo(() => runFCFS(tasks), [tasks]);
  const sjfResult = useMemo(() => runSJF(tasks), [tasks]);
  const rrResult = useMemo(() => runRoundRobin(tasks, quantum), [tasks, quantum]);

  return (
    <div className="app-container">
      {/* Header */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        studentInfo={studentInfo}
        onOpenStudentModal={() => setIsStudentModalOpen(true)}
        onOpenTestCases={() => setIsTestCasesModalOpen(true)}
        onOpenWorksheet={() => setIsWorksheetModalOpen(true)}
      />

      {/* Control Panel */}
      <ControlPanel
        seed={seed}
        onRandomize={handleRandomize}
        onSetSeed={handleSetSeed}
        taskCount={taskCount}
        onSetTaskCount={(num) => {
          setTaskCount(num);
          const gen = generateRandomTaskSet(seed, num);
          setTasks(gen.tasks);
        }}
        quantum={quantum}
        onSetQuantum={setQuantum}
        baseTime={baseTime}
        onSetBaseTime={setBaseTime}
        onSelectPreset={handleSelectPreset}
        validationError={validationError}
        onOpenSavedDatasets={() => setIsSavedModalOpen(true)}
        savedDatasetsCount={savedDatasets.length}
        onSaveCurrent={handleSaveCurrentDataset}
      />

      {/* Task & Process List Table */}
      <TaskTable
        tasks={tasks}
        onUpdateTasks={setTasks}
        baseTime={baseTime}
        isManualEdit={isManualEdit}
        setIsManualEdit={setIsManualEdit}
      />

      {/* Hypothesis & Pre-reveal Flow */}
      <HypothesisCard
        isRevealed={isRevealed}
        onToggleReveal={setIsRevealed}
        hypothesis={hypothesis}
        onUpdateHypothesis={handleUpdateHypothesis}
        tasks={tasks}
      />

      {/* Solution Section (Shown when revealed) */}
      {isRevealed ? (
        <div>
          {/* Algorithm Selection Tabs */}
          <div className="algo-tabs">
            <button
              className={`algo-tab ${selectedAlgoTab === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedAlgoTab('all')}
            >
              <Layers size={17} />
              <span>เปรียบเทียบทั้ง 3 อัลกอริทึม (Overview)</span>
            </button>
            <button
              className={`algo-tab ${selectedAlgoTab === 'fcfs' ? 'active' : ''}`}
              onClick={() => setSelectedAlgoTab('fcfs')}
            >
              <span>FCFS (First-Come First-Served)</span>
            </button>
            <button
              className={`algo-tab ${selectedAlgoTab === 'sjf' ? 'active' : ''}`}
              onClick={() => setSelectedAlgoTab('sjf')}
            >
              <span>SJF (Shortest Job First)</span>
            </button>
            <button
              className={`algo-tab ${selectedAlgoTab === 'rr' ? 'active' : ''}`}
              onClick={() => setSelectedAlgoTab('rr')}
            >
              <span>Round Robin (q = {quantum})</span>
            </button>
          </div>

          {/* Tab 1: Overview - All 3 Side by Side */}
          {selectedAlgoTab === 'all' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Gantt Charts for all 3 */}
              <div className="card">
                <div className="card-header">
                  <div>
                    <div className="card-title">
                      <BarChart3 size={20} color="var(--primary)" />
                      <span>เปรียบเทียบ Gantt Chart ของทั้ง 3 อัลกอริทึม</span>
                    </div>
                    <p className="card-subtitle">
                      สังเกตลำดับการทำงานและช่วงเวลาที่แตกต่างกันภายใต้ข้อมูลชุดเดียวกัน
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ background: 'var(--bg-input)', padding: '14px 18px', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontWeight: 700, color: '#6366f1', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                      <span>1. FCFS (First-Come First-Served)</span>
                      <span>Avg WT: {fcfsResult.avgWT.toFixed(2)} ชม. | Avg TAT: {fcfsResult.avgTAT.toFixed(2)} ชม.</span>
                    </div>
                    <GanttChart timeline={fcfsResult.timeline} title="Gantt Chart: FCFS" />
                  </div>

                  <div style={{ background: 'var(--bg-input)', padding: '14px 18px', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontWeight: 700, color: '#10b981', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                      <span>2. SJF (Shortest Job First - Non-preemptive)</span>
                      <span>Avg WT: {sjfResult.avgWT.toFixed(2)} ชม. | Avg TAT: {sjfResult.avgTAT.toFixed(2)} ชม.</span>
                    </div>
                    <GanttChart timeline={sjfResult.timeline} title="Gantt Chart: SJF" />
                  </div>

                  <div style={{ background: 'var(--bg-input)', padding: '14px 18px', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontWeight: 700, color: '#f59e0b', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                      <span>3. Round Robin (Time Quantum q = {quantum})</span>
                      <span>Avg WT: {rrResult.avgWT.toFixed(2)} ชม. | Avg TAT: {rrResult.avgTAT.toFixed(2)} ชม.</span>
                    </div>
                    <GanttChart timeline={rrResult.timeline} title={`Gantt Chart: Round Robin (q=${quantum})`} />
                  </div>
                </div>
              </div>

              {/* Comparison Summary & Bar Charts */}
              <ComparisonView
                fcfs={fcfsResult}
                sjf={sjfResult}
                rr={rrResult}
              />
            </div>
          )}

          {/* Tab 2: FCFS Detail */}
          {selectedAlgoTab === 'fcfs' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">
                    <span style={{ color: '#6366f1' }}>FCFS</span>
                    <span>: First-Come, First-Served</span>
                  </div>
                  <p className="card-subtitle">
                    ทำงานตามลำดับ Arrival Time (AT) ที่มาถึงก่อน และทำจนกว่าจะเสร็จสมบูรณ์ (Non-preemptive)
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="badge badge-primary">WT เฉลี่ย: {fcfsResult.avgWT.toFixed(2)}</span>
                  <span className="badge badge-success">TAT เฉลี่ย: {fcfsResult.avgTAT.toFixed(2)}</span>
                </div>
              </div>

              <GanttChart timeline={fcfsResult.timeline} title="Gantt Chart: FCFS" />

              <ResultTable
                results={fcfsResult.results}
                avgTAT={fcfsResult.avgTAT}
                avgWT={fcfsResult.avgWT}
                totalTAT={fcfsResult.totalTAT}
                totalWT={fcfsResult.totalWT}
              />
            </div>
          )}

          {/* Tab 3: SJF Detail */}
          {selectedAlgoTab === 'sjf' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">
                    <span style={{ color: '#10b981' }}>SJF</span>
                    <span>: Shortest Job First (Non-preemptive)</span>
                  </div>
                  <p className="card-subtitle">
                    เมื่อ CPU ว่าง จะเลือกงานที่ใช้เวลาสั้นที่สุด (Burst Time น้อยสุด) จากงานที่มาถึงแล้ว (AT ≤ เวลาปัจจุบัน)
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="badge badge-primary">WT เฉลี่ย: {sjfResult.avgWT.toFixed(2)}</span>
                  <span className="badge badge-success">TAT เฉลี่ย: {sjfResult.avgTAT.toFixed(2)}</span>
                </div>
              </div>

              <GanttChart timeline={sjfResult.timeline} title="Gantt Chart: SJF" />

              <ResultTable
                results={sjfResult.results}
                avgTAT={sjfResult.avgTAT}
                avgWT={sjfResult.avgWT}
                totalTAT={sjfResult.totalTAT}
                totalWT={sjfResult.totalWT}
              />
            </div>
          )}

          {/* Tab 4: Round Robin Detail */}
          {selectedAlgoTab === 'rr' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">
                    <span style={{ color: '#f59e0b' }}>Round Robin</span>
                    <span>: Time Quantum q = {quantum}</span>
                  </div>
                  <p className="card-subtitle">
                    ใช้คิว FIFO สลับทำงานรอบละไม่เกิน {quantum} หน่วยเวลา หากมีงานใหม่เข้าตรงขอบเวลา ให้งานใหม่เข้าคิวก่อนงานเดิมที่ถูกพัก
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="badge badge-primary">WT เฉลี่ย: {rrResult.avgWT.toFixed(2)}</span>
                  <span className="badge badge-success">TAT เฉลี่ย: {rrResult.avgTAT.toFixed(2)}</span>
                </div>
              </div>

              <GanttChart timeline={rrResult.timeline} title={`Gantt Chart: Round Robin (q=${quantum})`} />

              <ResultTable
                results={rrResult.results}
                avgTAT={rrResult.avgTAT}
                avgWT={rrResult.avgWT}
                totalTAT={rrResult.totalTAT}
                totalWT={rrResult.totalWT}
              />

              {/* Step-by-Step Simulator for RR */}
              <StepSimulator steps={rrResult.steps} quantum={quantum} />
            </div>
          )}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '48px 24px',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--border-color)'
        }}>
          <Clock size={42} color="var(--primary)" style={{ opacity: 0.8, marginBottom: 12 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>ผลเฉลยถูกซ่อนอยู่</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '8px auto 20px auto', fontSize: '0.9rem' }}>
            ให้นักศึกษาจดตัวเลขจากตารางโจทย์ด้านบน แล้วคำนวณวาด Gantt Chart ด้วยมือลงในกระดาษก่อน จากนั้นกดปุ่มเปิดเฉลยเพื่อตรวจเทียบผลลัพธ์
          </p>
          <button className="btn btn-primary" onClick={() => setIsRevealed(true)}>
            <Sparkles size={18} />
            <span>เปิดเฉลยผลลัพธ์การจำลอง</span>
          </button>
        </div>
      )}

      {/* Modals */}
      <StudentInfoModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        studentInfo={studentInfo}
        onSave={handleSaveStudentInfo}
      />

      <TestCasesModal
        isOpen={isTestCasesModalOpen}
        onClose={() => setIsTestCasesModalOpen(false)}
        onLoadPreset={handleSelectPreset}
        onTriggerInvalidTest={handleTriggerInvalidTest}
      />

      <WorksheetModal
        isOpen={isWorksheetModalOpen}
        onClose={() => setIsWorksheetModalOpen(false)}
        studentInfo={studentInfo}
        seed={seed}
        quantum={quantum}
        baseTime={baseTime}
        tasks={tasks}
        hypothesis={hypothesis}
        fcfs={fcfsResult}
        sjf={sjfResult}
        rr={rrResult}
      />

      <SavedDatasetsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedDatasets={savedDatasets}
        onSaveCurrent={handleSaveCurrentDataset}
        onRecall={handleRecallDataset}
        onDeleteSaved={handleDeleteSavedDataset}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        currentSeed={seed}
        currentQ={quantum}
        currentTasksCount={tasks.length}
      />

      {/* Footer */}
      <footer style={{
        marginTop: 48,
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-subtle)',
        borderTop: '1px solid var(--border-color)',
        paddingTop: 24
      }}>
        <div>
          เว็บการจัดตารางงานส่วนบุคคล ด้วย CPU Scheduling (FCFS, SJF, Round Robin)
        </div>
        <div style={{ marginTop: 4, fontSize: '0.78rem' }}>
          พัฒนาสำหรับมินิโปรเจ็ควิชาระบบปฏิบัติการ (Operating Systems) • รองรับการ Deploy บน Vercel 100%
        </div>
      </footer>
    </div>
  );
}
