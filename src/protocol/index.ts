import { Socket } from "socket.io";
import { serverLog, PeerConnection, waitForInput, sleep } from "../common";

export async function correspondWithPeer(socket: Socket, peer: PeerConnection, peersFunction: () => PeerConnection[]) {
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

  let alive = true;
  while (alive) {
    serverLog("Pinging peer...", peer);
    socket.send("Ping");

    // Wait for a message from the peer
    const message = await waitForInput(socket);

    // if (message === false) {
    //   // If the peer is no longer alive, break the loop
    //   alive = false;
    //   serverLog("Peer is no longer alive", peer);
    //   socket.disconnect();
    //   serverLog("Disconnected from peer", peer);
    //   break;
    // }


    await sleep(5000);
  }
}

// healthcheck
// getPeers
// collaborate
// catchup

