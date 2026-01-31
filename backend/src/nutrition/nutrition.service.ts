import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NutritionService {
    constructor(private prisma: PrismaService) { }

    async analyzeImage(file: Express.Multer.File | { buffer: Buffer, originalname: string }) {
        // MOCK AI ANALYSIS
        // In a real app, this would send the image to OpenAI Vision API or similar.

        // Simulating "Analysis" delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Randomize results slightly for "realism"
        const baseCalories = 450 + Math.floor(Math.random() * 200);

        return {
            name: "Grilled Chicken & Rice Bowl",
            calories: baseCalories,
            protein: 45,
            carbs: 55,
            fats: 12,
            confidence: 0.98,
            message: "Identified: Grilled Chicken Breast with Brown Rice and Broccoli."
        };
    }

    async logMeal(userId: number, data: { name: string, calories: number, protein: number, carbs: number, fats: number, imageUrl?: string }) {
        return this.prisma.mealLog.create({
            data: {
                userId,
                ...data
            }
        });
    }

    async getDailyLogs(userId: number) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return this.prisma.mealLog.findMany({
            where: {
                userId,
                createdAt: {
                    gte: today
                }
            }
        });
    }
}
