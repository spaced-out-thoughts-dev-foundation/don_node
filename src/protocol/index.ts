import { serverLog, PeerConnection, waitForInput, sleep } from "../common";

export async function correspondWithPeer(peer: PeerConnection) {
  let alive = true;
  while (alive) {
    serverLog("Pinging peer...", peer);
    peer[0].send("Ping");

    // Wait for a message from the peer
    const message = await waitForInput(peer[0]);

    if (message === false) {
      // If the peer is no longer alive, break the loop
      alive = false;
      serverLog("Peer is no longer alive", peer);
      peer[0].disconnect();
      serverLog("Disconnected from peer", peer);
      break;
    }


    await sleep(5000);
  }
}