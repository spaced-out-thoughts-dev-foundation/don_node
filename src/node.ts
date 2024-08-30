import { Server } from "socket.io";
import { io } from "socket.io-client";
import { clientLog, serverLog } from "./common";
// import { correspondWithPeer, mainLoop } from "./protocol";

export class DON_Node {
  port: number;
  server: Server;
  peers: NodeConnection[] = [];
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

      serverLog("A user connected", [socket.id, clientIp]);
      const connection: NodeConnection = new NodeConnection(socket);
      connection.execute();
      this.peers.push(connection);
    });
  }

  async start() {
    this.server.listen(this.port);
    serverLog(`Node is running on port ${this.port}`);

    if (!this.isBootstrap) {
      await this.bootstrapServer();
    }

    serverLog("Node is running...");
  }

  async bootstrapServer() {
    clientLog("Bootstrapping...");

    this.BOOTSTRAP_SERVERS.forEach(async (server) => {
      const socket = io(server);
      socket.on("connect", async () => {
        clientLog("Connected to bootstrap server: " + server);
        const connection: NodeConnection = new NodeConnection(socket);
        connection.execute();
        this.peers.push(connection);
      });
    });
  }
}