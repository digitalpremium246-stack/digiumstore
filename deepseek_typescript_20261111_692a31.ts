// src/app/api/stylist/route.ts
import { routeAITask } from "@/lib/ai/router";

// Tentukan task ringan atau berat berdasarkan input user (bisa menggunakan classifier sederhana)
const isHeavyTask = userMessage.length > 100 || userMessage.includes("analisis"); 
const task = isHeavyTask ? "CHAT_HEAVY" : "CHAT_LIGHT";

const response = await routeAITask(task, { messages, tools }, userId);