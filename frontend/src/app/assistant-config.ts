// assistantConfig.ts

export const assistantIds = {
  base: process.env.NEXT_PUBLIC_BASE_ASSISTANT_ID || "",
  optimism: process.env.NEXT_PUBLIC_OPTIMISM_ASSISTANT_ID || "",
  solidity: process.env.NEXT_PUBLIC_SOLIDITY_ASSISTANT_ID || "",
};

export const getAssistantId = (
  type: "base" | "optimism" | "solidity" = "base"
): string => {
  return assistantIds[type];
};
