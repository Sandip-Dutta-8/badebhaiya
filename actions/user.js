'use server'

const { db } = require("../lib/prisma");
const { auth } = require("@clerk/nextjs/server");

export async function updateUser(data) {
    
    //user is login or not
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized User");

    //check user is in our database or not
    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    try {
        // Start a transaction to handle both operations
        const result = await db.$transaction(
            async (tx) => {
                // First check if industry exists
                let industryInsight = await tx.industryInsights.findUnique({
                    where: {
                        industry: data.industry,
                    },
                });

                //if industry doesn't exists create it with the default values - Replace it later with AI
                if (!industryInsight) {
                    industryInsight = await tx.industryInsights.create({
                        data: {
                            industry: data.industry,
                            salaryRanges: [],
                            growthRate: 0,
                            demandLevel: "MEDIUM",
                            topSkills: [],
                            marketOutlook: "NEUTRAL",
                            keyTrends: [],
                            recommendedSkills: [],
                            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        }
                    })
                }

                //update the user
                const updatedUser = await tx.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        industry: data.industry,
                        experience: data.experience,
                        bio: data.bio,
                        skills: data.skills,
                    },
                });

                return { updatedUser, industryInsight };
            },
            {
                timeout: 10000, //default 5000
            }
        )

        return { success: true, ...result };

    } catch (error) {
        console.error("Error updating user and industry:", error.message);
        throw new Error("Failed to update profile " + error.message);
    }
}

export async function getUserOnboardingStatus() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    try {
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId,
            },
            select: {
                industry: true,
            },
        });

        return {
            isOnboarded: !!user?.industry,
        };
    } catch (error) {
        console.error("Error checking onboarding status:", error);
        throw new Error("Failed to check onboarding status");
    }
}