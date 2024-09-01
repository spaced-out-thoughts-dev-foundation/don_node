export interface DONSocket {
  on: (event: string, callback: (data: any) => void) => void;
  emit: (event: string, data: any) => void;
  once: (event: string, callback: (data: any) => void) => void;
  disconnect: () => void;
}

export class NodeConnection {
  CONNECTION_TIMEOUT: number = 30; // 60 ticks is roughly 1 minute
  GET_PEERS_INTERVAL: number = 180; // 180 ticks is roughly 3 minutes

  // Healthcheck
  MESSAGE_SEND_HEALTHCHECK = "Healthcheck_PING";
  MESSAGE_RECEIVE_HEALTHCHECK = "Healthcheck_PONG";
  // Identity
  MESSAGE_SEND_IDENTITY = "Identity_REQUEST";
  MESSAGE_RECEIVE_IDENTITY = "Identity_RESPONSE";
  // GetPeers
  MESSAGE_SEND_GET_PEERS = "GetPeers_REQUEST";
  MESSAGE_RECEIVE_GET_PEERS = "GetPeers_RESPONSE";

  socket: DONSocket;
  ticksSinceLastHealthcheck: number = 0;
  ticksSinceLastGetPeers: number = 0;
  host: string;
  destination: string = '';
  getPeers: () => NodeConnection[];
  syncPeers: (peers: string[]) => void;
  removePeer: (peer: NodeConnection) => void;
  alive: boolean = true;
  hostname: string;
  destinationName: string | null;

  constructor(socket: DONSocket, host: string, hostname: string, destination: string | null, destinationName: null, getPeers: () => NodeConnection[], syncPeers: (peers: string[]) => void, removePeer: (peer: NodeConnection) => void) {
    this.socket = socket;
    this.host = host;
    this.hostname = hostname;
    this.getPeers = getPeers;
    this.syncPeers = syncPeers;
    this.removePeer = removePeer;
    this.destination = destination || '';
    this.destinationName = destinationName || '';

    this.sendMessage(this.MESSAGE_SEND_IDENTITY);
    this.sendMessage(this.MESSAGE_SEND_GET_PEERS);

    socket.on("message", (message: string) => this.handleMessage(message));

    socket.on(this.MESSAGE_RECEIVE_IDENTITY, (response: string) => {

      this.destination = response.split(":").slice(0, 2).join(":");
      this.destinationName = response.split(":")[2];
    });

    socket.on(this.MESSAGE_RECEIVE_GET_PEERS, (peers: string[]) => {
      console.log(`[${this.destination}:${this.destinationName}] Peers: ${peers}`);
      peers = peers.map((peer) => peer.split(":").slice(0, 2).join(":"));
      this.syncPeers(peers);
    });

    this.socket.on("disconnect", () => {
      console.log(`Peer disconnected: ${this.destination}:${this.destinationName}`);
      this.removePeer(this);
      this.alive = false;
      this.socket.disconnect();
    });
  }

  disconnect() {
    this.alive = false;
    this.socket.disconnect();
  }

  async execute() {
    while (this.alive) {
      if (this.ticksSinceLastHealthcheck > this.CONNECTION_TIMEOUT) {
        console.log("Connection timed out. Disconnecting...");
        this.socket.disconnect();
        this.removePeer(this);
        this.alive = false;
        break;
      }

      if (this.ticksSinceLastHealthcheck > this.CONNECTION_TIMEOUT / 2) {
        this.sendMessage(this.MESSAGE_SEND_HEALTHCHECK);
      }

      if (this.ticksSinceLastGetPeers > this.GET_PEERS_INTERVAL) {
        this.sendMessage(this.MESSAGE_SEND_GET_PEERS);
        this.ticksSinceLastGetPeers = 0;
      }

      this.ticksSinceLastHealthcheck++;
      this.ticksSinceLastGetPeers++;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  async handleMessage(message: string) {
    // any message indicates that the peer is alive
    this.ticksSinceLastHealthcheck = 0;

    console.log(`[${this.destination}:${this.destinationName}] Received message: ${message}`);

    switch (message) {
      case this.MESSAGE_SEND_HEALTHCHECK:
        this.sendMessage(this.MESSAGE_RECEIVE_HEALTHCHECK);
        break;

      case this.MESSAGE_SEND_IDENTITY:
        this.socket.emit(this.MESSAGE_RECEIVE_IDENTITY, `${this.host}:${this.hostname}`);
        break;

      case this.MESSAGE_SEND_GET_PEERS:
        this.socket.emit(this.MESSAGE_RECEIVE_GET_PEERS, this.getPeers().map((peer) => `${peer.destination}:${peer.destinationName}`));
        break;
    }
  }

  sendMessage(message: string) {
    this.socket.emit("message", message);
  }
}