import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class GymGateway implements OnGatewayInit {
    @WebSocketServer()
    server: Server;

    afterInit(server: Server) {
        // Simulate real-time traffic updates every 5 seconds
        setInterval(() => {
            const liveTraffic = Math.floor(Math.random() * (95 - 40 + 1)) + 40; // Random between 40-95
            this.server.emit('traffic_update', { percentage: liveTraffic });
        }, 5000);
    }
}
