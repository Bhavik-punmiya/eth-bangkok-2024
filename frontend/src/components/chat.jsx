"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./chat.module.css";
import { AssistantStream } from "openai/lib/AssistantStream";
import Markdown from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "@/components/CodeBlock.jsx"; // Assuming CodeBlock is in a separate file
import { FaUser } from "react-icons/fa";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaPaperPlane } from "react-icons/fa";

// @ts-expect-error - no types for this yet
const UserMessage = ({ text }) => {
  return (
    <div className=" flex flex-row gap-3 items-start justify-start mt-5 w-full">
      <div className=" flex items-center justify-center rounded-full w-10 h-10 bg-theme-purple ">
        <FaUser className="" />
      </div>
      <div className={styles.userMessage}>{text}</div>
    </div>
  );
};

const AssistantMessage = ({ text, logo, name }) => {
  // console.log(text);
  return (
    <div className=" flex flex-row gap-3 items-start justify-start my-5 w-full">
      <div className="flex items-center gap-5">
        <Image
          src={logo}
          className="rounded-full"
          alt={name}
          width={40}
          height={40}
        />
      </div>
      <div className={styles.assistantMessage}>
        <ReactMarkdown
          className=""
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <CodeBlock language={match[1]}>
                  {String(children).replace(/\n$/, "")}
                </CodeBlock>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            a({ node, children, href, ...props }) {
              return (
                <a href={href} className="text-blue-500 underline" {...props}>
                  {children}
                </a>
              );
            },
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
};

const CodeMessage = ({ text }) => {
  return (
    <div>
      <ReactMarkdown
        className=" p-2 mb-2"
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <CodeBlock language={match[1]}>
                {String(children).replace(/\n$/, "")}
              </CodeBlock>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          a({ node, children, href, ...props }) {
            return (
              <a href={href} className="text-blue-500 underline" {...props}>
                {children}
              </a>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

const Message = ({ role, text, logo, name }) => {
  switch (role) {
    case "user":
      return <UserMessage text={text} />;
    case "assistant":
      return <AssistantMessage text={text} logo={logo} name={name} />;
    case "code":
      return <AssistantMessage text={text} logo={logo} name={name} />;
    default:
      return null;
  }
};

const Chat = ({
  functionCallHandler = () => Promise.resolve(""), // default to return empty string
  setAgentResponse,
}) => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [threadId, setThreadId] = useState("");
  const [logo, setLogo] = useState("");
  const [name, setName] = useState("");
  const pathname = usePathname();

  // automatically scroll to bottom of chat
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  // create a new threadID when chat component created
  useEffect(() => {
    const createThread = async () => {
      const res = await fetch(`/api/assistants/threads`, {
        method: "POST",
      });
      const data = await res.json();
      setThreadId(data.threadId);
    };
    createThread();
  }, []);

  useEffect(() => {
    //get current page url
    if (pathname) {
      console.log(pathname);
      const chain_name = pathname.split("/")[2];
      const logo = `/chain/${chain_name}-logo.png`;
      const name = chain_name.charAt(0).toUpperCase() + chain_name.slice(1);
      setLogo(logo);
      setName(name);
    }
  }, [pathname]);

  const sendMessage = async (text) => {
    console.log("sending message to agent ", name.toLowerCase());
    const response = await fetch(
      `/api/assistants/threads/${threadId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({
          content: text,
          agentName: name.toLowerCase(),
        }),
      }
    );
    const stream = AssistantStream.fromReadableStream(response.body);
    handleReadableStream(stream);
  };

  const submitActionResult = async (runId, toolCallOutputs) => {
    const response = await fetch(
      `/api/assistants/threads/${threadId}/actions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          runId: runId,
          toolCallOutputs: toolCallOutputs,
        }),
      }
    );
    const stream = AssistantStream.fromReadableStream(response.body);
    handleReadableStream(stream);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    sendMessage(userInput);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: userInput },
    ]);
    setUserInput("");
    setInputDisabled(true);
    scrollToBottom();
  };

  /* Stream Event Handlers */

  // textCreated - create new assistant message
  const handleTextCreated = () => {
    appendMessage("assistant", "");
  };

  // textDelta - append text to last assistant message
  const handleTextDelta = (delta) => {
    if (delta.value != null) {
      appendToLastMessage(delta.value);
    }
    if (delta.annotations != null) {
      annotateLastMessage(delta.annotations);
    }
  };

  // imageFileDone - show image in chat
  const handleImageFileDone = (image) => {
    appendToLastMessage(`\n![${image.file_id}](/api/files/${image.file_id})\n`);
  };

  // toolCallCreated - log new tool call
  const toolCallCreated = (toolCall) => {
    if (toolCall.type != "code_interpreter") return;
    appendMessage("code", "");
  };

  // toolCallDelta - log delta and snapshot for the tool call
  const toolCallDelta = (delta, snapshot) => {
    if (delta.type != "code_interpreter") return;
    if (!delta.code_interpreter.input) return;
    appendToLastMessage(delta.code_interpreter.input);
  };

  // handleRequiresAction - handle function call
  const handleRequiresAction = async (event) => {
    const runId = event.data.id;
    const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
    // loop over tool calls and call function handler
    const toolCallOutputs = await Promise.all(
      toolCalls.map(async (toolCall) => {
        const result = await functionCallHandler(toolCall);
        return { output: result, tool_call_id: toolCall.id };
      })
    );
    setInputDisabled(true);
    submitActionResult(runId, toolCallOutputs);
  };

  // handleRunCompleted
  const handleRunCompleted = () => {
    setInputDisabled(false);
    console.log("REPLACING THE CODE in messages array");
    setMessages((prev) => {
      const updatedMessages = prev.map((message) => {
        const text = message.text;
        const codeBlockRegex = /```(?:\w+\n)?([\s\S]*?)```/g;

        // Replace code blocks with bold "code" string
        const updatedText = text.replace(
          codeBlockRegex,
          "**See the code in the editor**"
        );

        // Return updated message
        return {
          ...message,
          text: updatedText,
        };
      });

      return updatedMessages;
    });
  };

  const handleReadableStream = (stream) => {
    // messages
    stream.on("textCreated", handleTextCreated);
    stream.on("textDelta", handleTextDelta);

    // image
    stream.on("imageFileDone", handleImageFileDone);

    // code interpreter
    stream.on("toolCallCreated", toolCallCreated);
    stream.on("toolCallDelta", toolCallDelta);

    // events without helpers yet (e.g. requires_action and run.done)
    stream.on("event", (event) => {
      if (event.event === "thread.run.requires_action")
        handleRequiresAction(event);
      if (event.event === "thread.run.completed") handleRunCompleted();
    });
  };

  /*
    =======================
    === Utility Helpers ===
    =======================
  */

  const appendToLastMessage = (text) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
        text: lastMessage.text + text,
      };
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  const appendMessage = (role, text) => {
    setMessages((prevMessages) => [...prevMessages, { role, text }]);
  };

  const annotateLastMessage = (annotations) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
      };
      annotations.forEach((annotation) => {
        if (annotation.type === "file_path") {
          updatedLastMessage.text = updatedLastMessage.text.replaceAll(
            annotation.text,
            `/api/files/${annotation.file_path.file_id}`
          );
        }
      });
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  // Utility to extract code blocks from text
  const extractCodeBlocks = (text) => {
    const codeBlockRegex = /```(?:\w+\n)?([\s\S]*?)```/g;
    let match;
    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match[1].includes("SPDX-License-Identifier")) {
        return match[1];
      }
    }
  };

  useEffect(() => {
    if (messages.length > 0 && inputDisabled) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === "assistant") {
        const code = extractCodeBlocks(lastMessage.text);
        if (code) {
          setAgentResponse(code);
        }
      }
    }
  }, [messages]);

  return (
    <div
      className="flex flex-col items-center "
      style={{ height: "calc(100vh - 100px)" }}
    >
      <div className="w-full justify-center flex gap-3 items-center mt-5 mb-2">
        <Image
          src={logo}
          className="rounded-full"
          alt={name}
          width={30}
          height={30}
        />
        <p className="text-xl font-bold">{name} Agent</p>
      </div>
      <div className="flex flex-col items-start overflow-auto pl-5 w-full h-full text-sm">
        {messages.length > 0 ? (
          <div>
            {messages.map((msg, index) => (
              <Message
                key={index}
                role={msg.role}
                text={msg.text}
                logo={logo}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex justify-center items-center text-center text-gray-400 text-3xl w-full  my-auto mt-20">
            <p className="w-full text-center">Imagination is the limit!</p>
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex justify-between items-center p-2 bg-white shadow-md rounded-lg mx-auto  w-full"
      >
        <input
          type="text"
          className={styles.input}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={
            inputDisabled ? "Answering..." : "Want do you want to build?"
          }
          disabled={inputDisabled}
        />
        <button
          type="submit"
          className="rounded-full h-10 w-10 flex items-center justify-center bg-theme-purple-light hover:text-theme-purple-dark"
          disabled={inputDisabled}
        >
          <FaPaperPlane className="text-lg" />
        </button>
      </form>
    </div>
  );
};

export default Chat;
