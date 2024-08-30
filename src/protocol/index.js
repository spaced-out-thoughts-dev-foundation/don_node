"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.correspondWithPeer = correspondWithPeer;
exports.mainLoop = mainLoop;
const common_1 = require("../common");
function correspondWithPeer(socket, peer, peersFunction) {
    return __awaiter(this, void 0, void 0, function* () {
        socket.on("message", (message) => {
            (0, common_1.serverLog)(`Received message from peer: ${message}`, peer);
            switch (message) {
                case "Catchup":
                    (0, common_1.serverLog)("Peer is catching up", peer);
                    socket.send("Catchup complete");
                    break;
                case "Collaborate":
                    (0, common_1.serverLog)("Peer is collaborating", peer);
                    socket.send("Collaboration complete");
                    break;
                case "Healthcheck":
                    (0, common_1.serverLog)("Peer is alive", peer);
                    socket.send("Alive");
                    break;
                case "GetPeers":
                    (0, common_1.serverLog)("Peer is requesting peers", peer);
                    socket.send(JSON.stringify(peersFunction()));
                    break;
            }
        });
    });
}
// every 5 minutes
function shouldPerformConsensus() {
    const now = new Date();
    return now.getSeconds() === 15 && now.getMinutes() % 1 === 0;
}
// every 3 minutes
function shouldConfirmCatchup() {
    const now = new Date();
    return now.getSeconds() === 30 && now.getMinutes() % 1 === 0;
}
// every minute
function shouldGetPeers() {
    const now = new Date();
    return now.getSeconds() === 0;
}
function mainLoop(socket, peer, peersFunction) {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            console.log(`[DEBUG]: ${new Date().getSeconds()}`);
            if (shouldPerformConsensus()) {
                (0, common_1.serverLog)("Performing consensus...");
                peersFunction().forEach((peer) => {
                    console.log(`[DEBUG]: Performing consensus with peer ${peer[1]}`);
                    if (peer[0] === undefined) {
                        return;
                    }
                    socket.emit("message", "Collaborate");
                });
            }
            if (shouldConfirmCatchup()) {
                (0, common_1.serverLog)("Confirming catchup...");
                peersFunction().forEach((peer) => {
                    console.log(`[DEBUG]: Confirming catchup with peer ${peer[1]}`);
                    if (peer[0] === undefined) {
                        return;
                    }
                    socket.emit(peer[0]).emit("message", "Catchup");
                });
            }
            if (shouldGetPeers()) {
                (0, common_1.serverLog)("Getting peers...");
                peersFunction().forEach((peer) => {
                    console.log(`[DEBUG]: Getting peers from ${peer[1]}`);
                    if (peer[0] === undefined) {
                        return;
                    }
                    socket.emit(peer[0]).emit("message", "GetPeers");
                });
            }
            yield (0, common_1.sleep)(1000);
        }
    });
}
// let alive = true;
// while (alive) {
//   serverLog("Pinging peer...", peer);
//   socket.send("Ping");
//   // Wait for a message from the peer
//   const message = await waitForInput(socket);
//   // if (message === false) {
//   //   // If the peer is no longer alive, break the loop
//   //   alive = false;
//   //   serverLog("Peer is no longer alive", peer);
//   //   socket.disconnect();
//   //   serverLog("Disconnected from peer", peer);
//   //   break;
//   // }
//   await sleep(5000);
// }
// healthcheck
// getPeers
// collaborate
// catchup
