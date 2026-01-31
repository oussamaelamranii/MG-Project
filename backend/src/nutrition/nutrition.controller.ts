import { Controller, Post, UseInterceptors, UploadedFile, Body, Get, UseGuards, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { NutritionService } from './nutrition.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Assuming this exists based on auth module
// If JwtAuthGuard doesn't exist or is different, we'll need to check. Assuming standard for now.

@Controller('nutrition')
export class NutritionController {
    constructor(private readonly nutritionService: NutritionService) { }

    @Post('analyze')
    @UseInterceptors(FileInterceptor('image'))
    async analyze(@UploadedFile() file: Express.Multer.File) {
        // For now, even if file is missing (mock flow), we return data
        return this.nutritionService.analyzeImage(file || { buffer: Buffer.from([]), originalname: 'test.jpg' });
    }

    @UseGuards(JwtAuthGuard)
    @Post('log')
    async logMeal(@Request() req, @Body() body: { name: string, calories: number, protein: number, carbs: number, fats: number, imageUrl?: string }) {
        return this.nutritionService.logMeal(req.user.id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Get('today')
    async getDailyLogs(@Request() req) {
        return this.nutritionService.getDailyLogs(req.user.id);
    }
}
