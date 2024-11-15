import OpenAI from "openai";

const NEXT_PUBLIC_OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export const openai = new OpenAI({
  apiKey: NEXT_PUBLIC_OPENAI_API_KEY,
});
