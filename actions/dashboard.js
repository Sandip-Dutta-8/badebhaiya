'use server'

const { db } = require("../lib/prisma");
const { auth } = require("@clerk/nextjs/server");
const { GoogleGenerativeAI } =  require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateAIInsights = async (industry) => {
    const prompt = `
            Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
            {
              "salaryRanges": [
                { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
              ],
              "growthRate": number,
              "demandLevel": "HIGH" | "MEDIUM" | "LOW",
              "topSkills": ["skill1", "skill2"],
              "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
              "keyTrends": ["trend1", "trend2"],
              "recommendedSkills": ["skill1", "skill2"]
            }
            
            IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
            Include at least 5 common roles for salary ranges in India.
            Growth rate should be a percentage.
            Include at least 5 skills and trends.
          `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    return JSON.parse(cleanedText);
};

export async function getIndustryInshights() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        include: {
            industryInsights: true,
        },
    });

    if (!user) throw new Error("User not found");

    // If no insights exist, generate them
    if (!user.industryInsights) {
        const insights = await generateAIInsights(user.industry);

        const industryInsight = await db.industryInsights.create({
            data: {
                industry: user.industry,
                ...insights,
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        return industryInsight;
    }

    return user.industryInsights;
}