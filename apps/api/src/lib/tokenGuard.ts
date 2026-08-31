export const truncateForTokenBudget = (text: string, maxTokens: number = 6000): string => {
  // A rough estimate: 1 token ≈ 4 characters
  const maxChars = maxTokens * 4;
  
  if (text.length <= maxChars) {
    return text;
  }
  
  const keepHalf = Math.floor(maxChars / 2);
  const start = text.slice(0, keepHalf);
  const end = text.slice(-keepHalf);
  
  return `${start}\n\n...[TRUNCATED FOR LENGTH]...\n\n${end}`;
};
