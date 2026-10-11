This document provides a comprehensive guide to the codebase of Quantix AI, explaining the purpose of each directory, primary file, and the use of sub-components in the Interview Engine.

---

## 📂 1. Folder Structure Deep Dive

Below is the recursive breakdown of the project directory and the functional responsibility of each sub-folder.

### `app/` (The Application Layer)
All routing and server-side logic resides here following the Next.js App Router pattern.

| Folder | Purpose |
| :--- | :--- |
| **`app/api/`** | **The Serverless Backend.** Contains all POST/GET endpoints for AI, Database, and Auth logic. |
| `app/api/hr/` | APIs for HR managers to schedule interviews and manage candidates. |
| `app/api/interview/` | The core "Engine" endpoints for starting a session and real-time chat. |
| `app/api/quiz/` | Logic for generating technical quizzes and verifying candidate answers. |
| **`app/auth/`** | User-facing Authentication pages (Login and Signup). |
| **`app/components/`** | Global UI components used across multiple pages. |
| `app/components/layout/` | Contains the `Navbar`, `Footer`, and shared wrappers. |
| **`app/home/`** | The landing page. Contains sections like Hero, Features, and FAQ. |
| **`app/hr/`** | The HR Dashboard where recruiters can see interview results and schedule new ones. |
| **`app/interview/`** | **The Candidate Suite.** |
| `app/interview/practice/` | The free practice mode available to all users. |
| `app/interview/[token]/` | The scheduled interview route that loads a specific session from Supabase using a UUID. |
| **`app/tests/`** | Pages for the Quiz and Practice testing modules. |

### `hooks/` (Custom Logic)
- **`useSpeechRecognition.js`**: Managed state for the browser's Web Speech API. Processes silence, errors, and real-time results.

### `lib/` (Core Libraries)
- **`supabaseClient.js`**: Initializes the connection to the Supabase PostgreSQL database and Auth service.

### `utils/` (Helper Logic)
- **`tts.js`**: Utility for the Text-to-Speech engine.
- **`common.js`**: Shared formatting functions (dates, strings, etc.).

### `public/` (Static Assets)
- Contains icons, the company logo (`logo.jpg`), and any global CSS or fonts.

---

## 🧩 2. Feature-Specific Components (`_components/`)

Quantix AI uses a "Local Component" architecture. Folders prefixed with `_` are not accessible via URL routing but house the specific building blocks for their parent page.

### `app/home/_components/` (The Landing Page)
- **`HeroSection.jsx`**: The main entry point with the high-impact title and CTA.
- **`AIInterviewActionSection.jsx`**: Demonstrates the AI's capabilities with a visual preview.
- **`PricingSection.jsx`**: (Note: This was recently removed from the active UI but remains in the codebase for potential reactivation).
- **`FAQSection.jsx`**: An accordion-based component for common user questions.

### `app/interview/practice/_components/` (The Core Engine)
- **`InterviewScreen.jsx`**: **The Command Center.** Integrates the webcam, Speech-to-Text, and AI Roleplay.
- **`LobbyScreen.jsx`**: The hardware check and instructions gatekeeper.
- **`ResumeUpload.jsx`**: Handles PDF extraction and initial AI analysis request.
- **`DetailsForm.jsx`**: Alternative entry for job metadata without a resume.
- **`Modal.jsx`**: A reusable backdrop/container for warnings and end-session confirmations.

### `app/hr/_components/` (Recruiter Dashboard)
- **`ScheduleForm.jsx`**: Interface for entering candidate email and job details.
- **`InterviewTable.jsx`**: Reusable table for displaying candidate status, scores, and evaluation links.

---

## 🏗️ 3. Project Organization
The project follows the **Next.js App Router** architecture combined with specialized utility layers.

### [ Root Directories ]
| Directory | Responsibility |
| :--- | :--- |
| [`app/`](file:///d:/Projects/mini-1/app) | The core application. Contains all routes (Pages) and API endpoints. |
| [`lib/`](file:///d:/Projects/mini-1/lib) | Shared library initializations (e.g., Supabase client, shared classes). |
| [`hooks/`](file:///d:/Projects/mini-1/hooks) | Custom React hooks for hardware interaction (Speech Recognition). |
| [`utils/`](file:///d:/Projects/mini-1/utils) | Pure utility functions (Text-to-Speech, formatting). |
| [`public/`](file:///d:/Projects/mini-1/public) | Static assets like the logo, images, and audio files. |

---

## ⚡ 2. The AI Interview Engine (Backend)
The engine consists of specialized serverless functions that interact with **Google Gemini 2.5 Flash**.

### [ API Routes ] - `app/api/...`
- **[`/interview/start-from-resume`](file:///d:/Projects/mini-1/app/api/interview/start-from-resume/route.js)**: 
    - *Purpose*: AI Resume Analysis.
    - *Logic*: Parses PDF resumes, identifies experience level, and generates a personalized opening question.
- **[`/interview/chat`](file:///d:/Projects/mini-1/app/api/interview/chat/route.js)**: 
    - *Purpose*: The Real-time "AI Brain".
    - *Logic*: Manages the conversation flow as a technical interviewer.
- **[`/analyze-and-submit`](file:///d:/Projects/mini-1/app/api/analyze-and-submit/route.js)**: 
    - *Purpose*: Evaluation & Reporting.
    - *Logic*: Generates the final 10-point scoring report and emails it to HR via Resend.
- **[`/analyze-practice`](file:///d:/Projects/mini-1/app/api/analyze-practice/route.js)**: 
    - *Purpose*: Ephemeral Analysis.
    - *Logic*: Provides instant feedback for practice interviews without saving to the database.

---

## 🎨 3. UI Layer & "Sub-files"
We use a **Component-Local** pattern. Files inside `_components` directories are private to that specific page or feature.

### [ The `_components` Strategy ]
> [!TIP]
> **Sub-files** (components prefixed with `_`) are used to break down complex pages into manageable pieces. This keeps the main `page.jsx` focused on high-level state management.

#### Location: `app/interview/practice/_components/`
1.  **[`InterviewScreen.jsx`](file:///d:/Projects/mini-1/app/interview/practice/_components/InterviewScreen.jsx)**: 
    *   *The Heart:* Manages the webcam, AI transcript, and audio processing.
    *   *Proctoring:* Houses the COCO-SSD AI model for person and phone detection.
2.  **[`LobbyScreen.jsx`](file:///d:/Projects/mini-1/app/interview/practice/_components/LobbyScreen.jsx)**: 
    *   Hardware test environment (Camera/Microphone) and interview countdown.
3.  **[`ResumeUpload.jsx`](file:///d:/Projects/mini-1/app/interview/practice/_components/ResumeUpload.jsx)**: 
    *   Drag-and-drop PDF handler with real-time UI states.
4.  **[`DetailsForm.jsx`](file:///d:/Projects/mini-1/app/interview/practice/_components/DetailsForm.jsx)**: 
    *   Capture form for job titles and descriptions when manual entry is chosen.

---

## 🔒 4. Proctoring Implementation
Security is handled through a "Defense in Depth" approach located across these triggers:

| Layer | Implementation File | Logic Type |
| :--- | :--- | :--- |
| **Visual AI** | `InterviewScreen.jsx` | COCO-SSD (Person count, Phone sighting). |
| **Activity** | `InterviewScreen.jsx` | Browser Visibility API (Detects tab switching). |
| **Focus** | `InterviewScreen.jsx` | Window Blur Event (Detects clicking away). |
| **Audio** | `useSpeechRecognition.js` | Monitors microphone disconnects or speech failure. |

---

## 🛠️ 5. Key Dependencies
- **Core**: Next.js 14, React 18
- **AI**: `@google/generative-ai` (Gemini SDK)
- **Computer Vision**: `@tensorflow-models/coco-ssd` & `tfjs`
- **Database**: `@supabase/supabase-js`
- **Styling**: Vanilla CSS & TailwindCSS
- **Animations**: `framer-motion` (Smooth micro-transitions)

> [!IMPORTANT]
> To modify the AI's personality or reporting strictness, look at the `prompt` constants inside the API routes listed in Section 2.
