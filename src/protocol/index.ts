import { Socket } from "socket.io";
import { serverLog, PeerConnection, waitForInput, sleep } from "../common";

export async function correspondWithPeer(socket: any, peer: PeerConnection, peersFunction: () => PeerConnection[]) {
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
        socket.send(JSON.stringify(peersFunction()));
        break;
    }
  });

  while (true) {
    console.log(`[DEBUG]: ${new Date().getSeconds()}`);

    if (shouldPerformConsensus()) {
      serverLog("Performing consensus...");
      peersFunction().forEach((peer) => {
        console.log(`[DEBUG]: Performing consensus with peer ${peer[1]}`);
        if (peer[0] === undefined) {
          return;
        }
        socket.emit("message", "Collaborate");
      });
    }

    if (shouldConfirmCatchup()) {
      serverLog("Confirming catchup...");
      peersFunction().forEach((peer) => {
        console.log(`[DEBUG]: Confirming catchup with peer ${peer[1]}`);
        if (peer[0] === undefined) {
          return;
        }
        socket.emit(peer[0]).emit("message", "Catchup");
      });
    }

    if (shouldGetPeers()) {
      serverLog("Getting peers...");
      peersFunction().forEach((peer) => {
        console.log(`[DEBUG]: Getting peers from ${peer[1]}`);
        if (peer[0] === undefined) {
          return;
        }
        socket.emit(peer[0]).emit("message", "GetPeers");
      });
    }

    if (shouldSendHealthcheck()) {
      serverLog("Sending healthcheck...");
      peersFunction().forEach((peer) => {
        console.log(`[DEBUG]: Sending healthcheck to ${peer[1]}`);
        if (peer[0] === undefined) {
          return;
        }
        socket.emit(peer[0]).emit("message", "Healthcheck");
      });
    }

    await sleep(1000);
  }
}

// every 5 minutes
function shouldPerformConsensus(): boolean {
  const now = new Date();
  return now.getSeconds() === 15 && now.getMinutes() % 1 === 0;
}

// every 3 minutes
function shouldConfirmCatchup(): boolean {
  const now = new Date();
  return now.getSeconds() === 30 && now.getMinutes() % 1 === 0;
}

// every minute
function shouldGetPeers(): boolean {
  const now = new Date();
  return now.getSeconds() === 0;
}


// every minute
function shouldSendHealthcheck(): boolean {
  const now = new Date();
  return now.getSeconds() === 0;
}