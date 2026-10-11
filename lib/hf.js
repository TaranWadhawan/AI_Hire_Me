import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

/**
 * Common utility to call Hugging Face Llama-3.1-8B-Instruct.
 */
export async function getHFCompletion(messages, options = {}) {
  try {
    const response = await hf.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages,
      max_tokens: options.max_tokens || 1000,
      temperature: options.temperature || 0.7,
      top_p: options.top_p || 0.9,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Hugging Face API Error:", error);
    throw error;
  }
}
