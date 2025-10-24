
import { GoogleGenAI, Type } from "@google/genai";
import type { Question } from '../types';

if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const contentGenerationConfig = {
    temperature: 0.7,
    topK: 64,
    topP: 0.95,
};

const quizGenerationConfig = {
    responseMimeType: "application/json",
    temperature: 0.5,
};

const levelQuizSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            question: { type: Type.STRING },
            options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.STRING }
        },
        required: ['question', 'options', 'correctAnswer']
    }
};

const finalQuizSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            question: { type: Type.STRING },
            options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.STRING }
        },
        required: ['question', 'options', 'correctAnswer']
    }
};

const dragAndDropSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            content: { type: Type.STRING, description: "A short characteristic or fact about the US House of Representatives, the Senate, or both." },
            category: { type: Type.STRING, description: "The correct category: 'House', 'Senate', or 'Both'." }
        },
        required: ['content', 'category']
    }
};

export const generateLevelContent = async (topic: string, title: string): Promise<{ content: string, task: { type: 'quiz', questions: Question[] } }> => {
    try {
        const contentPrompt = `Explain the following topic from the US Constitution's Article I for a middle school student in a fun and engaging way. Use markdown for formatting. The topic is: "${topic}". The title of this level is "${title}". Keep it under 200 words.`;

        const contentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contentPrompt,
            config: contentGenerationConfig
        });

        const content = contentResponse.text;

        const quizPrompt = `Create three distinct multiple-choice questions to check understanding of this topic: "${topic}". The questions should be simple and directly related to the main point of the topic. Ensure the options are clear and there's only one correct answer for each question.`;

        const quizResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: quizPrompt,
            config: {
                ...quizGenerationConfig,
                responseSchema: levelQuizSchema,
            }
        });
        
        const quizJson = JSON.parse(quizResponse.text);
        
        return {
            content,
            task: {
                type: 'quiz',
                questions: quizJson
            }
        };

    } catch (error) {
        console.error("Error generating level content:", error);
        throw new Error("Failed to load level content. Please try again.");
    }
};

export const generateFinalQuiz = async (): Promise<Question[]> => {
    try {
        const prompt = "Create a 10-question multiple-choice quiz about the US Legislative Branch, covering the House of Representatives, the Senate, the powers of Congress, and how a bill becomes a law. The questions should be suitable for a middle school student who has just learned these topics.";

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                ...quizGenerationConfig,
                responseSchema: finalQuizSchema,
            }
        });
        
        const questions = JSON.parse(response.text);
        return questions;

    } catch (error) {
        console.error("Error generating final quiz:", error);
        throw new Error("Failed to load the final quiz. Please try again.");
    }
};

export const generateDragAndDropItems = async (): Promise<{ content: string, category: 'House' | 'Senate' | 'Both' }[]> => {
    try {
        const prompt = "Generate 10 distinct facts or characteristics about the U.S. Congress. For each one, categorize it as belonging to the 'House' of Representatives, the 'Senate', or 'Both'. Examples: 'Must be 25 years old' (House), 'Approves treaties' (Senate), 'Can declare war' (Both). Provide a diverse mix.";

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                ...quizGenerationConfig,
                responseSchema: dragAndDropSchema,
            }
        });
        
        const items = JSON.parse(response.text);
        return items;

    } catch (error) {
        console.error("Error generating drag and drop items:", error);
        throw new Error("Failed to load the review activity. Please try again.");
    }
};
