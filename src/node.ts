import { Server } from "socket.io";
import { io } from "socket.io-client";
import { getLocalIP, getUniqueValues, generateRandomString } from "./common";
import { NodeConnection, DONSocket } from "./connection";
import { Logger } from "./logger";

export class DON_Node {
  port: number;
  server: Server;
  peers: NodeConnection[] = [];
  isBootstrap: boolean = false;
  ipAddress: string | undefined;
  name: string;
  logger: Logger;

  BOOTSTRAP_SERVERS = ["192.168.4.138:6000"];

  constructor(port: number, isBootstrap: boolean = false) {
    this.port = port;
    this.ipAddress = getLocalIP();
    this.server = new Server({ /* options */ });
    this.isBootstrap = isBootstrap;
    this.name = generateRandomString();
    this.logger = new Logger(`${this.whoAmI().location}:${this.name}`);

    this.setupServer();
  }

  generateNewConnection(socket: DONSocket) {
    return new NodeConnection(socket, this.whoAmI().location, this.whoAmI().name, null, null, () => this.peers, (peers) => this.syncPeers(peers), (connection) => this.removePeer(connection));
  }

  handleNewConnection(socket: DONSocket) {
    this.logger.log("New connection");
    const connection: NodeConnection = this.generateNewConnection(socket);
    connection.execute();
    this.peers.push(connection);
  }

  setupServer() {
    this.server.on("connection", (socket) => this.handleNewConnection(socket));
  }

  removePeer(peer: NodeConnection) {
    this.peers = this.peers.filter((existingPeer) => existingPeer !== peer);
  }

  async syncPeers(peers: string[]) {
    const peersToConnect = peers.filter((peer) => {
      return peer.trim() != '' && peer != this.whoAmI().location && !this.peers.some((existingPeer) => existingPeer.destination === peer);
    });

    if (peersToConnect.length === 0) {
      return;
    }

    getUniqueValues(peersToConnect).forEach((peer) => {
      if (!this.peers.some((existingPeer) => existingPeer.destination === peer)) {
        const socket = io(`http://${peer}`);
        socket.on("connect", () => this.handleNewConnection(socket));
      }
    });
  }

  async start() {
    this.server.listen(this.port);
    this.logger.log(`Node is running at: :${this.whoAmI().location} with name: ${this.name}`);

    await this.bootstrapServer();

    let ticks = 0;
    while (true) {
      ticks += 1;

      if (ticks === 10) {
        this.logger.log(`[DIAGNOSTIC] Connections Hosted: ${this.server.sockets.sockets.size}`);
        if (this.peers.length !== 0) {
          this.logger.log(`\n[DIAGNOSTIC]\tPeers: \n[DIAGNOSTIC]\t\t* ${this.peers.map((peer) => `${peer.destination}:${peer.destinationName}`).join("\n[DIAGNOSTIC]\t\t* ")}`);
        }
        ticks = 0;

        // TODO: if we are not connected to a bootstrap server, try to reconnect to it
      }

      // temp solution + need to make sure we dont accidentally kill the final connection
      const tempPeerHash: { [key: string]: boolean } = {};
      this.peers.forEach((peer) => {
        if (peer.destination) {
          if (!tempPeerHash[peer.destination]) {
            tempPeerHash[peer.destination] = true;
          } else {
            this.logger.log(`Removing duplicate peer: ${peer.destination}`);
            this.removePeer(peer);
            peer.disconnect();
          }
        }
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  async bootstrapServer() {
    this.logger.log("Bootstrapping...");

    this.BOOTSTRAP_SERVERS.forEach(async (server) => {
      if (this.whoAmI().location !== server) {
        this.logger.log(`Connecting to bootstrap server: ${server}`);
        const socket = io(`http://${server}`);
        socket.on("connect", () => this.handleNewConnection(socket));
      }
    });
  }

  whoAmI() {
    return { location: `${this.ipAddress}:${this.port}`, name: this.name };
  }
}