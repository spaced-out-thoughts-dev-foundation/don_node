interface DONSocket {
  on: (event: string, callback: (data: any) => void) => void;
  emit: (event: string, data: any) => void;
  once: (event: string, callback: (data: any) => void) => void;
  disconnect: () => void;
}

class NodeConnection {
  CONNECTION_TIMEOUT: number = 60; // 60 ticks is roughly 1 minute
  MESSAGE_SEND_HEALTHCHECK = "Healthcheck_PING";
  MESSAGE_RECEIVE_HEALTHCHECK = "Healthcheck_PONG";

  socket: DONSocket;
  ticksSinceLastHealthcheck: number = 0;

  constructor(socket: DONSocket) {
    this.socket = socket;

    socket.on("message", (message: string) => this.handleMessage(message));
  }

  async execute() {
    while (true) {
      if (this.ticksSinceLastHealthcheck > this.CONNECTION_TIMEOUT) {
        console.log("Connection timed out. Disconnecting...");
        this.socket.disconnect();
        break;
      }

      if (this.ticksSinceLastHealthcheck > 30) {
        this.sendMessage(this.MESSAGE_SEND_HEALTHCHECK);
      }

      this.ticksSinceLastHealthcheck++;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  async handleMessage(message: string) {
    // any message indicates that the peer is alive
    this.ticksSinceLastHealthcheck = 0;

    switch (message) {
      case this.MESSAGE_SEND_HEALTHCHECK:
        this.sendMessage(this.MESSAGE_RECEIVE_HEALTHCHECK);
        break;
    }
  }

  sendMessage(message: string) {
    this.socket.emit("message", message);
  }
}