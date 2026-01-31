import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BookingModule } from './booking/booking.module';
import { GymModule } from './gym/gym.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
    imports: [
        PrismaModule,
        AuthModule,
        UsersModule,
        BookingModule,
        GymModule,
    ],
})
export class AppModule { }
