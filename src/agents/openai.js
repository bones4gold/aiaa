import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function getAgentResponse(agent, userMessage) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: agent.persona },
      { role: "user", content: userMessage }
    ],
  });

  return response.choices[0].message.content.trim();
}
