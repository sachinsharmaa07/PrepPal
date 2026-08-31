/**
 * useCompatChat — Compatibility wrapper over @ai-sdk/react v4's useChat.
 *
 * Uses TextStreamChatTransport which works with streamText().toTextStreamResponse()
 * on the server side (plain text streaming, no UI message protocol overhead).
 */
'use client';

import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport, isTextUIPart } from 'ai';

export type CompatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  /** Flattened text content from UIMessage.parts */
  content: string;
};

type CompatSendOpts =
  | { text: string }
  | { role: string; content: string };

type CompatChatHelpers = {
  messages: CompatMessage[];
  sendMessage: (opts: CompatSendOpts) => void;
  isLoading: boolean;
  setMessages: ReturnType<typeof useChat>['setMessages'];
};

export function useCompatChat(options?: { api?: string }): CompatChatHelpers {
  const api = options?.api ?? '/api/chat';

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new TextStreamChatTransport({ api }),
  });

  // Flatten UIMessage parts into a plain .content string for v3 compatibility
  const compatMessages: CompatMessage[] = messages.map((m) => ({
    id: m.id,
    role: m.role as 'user' | 'assistant' | 'system',
    content: m.parts
      .filter(isTextUIPart)
      .map((p) => p.text)
      .join(''),
  }));

  const compatSendMessage = (opts: CompatSendOpts) => {
    const text = 'text' in opts ? opts.text : opts.content;
    sendMessage({ text });
  };

  const isLoading = status === 'submitted' || status === 'streaming';

  return {
    messages: compatMessages,
    sendMessage: compatSendMessage,
    isLoading,
    setMessages,
  };
}
