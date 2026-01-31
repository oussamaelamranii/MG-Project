import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

class CreateBookingDto {
    classId: number;
}

@ApiTags('booking')
@Controller('booking')
export class BookingController {
    constructor(private bookingService: BookingService) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    @ApiOperation({ summary: 'Book a class or join waitlist' })
    async create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
        // req.user is populated by JwtStrategy
        return this.bookingService.createBooking(req.user.userId, createBookingDto.classId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('my')
    @ApiOperation({ summary: 'Get current user bookings' })
    async getMyBookings(@Request() req) {
        return this.bookingService.getUserBookings(req.user.userId);
    }
}
