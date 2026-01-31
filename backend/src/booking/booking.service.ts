import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingService {
    constructor(private prisma: PrismaService) { }

    async createBooking(userId: number, classId: number) {
        // 1. Check Class Existence
        const gymClass = await this.prisma.class.findUnique({
            where: { id: classId },
            include: { bookings: true }
        });
        if (!gymClass) throw new NotFoundException('Class not found');

        // 2. Check Double Booking
        const existing = await this.prisma.booking.findUnique({
            where: { userId_classId: { userId, classId } }
        });
        if (existing) throw new BadRequestException('Already booked this class');

        // 3. Check Capacity
        const currentBookings = gymClass.bookings.length;
        if (currentBookings >= gymClass.capacity) {
            // 4. Add to Waitlist
            await this.prisma.waitingList.create({
                data: { userId, classId }
            });
            return { message: 'Class is full. Added to waiting list.' };
        }

        // 5. Create Booking
        const booking = await this.prisma.booking.create({
            data: { userId, classId }
        });

        return { message: 'Booking confirmed', booking };
    }

    async getUserBookings(userId: number) {
        return this.prisma.booking.findMany({
            where: { userId },
            include: { class: true }
        });
    }
}
