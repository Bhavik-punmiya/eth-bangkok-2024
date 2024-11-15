import { getAssistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

// Send a new message to a thread
export async function POST(
  request: NextRequest,
  { params: { threadId } }: { params: { threadId: string } }
) {
  const { content, agentName } = await request.json();

  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: content,
  });
  const assistantId = await getAssistantId(agentName);

  const stream = openai.beta.threads.runs.stream(threadId, {
    assistant_id: assistantId,
  });

  return new Response(stream.toReadableStream());
}
