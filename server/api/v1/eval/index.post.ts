import OpenAI from "openai";

const config = useRuntimeConfig();
const openai = new OpenAI({
  apiKey: config.openaiKey
});


import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Extract previous_exercises and elo_scaling_factor from the body
  const { previous_exercises, elo_scaling_factor, ...kata_input } = body;

  const response = await openai.responses.create({
    prompt: {
      "id": "pmpt_68b76c74720081969992b0f944d707df0f6e91ed19d50e9f",
      "version": "10",
      variables: {
        kata_input: JSON.stringify(kata_input),
        previous_exercises: JSON.stringify(previous_exercises || []),
        elo_scaling_factor: String(elo_scaling_factor || 1.0)
      }
    }
  });

  console.log(response.output_text);

  return JSON.parse(response.output_text);
});
