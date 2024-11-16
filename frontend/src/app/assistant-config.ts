export const assistantIds = {
  base: process.env.NEXT_PUBLIC_BASE_ASSISTANT_ID || "",
  optimism: process.env.NEXT_PUBLIC_OPTIMISM_ASSISTANT_ID || "",
  solidity: process.env.NEXT_PUBLIC_SOLIDITY_ASSISTANT_ID || "",
  mantle: process.env.NEXT_PUBLIC_MANTLE_ASSISTANT_ID || "",
  polygon: process.env.NEXT_PUBLIC_POLYGON_ASSISTANT_ID || "",
  morph: process.env.NEXT_PUBLIC_MORPH_ASSISTANT_ID || "",
  celo: process.env.NEXT_PUBLIC_CELO_ASSISTANT_ID || "",
  flow: process.env.NEXT_PUBLIC_FLOW_ASSISTANT_ID || "",
};

export const getAssistantId = (
  type:
    | "base"
    | "optimism"
    | "solidity"
    | "mantle"
    | "polygon"
    | "morph"
    | "celo"
    | "flow" = "base"
): string => {
  return assistantIds[type];
};
