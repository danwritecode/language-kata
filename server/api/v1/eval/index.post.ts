import OpenAI from "openai";
import { verifyJWT, getAuthCookie } from '~/utils/auth'

const config = useRuntimeConfig();
const openai = new OpenAI({
  apiKey: config.openaiKey
});


import { defineEventHandler, readBody, getHeader } from "h3";

export default defineEventHandler(async (event) => {
  // Check authentication
  const cookieHeader = getHeader(event, 'cookie')
  const token = getAuthCookie(cookieHeader)
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }
  
  const payload = verifyJWT(token, config.jwtSecret)
  if (!payload) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired token'
    })
  }
  const body = await readBody(event);

  // Extract previous_exercises, elo_scaling_factor, and target_language from the body
  const { previous_exercises, elo_scaling_factor, target_language, ...kata_input } = body;

  const response = await openai.responses.create({
    prompt: {
      "id": "pmpt_68b76c74720081969992b0f944d707df0f6e91ed19d50e9f",
      "version": "12",
      variables: {
        kata_input: JSON.stringify(kata_input),
        previous_exercises: JSON.stringify(previous_exercises || []),
        elo_scaling_factor: String(elo_scaling_factor || 1.0),
        target_language: target_language || 'ja'
      }
    }
  });

  console.log(response.output_text);

  return JSON.parse(response.output_text);
});
