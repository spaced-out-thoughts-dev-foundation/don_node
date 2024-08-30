import { Server } from "socket.io";
import { io } from "socket.io-client";
import { clientLog, PeerConnection, serverLog } from "./common";
import { correspondWithPeer } from "./protocol";


export class DON_Node {
  port: number;
  server: Server;
  inboundPeers: PeerConnection[] = [];
  outboundPeers: PeerConnection[] = [];
  bootstrapped: boolean = false;

  BOOTSTRAP_SERVERS = ["http://localhost:3000"];

  constructor(port: number) {
    this.port = port;
    this.server = new Server({ /* options */ });

    this.setupServer();
  }

  setupServer() {
    this.server.on("connection", (socket) => {
      const clientIp = socket.handshake.address;

      serverLog("A user connected", [socket, clientIp]);

      this.inboundPeers.push([socket, clientIp]);

      correspondWithPeer([socket, clientIp]);
    });
  }

  start() {
    this.server.listen(3000);
    serverLog(`Node is running on port ${this.port}`);

    this.bootstrap();
  }

  bootstrap() {
    clientLog("Bootstrapping...");
    this.bootstrapServer();
  }

  bootstrapServer() {
    this.BOOTSTRAP_SERVERS.forEach((server) => {
      const socket = io(server);
      socket.on("connect", () => {
        clientLog("Connected to bootstrap server: " + server);

        // this.outboundPeers.push([socket, server]);
      });

      socket.on("message", (message: string) => {
        clientLog(`Received message from bootstrap server: ${message}`);
        socket.emit("message", "Pong");
      });
    });
  }
}