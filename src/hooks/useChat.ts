import { useState, useCallback } from 'react';
import OpenAI from 'openai';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  topic?: string;
}

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: This is not recommended for production
});

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (message: string, topic?: string) => {
    if (message.trim()) {
      const newMessage = { text: message, sender: 'user' as const, topic };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setIsLoading(true);

      try {
        if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
          throw new Error('OpenAI API key is not set');
        }

        const chatMessages = messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.text
        }));

        chatMessages.push({ role: 'user' as const, content: message });

        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system" as const, content: `You are a helpful financial assistant specializing in ${topic || 'general finance'}. Provide concise and accurate information. Format your responses using markdown for better readability.` },
            ...chatMessages
          ],
        });

        const botReply = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
        const botMessage = { text: botReply, sender: 'bot' as const, topic };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error fetching response:', error);
        setMessages(prevMessages => [...prevMessages, { text: "Sorry, I couldn't process your request.", sender: 'bot', topic }]);
      } finally {
        setIsLoading(false);
      }
    }
  }, [messages]);

  const resetChat = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, isLoading, sendMessage, resetChat };
};