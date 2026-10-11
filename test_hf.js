const { HfInference } = require('@huggingface/inference');

const HF_TOKEN = "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";
const inference = new HfInference(HF_TOKEN);

async function test() {
  try {
    const out = await inference.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 10,
    });
    console.log("Success:", JSON.stringify(out));
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
