# QuantixAI: Technical Architecture & Collaboration Guide

## 🚀 Project Overview: What is QuantixAI?

**QuantixAI** is a cutting-edge, end-to-end Recruitment Automation Platform. It is designed to replace traditional, manual screening processes with a high-integrity, AI-driven workflow. The platform handles everything from the moment a recruiter uploads a list of resumes to the final "Hire/Reject" recommendation.

### Core Functionality
1.  **AI Resume Intelligence**: The system parses raw PDF resumes using `pdf-parse` and analyzes them against job requirements using **Google Gemini AI**. It extracts skills, experience levels, and suitability scores.
2.  **Automated Orchestration**: Once a candidate is screened, the system handles formal invitations. It generates secure, tokenized interview links and sends them to candidates via **Resend**.
3.  **Live Virtual Interviewer**: The heart of the app is a real-time, voice-enabled AI agent. Candidates engage in a natural conversation with Gemini, which asks technical and behavioral questions tailored to their specific background.
4.  **AI Integrity & Proctoring**: To ensure high-stakes reliability, the app uses **TensorFlow.js (COCO-SSD)** to monitor the candidate's camera. It detects multiple people or suspicious eye movements, automatically issuing warnings or terminating sessions to prevent cheating.
5.  **HR Intelligence Reports**: Immediately after a session, the system analyzes the entire transcript. It provides the HR team with a comprehensive HTML report including competency scores (1-10), strengths, areas for improvement, and a final AI recommendation.

---

## 📂 Project Directory & File Mapping

Here is the complete project structure and how it is assigned to each member for development.

```text
QuantixAI/
├── app/
│   ├── api/
│   │   ├── analyze-and-submit/      ── (M4: Final Report Logic)
│   │   ├── generate-quiz/           ── (M3: Prompting & Data)
│   │   ├── interview/
│   │   │   ├── chat/                ── (M3: AI Chat Brain)
│   │   │   ├── start-from-form/     ── (M3: Setup via Metadata)
│   │   │   └── start-from-resume/   ── (M3: Setup via PDF)
│   │   ├── interview-details/
│   │   │   └── [token]/             ── (M2: Live Room Data)
│   │   ├── process-answer/          ── (M3: AI Processing)
│   │   ├── schedule/                ── (M4: HR Email Automations)
│   │   ├── screen-resume/           ── (M3: PDF AI Analysis)
│   │   └── verify-answer/           ── (M2: Security Logic)
│   ├── auth/                        ── (M1: Gateway)
│   │   ├── login/
│   │   └── signup/
│   ├── components/                  ── (M1: Design System)
│   │   └── layout/                  ── (Navbar, Footer)
│   ├── dashboard/                   ── (M2: Core Room)
│   │   └── _components/             ── (Stats & User UI)
│   ├── home/                        ── (M1: Gateway)
│   │   └── _components/             ── (Hero, Features, Pricing)
│   ├── hooks/                       ── (M2: Custom hooks like useSpeech)
│   ├── hr/                          ── (M4: Orchestrator)
│   │   └── schedule/                ── (Recruiter Calendar)
│   ├── interview/                   ── (M2: Core Room)
│   │   ├── [token]/                 ── (Live Room Page)
│   │   └── practice/                ── (Testing Area)
│   │       └── _components/         ── (AI Chat UI, Camera logic)
│   ├── utils/                       ── (M3: AI Helpers like TTS)
│   ├── globals.css                  ── (M1: Global Styling)
│   ├── layout.js                    ── (M1: Main Wrapper)
│   └── page.js                      ── (M1: Root Landing Page)
├── components/                      ── (M1: Shared Layouts & UI)
├── lib/                             ── (M4: Supabase & Utilities)
├── public/                          ── (M1: Assets & 3D Models)
├── middleware.js                    ── (M4: Auth Guard)
├── questions.js                     ── (M3: Training Data)
├── data.json                        ── (M3: Mock Content)
├── components.json                  ── (M1: UI Config)
├── tailwind.config.mjs              ── (M1: Styling Config)
└── .env.local                       ── (M4: Keys & Secrets)
```

---

## 🏗️ 1. The Gateway (Member 1: UX/UI Specialist)

Member 1 owns the **visual language** and the **user journey** from landing to the dashboard.

### 💻 Technical Deep-Dive
- **Animation Engine**: Uses `framer-motion` (e.g., `<motion.div>`) to create entry animations. This makes the landing page feel premium and "alive."
- **Navigation Logic**: The `Navbar` uses Next.js `Link` for instant page transitions. It checks for active routes to highlight the current section.
- **Styling**: Manages `tailwind.config.mjs`. Use of HSL colors for dynamic themes and "glassmorphism" (backdrop-blur) in the navigation.

### 🔄 The Flow
1. User lands on `app/page.js`.
2. `HeroSection.jsx` triggers a 3D animation (Three.js/Fiber) to wow the user.
3. User interacts with `FAQSection.jsx` or `PricingSection.jsx`.
4. User clicks "Login," routing them to `app/auth/login`.

---

## 🎮 2. The Core (Member 2: Interview Engine)

Member 2 owns the **State Machine** of the interview. This is the most complex frontend logic in the project.

### 💻 Technical Deep-Dive
- **State Machine**: Uses a `step` state in `app/interview/[token]/page.jsx`.
  - `loading` ➡️ `upload` (Resume) ➡️ `lobby` (Verification) ➡️ `interview` (Live).
- **Proctoring Loop**: Located in `InterviewScreen.jsx`.
  - **Setup**: `useEffect` runs once to load the **TensorFlow COCO-SSD** model and start the webcam.
  - **The Loop**: `setInterval` runs every 4 seconds, analyzing the video frame (`videoRef.current`).
  - **Logic**: If `personCount !== 1`, it increments a `violations` state. If `violations >= 5`, the interview is auto-terminated.

### 🔄 The Flow
1. Fetches interview metadata from `api/interview-details/[token]`.
2. Renders `ResumeUpload` component. Once uploaded, calls Member 3's logic to pre-analyze the candidate.
3. Transitions to `InterviewScreen`, starting the Voice-to-Voice dialogue.

---

## 🧠 3. The Brain (Member 3: AI Intelligence)

Member 3 owns the **Prompt Engineering** and the **AI personality**.

### 💻 Technical Deep-Dive
- **Prompt Injection**: In `api/interview/chat/route.js`, the code constructs a `systemPrompt`. It injects `userData` (job title, experience) into a template literal so Gemini "knows" who it is talking to.
- **Dynamic Quiz**: `api/generate-quiz` analyzes the candidate's resume keywords and creates JSON-based questions.
- **Speech Integration**:
  - **Input**: Uses `useSpeechRecognition.js` (Member 2's components call this) to convert candidate voice to text.
  - **Output**: Uses a `tts.js` utility (Text-to-Speech) to make Gemini "speak" back to the candidate.

### 🔄 The Flow
1. Receives `{ message, history, userData }` from Member 2.
2. Calls `model.generateContent(systemPrompt)`.
3. Returns the `reply` text, which Member 2's UI then displays and "speaks."

---

## 📊 4. The Orchestrator (Member 4: Data & HR)

Member 4 owns the **API Lifecycle** and the **Database**. They are the "Glue" that makes everything persistent.

### 💻 Technical Deep-Dive
- **Database Schema**: Manages the `interviews` table in Supabase.
- **Reporting Engine**: In `api/analyze-and-submit`.
  - It gathers the full `conversation` array from Member 2.
  - It asks Gemini to "Score" the candidate from 1-10 on Communication and Technical skills.
  - It uses **Resend** to send a beautifully formatted HTML email to the HR manager.
- **Middleware**: `middleware.js` acts as a gatekeeper. It checks for session cookies and redirects unauthenticated users away from private `/hr` and `/dashboard` routes.

### 🔄 The Flow
1. **Initial**: Member 4's `api/schedule` creates a row in Supabase and sends the first "Invite" email.
2. **Intermediate**: All state changes (status = 'started', 'completed') are written back to Supabase.
3. **Closing**: Once Member 2 calls "Submit," Member 4 triggers the AI evaluation and updates the HR Dashboard (`app/hr/page.jsx`).

---

## 🗺️ Master Code Flow Legend

| Step | Action | Origin (Member) | Destination (Member) | Logic |
| :--- | :--- | :--- | :--- | :--- |
| **1** | User Land | Member 1 | - | Landing Page UI |
| **2** | HR Invitation | Member 4 | Member 3 | Create record + Generate Token |
| **3** | Candidate Enter | Member 2 | Member 4 | Token Validation via API |
| **4** | Real-time Chat | Member 2 | Member 3 | JSON POST ➡️ AI Reply ➡️ TTS |
| **5** | Proctoring | Member 2 | - | TensorFlow.js Loop |
| **6** | Submit & Score | Member 2 | Member 4 ➡️ Member 3 | AI Summary ➡️ Email Notification |
| **7** | Review | Member 4 | - | HR Portal Dashboard |
