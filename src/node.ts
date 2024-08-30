import { Server } from "socket.io";
import { io } from "socket.io-client";
import { clientLog, PeerConnection, serverLog } from "./common";
import { correspondWithPeer } from "./protocol";


export class DON_Node {
  port: number;
  server: Server;
  inboundPeers: PeerConnection[] = [];
  outboundPeers: PeerConnection[] = [];
  isBootstrap: boolean = false;

  BOOTSTRAP_SERVERS = ["http://192.168.4.140:3000"];

  constructor(port: number, isBootstrap: boolean = false) {
    this.port = port;
    this.server = new Server({ /* options */ });
    this.isBootstrap = isBootstrap;

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

    if (!this.isBootstrap) {
      this.bootstrap();
    }
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