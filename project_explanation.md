# QuantixAI - Project Explanation

QuantixAI is a sophisticated, AI-driven recruitment and screening platform. It automates the entire interview funnel—from initial resume screening to conducting technical/behavioral interviews and generating deep-dive performance reports.

---

## 1. Frontend Files (UI & User Interaction)
These files manage the visual experience and client-side logic.

- **Landing & Navigation**: `app/page.js` and `app/home/page.js` handle the entry point, featuring modern animations (Framer Motion) and 3D scenes (Three.js/Fiber) to create a premium "AI-first" feel.
- **Candidate Workspace**: `app/dashboard/` provides the user interface for candidates to manage their invited interviews and track progress.
- **Interview Interface**: `app/interview/` is the most complex frontend area. It handles:
    - **Real-time Proctoring**: Uses `TensorFlow.js` to detect multiple faces or eye movements to prevent cheating.
    - **Audio/Video**: Manages webcam access and voice interaction.
- **Design System**: `app/globals.css` and `components.json` define the styling (Tailwind CSS) and UI tokens (Shadcn/UI components).

---

## 2. Backend Files (Logic & Data)
These files handle data persistence, routing, and communication between the frontend and the AI.

- **Database**: `lib/supabaseClient.js` configures the connection to **Supabase**. It stores candidate profiles, interview transcripts, and final reports.
- **API Routes**: The `app/api/` folder contains Next.js route handlers that act as the backend server.
    - `api/schedule/`: Handles the logic for sending automated email invitations to candidates via **Resend**.
    - `api/interview-details/`: Fetches the specific configuration for an interview using a secure token.
- **Security**: `middleware.js` manages session routing, ensuring users can only access the interview or dashboard if they are authorized.

---

## 3. AI Files (Intelligence & Analysis)
These files contain the "brain" of the platform, primarily leveraging Google's **Gemini AI**.

- **Resume Screening**: `app/api/screen-resume/route.js` uses `pdf-parse` to extract text from resumes and Gemini to analyze them against job requirements.
- **Question Generation**: `app/api/generate-quiz/route.js` creates a unique set of technical and behavioral questions tailored to the candidate's experience.
- **Virtual Interviewer**: `app/api/interview/chat/route.js` is the core AI agent. It acts as the interviewer, responding to candidate answers and maintaining a professional conversational flow.
- **Report Generation**: `app/api/analyze-and-submit/route.js` runs after the interview ends. It analyzes the entire transcript to generate a score-based report, including communication skills, technical depth, and a final "Hire/Reject" recommendation.

---

## How the Data Flows:
1.  **Resume Screening**: Candidate file is processed by `screen-resume`.
2.  **Scheduling**: HR invites candidates; `schedule` stores details in Supabase and sends emails.
3.  **Interview**: `generate-quiz` prepares the session, and `interview/chat` handles the live dialogue.
4.  **Analysis**: Once finished, `analyze-and-submit` builds the final report and notifies the HR manager.
