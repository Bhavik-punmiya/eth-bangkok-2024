import { useState, useEffect, useCallback, useMemo } from "react";
import { AssistantStream } from "openai/lib/AssistantStream";

export function useSolidityCodeAgent() {
  const [agentResponse, setAgentResponse] = useState(
    "// Solidity code will appear here"
  );
  const [inputDisabled, setInputDisabled] = useState(false);
  const [threadId, setThreadId] = useState("");
  const [progressMessage, setProgressMessage] = useState(
    "Understanding your question..."
  );
  const [intervalId, setIntervalId] = useState(null);

  const codeGenerationMessages = useMemo(
    () => [
      "Retrieving knowledge base...",
      "Finding answers...",
      "Generating answers...",
      "Almost there...",
    ],
    []
  );

  useEffect(() => {
    const createThread = async () => {
      const res = await fetch(`/api/assistants/threads`, { method: "POST" });
      const data = await res.json();
      setThreadId(data.threadId);
    };
    createThread();
  }, []);

  const removeSolidityFormatting = useCallback((inputString) => {
    return inputString
      .trim()
      .replace(/```solidity/g, "")
      .replace(/```/g, "")
      .trim();
  }, []);

  const handleReadableStream = useCallback(
    (stream) => {
      let accumulatedResponse = "";
      stream.on("textDelta", (delta) => {
        if (delta.value != null) {
          accumulatedResponse += delta.value;
        }
      });
      stream.on("event", (event) => {
        if (event.event === "thread.run.completed") {
          console.log("agent response", accumulatedResponse);
          const processed_ans = removeSolidityFormatting(accumulatedResponse);
          setAgentResponse(processed_ans);
            localStorage.setItem('loadedContractCode', processed_ans);
          setInputDisabled(false);
          clearInterval(intervalId);
        }
      });
    },
    [removeSolidityFormatting]
  );

  const messages = codeGenerationMessages;
  let messageIndex = 0;
  const displayMessage = () => {
    if (messageIndex < messages.length) {
      setProgressMessage(messages[messageIndex]);
      messageIndex++;
    } else {
      messageIndex = 0; // Reset to start from the beginning
    }
  };

  const handleRunAgent = useCallback(
    async (userInput) => {
      if (!userInput.trim()) return;
      setInputDisabled(true);

      //show progress to the user every 2 seconds
      let intervalId = setInterval(displayMessage, 3000); // 2000 ms = 2 seconds
      setIntervalId(intervalId);

      const response = await fetch(
        `/api/assistants/threads/${threadId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({ content: userInput, agentName: "solidity" }),
        }
      );
      const stream = AssistantStream.fromReadableStream(response.body);
      handleReadableStream(stream);
    },
    [threadId, handleReadableStream]
  );

  return {
    agentResponse,
    handleRunAgent,
    inputDisabled,
    setAgentResponse,
    progressMessage,
  };
}
