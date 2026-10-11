// app/api/process-answer/route.js
export async function POST(req) {
    try {
        const body = await req.json();
        const spokenText = body.text;
        const userData = body.userData;
        const resumeText = body.resumeText;

        console.log("Received spoken text:", spokenText);
        console.log("User Data:", userData);
        console.log("Resume Text:", resumeText);

        const cannedResponses = [
            "What are your greatest strengths?",
            "Describe a time you failed and what you learned from it.",
            "Why are you interested in working for our company?",
            "Where do you see yourself in 5 years?",
            "Do you have any questions for me?",
            "Thank you for your time! That concludes the interview.",

        ];
        const nextQuestion = cannedResponses[Math.floor(Math.random() * cannedResponses.length)];

        return new Response(JSON.stringify({ nextQuestion: nextQuestion }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error in /ai/process-answer:", error);
        return new Response(JSON.stringify({ error: error.message || "Failed to process answer" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
