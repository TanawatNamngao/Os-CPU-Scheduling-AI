# เว็บการจัดตารางงานส่วนบุคคล ด้วย CPU Scheduling (FCFS, SJF, Round Robin)

> **มินิโปรเจ็ควิชาระบบปฏิบัติการ (Operating Systems Mini-Project)**  
> พัฒนาเว็บแอปพลิเคชันจำลองการจัดตารางเวลาของ CPU (CPU Scheduling) สำหรับการทำงานของนักศึกษา พร้อม Gantt Chart, ระบบคำนวณ CT / TAT / WT, โหมดจำลองทีละสเต็ป (Step-by-Step Queue Simulator), ระบบ Seed สำหรับสุ่มโจทย์ซ้ำได้ 100%, และฟังก์ชันพิมพ์ใบงานตามแบบฟอร์มส่งอาจารย์
>
> 🌐 **ลิงก์เข้าใช้งานจริงบน Vercel (Live URL):** [https://temporary-agile-hazel-4lk6bh0.vercel.app](https://temporary-agile-hazel-4lk6bh0.vercel.app)  
> 🔗 **ลิงก์ Claim เข้าบัญชี Vercel ถาวรของคุณ:** [คลิกที่นี่เพื่อ Claim เข้าบัญชีของคุณ](https://vercel.com/claim-deployment?code=ea96caa3-6193-4c22-b3f5-6a4b13b459ff)

---

## 📌 1. ภาพรวมและบริบทของโปรแกรม (Overview & Real-world Mapping)

โปรแกรมจำลองสถานการณ์ที่ **"นักศึกษาหนึ่งคน (Single Core CPU)"** ได้รับมอบหมายงานจากหลากหลายรายวิชา (Process) โดยสามารถทำงานได้ครั้งละ 1 ชิ้น และต้องตัดสินใจเลือกงานจากคิวที่พร้อมทำ (Ready Queue) ตามกติกาของ 3 อัลกอริทึมหลัก ได้แก่:
1. **FCFS (First-Come, First-Served):** ทำงานตามลำดับเวลาที่รับงานเข้ามาก่อน ทำจนเสร็จ
2. **SJF (Shortest Job First - Non-preemptive):** เลือกงานที่ใช้เวลาทำงานสั้นที่สุด (Burst Time น้อยที่สุด) จากงานที่พร้อมทำแล้ว
3. **Round Robin (RR):** สลับทำงานตามคิว FIFO รอบละไม่เกิน Time Quantum ($q$) ที่กำหนด

### ตารางเปรียบเทียบแนวคิดใน OS กับความหมายในชีวิตจริง

| แนวคิดใน OS | ความหมายในระบบจำลอง | รายละเอียดข้อกำหนด |
| :--- | :--- | :--- |
| **CPU หนึ่งคอร์** | นักศึกษา 1 คน | ทำงานได้ครั้งละหนึ่งงาน ไม่มี Multitasking พร้อมกัน |
| **Process** | งานหรือการบ้าน 1 ชิ้น | เช่น แบบฝึกหัด OS, รายงาน Database, สรุป English |
| **Arrival Time (AT)** | เวลาที่รับงานและพร้อมเริ่มทำ | จำนวนเต็ม $0–10$ โดย**ต้องมีอย่างน้อย 1 งานที่ $AT = 0$** |
| **Burst Time (BT)** | ระยะเวลาที่ต้องใช้ทำงานจริง | จำนวนเต็ม $1–8$ ชั่วโมง |
| **Ready Queue** | คิวงานที่มาถึงแล้วและยังไม่เสร็จ | คิวรอรับการประมวลผล |
| **Time Quantum (q)** | เวลาสูงสุดที่ได้ทำต่อรอบใน RR | จำนวนเต็ม $1–4$ ชั่วโมง |
| **Context Switch** | ต้นทุนการสลับงาน | กำหนดให้เป็นศูนย์ (0 Overhead) |

---

## 🧮 2. สูตรและกฎกติกาการคำนวณ (Formulas & Rules)

### กติกาการตัดสิน (Tie-breaking & Scheduling Rules)
1. **Tie-breaking เมื่อ AT เท่ากัน:** ให้เรียงตามเลขรหัส Process จากน้อยไปมาก ($P_1 < P_2 < \dots < P_n$)
2. **SJF:** เลือกงานที่มี $BT$ สั้นที่สุดในกลุ่มงานที่ $AT \le \text{Current Time}$ หาก $BT$ เท่ากัน ให้เลือกงานที่มี $AT$ มาก่อน หากยังเท่ากันให้เรียงตาม Process ID
3. **Round Robin Queue Rule (สำคัญมากตามหน้า 3 & 5):** 
   - เมื่อครบเวลา $q$ หากมีงานใหม่เข้ามาถึงในจังหวะเดียวกับที่งานเดิมหมดรอบพอดี **ให้นำงานใหม่เข้าคิวก่อนงานเดิมที่ถูกพัก**
   - งานเดิมที่ยังเหลือเศษ $BT > 0$ ให้นำกลับไปต่อท้ายคิว
   - หากงานเดิมทำเสร็จสิ้นพอดี ($BT = 0$) ไม่ต้องนำกลับเข้าคิว
4. **ช่วงว่างงาน (IDLE):** หากเวลาปัจจุบันยังไม่มีงานใดมาถึง ($AT > \text{Current Time}$) ระบบจะแสดงสถานะ **IDLE** ใน Gantt Chart จนกระทั่งถึงเวลาที่งานถัดไปมาถึง

### ตัวแปรผลลัพธ์และสูตรคำนวณ
- **CT (Completion Time):** เวลาที่งานนั้นทำเสร็จสมบูรณ์ ดูจากขอบขวาสุดของงานนั้นใน Gantt Chart
- **TAT (Turnaround Time):** เวลาทั้งหมดตั้งแต่รับงานจนทำเสร็จ $\Rightarrow \mathbf{TAT = CT - AT}$
- **WT (Waiting Time):** เวลารอทั้งหมดที่งานค้างอยู่ในคิว $\Rightarrow \mathbf{WT = TAT - BT}$
- **ค่าเฉลี่ย (Average):** ผลรวมของค่าทั้งหมด $\div$ จำนวนงาน (แสดงทศนิยม 2 ตำแหน่ง)

---

## 🚀 3. ฟีเจอร์เด่นของเว็บแอปพลิเคชัน

1. **ระบบ Seed ที่สามารถสุ่มซ้ำได้ 100% (PRNG):**
   - สามารถกด "สุ่มโจทย์ใหม่" หรือกรอก Seed เพื่อเรียกโจทย์เดิมกลับมาได้ทุกครั้ง
   - เหมาะสำหรับการนำ Seed ไปให้นักศึกษาคนอื่นหรืออาจารย์ใช้ตรวจสอบผลการคำนวณ
2. **โหมดฝึกคิดก่อนเปิดเฉลย (Hypothesis & Pre-calculation Flow):**
   - แสดงโจทย์งานและตารางเปล่าให้นักศึกษาลองจดไปคำนวณด้วยมือก่อน
   - มีแบบสอบถามสมมติฐานตามใบงานหน้า 6 เพื่อประเมินความเข้าใจก่อนกดปุ่มเปิดเฉลย
3. **Interactive Gantt Chart:**
   - แถบเวลาแสดงสัดส่วนถูกต้องตามความยาวจริง
   - มีเส้นและตัวเลขบอกขอบเวลาทุกจุด ($0, 2, 4, 5, 7, 9, 10, 11, \dots$)
   - ชี้เมาส์ (Hover) เพื่อดูรายละเอียดช่วงเวลา, ระยะเวลาทำงาน และเวลาคงเหลือ
4. **Step-by-Step Ready Queue Simulator (สำหรับ Round Robin):**
   - ปุ่ม Play / Pause / Next Step / Prev Step
   - แสดงสถานะของ Ready Queue ในแต่ละช่วงเวลาแบบสดๆ เห็นภาพว่างานไหนเข้าคิวก่อน-หลังชัดเจน
5. **ปุ่มโหลดกรณีทดสอบพิเศษ (ตามใบงานหน้า 10):**
   - กรณีงานมาพร้อมกันและ $BT$ เท่ากัน
   - กรณีมีช่วง Idle เว้นว่าง
   - กรณีงานใหม่เข้าตรงขอบเวลา $q$ และ $BT$ หาร $q$ ไม่ลงตัว
   - กรณีปฏิเสธข้อมูลผิดพลาด ($BT \le 0$ หรือ $q \le 0$)
6. **พิมพ์ใบงาน A4 สวยงาม (Print / Export PDF):**
   - มีปุ่ม "พิมพ์ใบงาน (Print)" ที่แปลงหน้าเว็บเป็นเอกสารรายงานสรุปมินิโปรเจ็ค A4 มีช่องกรอกข้อมูลนักศึกษา, ตารางคำนวณทั้ง 3 อัลกอริทึม, ตารางเปรียบเทียบ และช่องลงชื่อผู้ตรวจเรียบร้อย

---

## 🌐 4. คู่มือการ Deploy ขึ้น Vercel (Step-by-Step Deployment Guide)

เว็บนี้พัฒนาด้วย **Vite + React (Vanilla CSS)** พร้อมไฟล์ตั้งค่า `vercel.json` จึงสามารถ Deploy ขึ้น Vercel ได้อย่างรวดเร็วและฟรี 100% โดยเลือกทำได้ 2 วิธีดังนี้:

---

### วิธีที่ 1: Deploy ผ่าน GitHub (วิธีมาตรฐานและแนะนำที่สุด ⭐)

วิธีนี้สะดวกที่สุด เมื่อเราแก้ไขโค้ดและ `git push` ขึ้น GitHub เว็บไซต์บน Vercel จะอัปเดตให้อัตโนมัติทันที

#### ขั้นตอน:
1. **สร้าง Git Repository ในเครื่อง:**
   เปิด Terminal ในโฟลเดอร์โปรเจกต์ `c:\Users\next5\Desktop\OS PJ` แล้วรัน:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: OS CPU Scheduling Mini Project"
   ```

2. **Push โค้ดขึ้น GitHub:**
   - เข้าไปที่ [github.com](https://github.com) แล้วสร้าง Repository ใหม่ (เช่น `os-cpu-scheduling-web`)
   - นำคำสั่งจาก GitHub มารันเชื่อมต่อ เช่น:
     ```bash
     git remote add origin https://github.com/YOUR_USERNAME/os-cpu-scheduling-web.git
     git branch -M main
     git push -u origin main
     ```

3. **เชื่อมต่อกับ Vercel:**
   - เข้าสู่ระบบที่ [vercel.com](https://vercel.com) (สามารถ Login ด้วยบัญชี GitHub ได้)
   - คลิกปุ่ม **"Add New..."** $\to$ เลือก **"Project"**
   - ในหัวข้อ **"Import Git Repository"** ให้เลือก Repository `os-cpu-scheduling-web` ที่เพิ่ง Push ขึ้นไป แล้วกด **"Import"**

4. **ตรวจสอบการตั้งค่าโปรเจกต์ (Configure Project):**
   - **Framework Preset:** `Vite` (Vercel จะตรวจจับให้อัตโนมัติ)
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **กด Deploy:**
   - คลิกปุ่ม **"Deploy"**
   - รอ Vercel ทำการ Build ประมาณ 30–60 วินาที
   - เมื่อเสร็จสิ้น จะมีพลุเฉลิมฉลองและได้รับ URL ประจำเว็บ เช่น `https://os-cpu-scheduling-web.vercel.app` ซึ่งสามารถนำลิงก์นี้ไปส่งอาจารย์หรือเปิดใช้งานได้ทันที!

---

### วิธีที่ 2: Deploy ตรงจากเครื่องผ่าน Vercel CLI (ไม่ต้องสร้าง GitHub ก็ได้)

หากต้องการ Deploy ขึ้นเว็บทันทีโดยไม่ผ่าน Git:

#### ขั้นตอน:
1. **ติดตั้ง Vercel CLI ทั่วทั้งเครื่อง:**
   ```bash
   npm install -g vercel
   ```

2. **เข้าสู่ระบบ Vercel ผ่าน Terminal:**
   ```bash
   vercel login
   ```
   (ระบบจะเปิดเบราว์เซอร์ให้ยืนยันตัวตน หรือกรอกอีเมล)

3. **สั่ง Deploy โปรเจกต์:**
   อยู่ในโฟลเดอร์โปรเจกต์ `c:\Users\next5\Desktop\OS PJ` แล้วพิมพ์คำสั่ง:
   ```bash
   vercel
   ```
   ตอบคำถามบน Terminal:
   - *Set up and deploy?* $\to$ พิมพ์ `y`
   - *Which scope do you want to deploy to?* $\to$ กด Enter เลือก Account ของคุณ
   - *Link to existing project?* $\to$ พิมพ์ `n`
   - *What's your project's name?* $\to$ ตั้งชื่อ เช่น `os-scheduling-sim`
   - *In which directory is your code located?* $\to$ กด Enter (`./`)
   - *Want to modify these settings?* $\to$ พิมพ์ `n` (เพราะใน `vercel.json` ตั้งค่าไว้สมบูรณ์แล้ว)

4. **Deploy ขึ้น Production:**
   ```bash
   vercel --prod
   ```
   คุณจะได้รับ Production URL (เช่น `https://os-scheduling-sim.vercel.app`) พร้อมใช้งานทันที

---

## 🛠️ 5. คำสั่งสำหรับการพัฒนาบนเครื่องตนเอง (Local Development)

```bash
# ติดตั้ง dependencies
npm install

# รัน Development Server (เปิดดูบนเครื่องที่ http://localhost:5173)
npm run dev

# ทดสอบ Build ตรวจสอบความถูกต้องก่อน Deploy
npm run build

# ทดสอบรัน Production Bundle บนเครื่อง
npm run preview
```

---

## 📋 6. สรุปผลการทดสอบกับตัวอย่างในใบงาน (Verification Proof)

ชุดข้อมูลตัวอย่างในใบงานหน้า 4–5:
- **$P_1$:** $AT = 0, BT = 5$ (แบบฝึกหัด OS)
- **$P_2$:** $AT = 1, BT = 3$ (รายงาน Database)
- **$P_3$:** $AT = 2, BT = 1$ (สรุป English)
- **$P_4$:** $AT = 4, BT = 2$ (แบบฝึกหัด Math)
- **Time Quantum ($q$):** $2$

| อัลกอริทึม | ลำดับการทำงาน (Gantt Chart Timeline) | TAT เฉลี่ย (โปรแกรม) | TAT เฉลี่ย (ในเอกสาร) | WT เฉลี่ย (โปรแกรม) | WT เฉลี่ย (ในเอกสาร) | สถานะ |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **FCFS** | $P_1(0–5) \to P_2(5–8) \to P_3(8–9) \to P_4(9–11)$ | **6.50** | 6.50 | **3.75** | 3.75 | ✅ ตรงกัน 100% |
| **SJF** | $P_1(0–5) \to P_3(5–6) \to P_4(6–8) \to P_2(8–11)$ | **5.75** | 5.75 | **3.00** | 3.00 | ✅ ตรงกัน 100% |
| **Round Robin** | $P_1(0–2) \to P_2(2–4) \to P_3(4–5) \to P_1(5–7) \to P_4(7–9) \to P_2(9–10) \to P_1(10–11)$ | **7.00** | 7.00 | **4.25** | 4.25 | ✅ ตรงกัน 100% |

---
พัฒนาขึ้นด้วยความประณีต ถูกต้องตามทฤษฎีและข้อกำหนดวิชาระบบปฏิบัติการทุกประการ 🚀
