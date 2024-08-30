import { Server } from "socket.io";
import { io } from "socket.io-client";
import { clientLog, PeerConnection, serverLog, sleep } from "./common";
import { correspondWithPeer } from "./protocol";

// every 5 minutes
function shouldPerformConsensus(): boolean {
  const now = new Date();
  return now.getSeconds() === 15 && now.getMinutes() % 5 === 0;
}

// every 3 minutes
function shouldConfirmCatchup(): boolean {
  const now = new Date();
  return now.getSeconds() === 30 && now.getMinutes() % 3 === 0;
}

// every minute
function shouldGetPeers(): boolean {
  const now = new Date();
  return now.getSeconds() === 0;
}

export class DON_Node {
  port: number;
  server: Server;
  peers: PeerConnection[] = [];
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

      this.peers.push([socket.id, clientIp]);

      const peer: PeerConnection = [socket.id, server];
      socket.on("message", (message: string) => {
        serverLog(`Received message from peer: ${message}`, peer);

        switch (message) {
          case "Catchup":
            serverLog("Peer is catching up", peer);
            socket.send("Catchup complete");
            break;

          case "Collaborate":
            serverLog("Peer is collaborating", peer);
            socket.send("Collaboration complete");
            break;

          case "Healthcheck":
            serverLog("Peer is alive", peer);
            socket.send("Alive");
            break;

          case "GetPeers":
            serverLog("Peer is requesting peers", peer);
            socket.send(JSON.stringify(this.peers));
            break;
        }
      });
    });
  }

  async start() {
    this.server.listen(3000);
    serverLog(`Node is running on port ${this.port}`);

    if (!this.isBootstrap) {
      this.bootstrapServer();
    }

    serverLog("Node is running...");
    while (true) {
      console.log(`[DEBUG]: ${new Date().getSeconds()}`);

      if (shouldPerformConsensus()) {
        serverLog("Performing consensus...");
        this.peers.forEach((peer) => {
          console.log(`[DEBUG]: Performing consensus with peer ${peer[1]}`);
          if (peer[0] === undefined) {
            return;
          }
          this.server.to(peer[0]).emit("message", "Collaborate");
        });
      }

      if (shouldConfirmCatchup()) {
        serverLog("Confirming catchup...");
        this.peers.forEach((peer) => {
          console.log(`[DEBUG]: Confirming catchup with peer ${peer[1]}`);
          if (peer[0] === undefined) {
            return;
          }
          this.server.to(peer[0]).emit("message", "Catchup");
        });
      }

      if (shouldGetPeers()) {
        serverLog("Getting peers...");
        this.peers.forEach((peer) => {
          console.log(`[DEBUG]: Getting peers from ${peer[1]}`);
          if (peer[0] === undefined) {
            return;
          }
          this.server.to(peer[0]).emit("message", "GetPeers");
        });
      }

      await sleep(1000);
    }
  }

  bootstrapServer() {
    clientLog("Bootstrapping...");

    this.BOOTSTRAP_SERVERS.forEach((server) => {
      const socket = io(server);
      socket.on("connect", () => {
        clientLog("Connected to bootstrap server: " + server);
        this.peers.push([socket.id, server]);
      });

      // socket.on("message", (message: string) => {
      //   clientLog(`Received message from bootstrap server: ${message}`, [socket.id, server]);
      //   // socket.emit("message", "Pong");
      // });


      const peer: PeerConnection = [socket.id, server];
      socket.on("message", (message: string) => {
        serverLog(`Received message from peer: ${message}`, peer);

        switch (message) {
          case "Catchup":
            serverLog("Peer is catching up", peer);
            socket.send("Catchup complete");
            break;

          case "Collaborate":
            serverLog("Peer is collaborating", peer);
            socket.send("Collaboration complete");
            break;

          case "Healthcheck":
            serverLog("Peer is alive", peer);
            socket.send("Alive");
            break;

          case "GetPeers":
            serverLog("Peer is requesting peers", peer);
            socket.send(JSON.stringify(this.peers));
            break;
        }
      });
    });
  }
}