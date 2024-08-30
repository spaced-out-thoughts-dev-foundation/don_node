"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverLog = serverLog;
exports.clientLog = clientLog;
exports.baseLog = baseLog;
exports.getFormattedTimestamp = getFormattedTimestamp;
exports.waitForInput = waitForInput;
exports.sleep = sleep;
function serverLog(message, peer = null) {
    baseLog(`[Server] ${message}`, peer);
}
function clientLog(message, peer = null) {
    baseLog(`[Client] ${message}`, peer);
}
function baseLog(message, peer = null) {
    if (!peer) {
        console.log(`${getFormattedTimestamp()} - ${message} `);
        return;
    }
    console.log(`${getFormattedTimestamp()} - ${peer[1]} | ${message} `);
}
function getFormattedTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    return `${year} -${month} -${day} ${hours}:${minutes}:${seconds}:${milliseconds} `;
}
function waitForInput(socket, timeout = 5000) {
    return new Promise((resolve) => {
        // Set a timer to resolve false if nothing happens within the timeout
        const timer = setTimeout(() => resolve(false), timeout);
        // Simulate waiting for an event, if it happens, resolve true
        someAsyncEvent(socket).then(() => {
            clearTimeout(timer);
            resolve(true);
        });
    });
}
// Simulating an async event (replace this with your actual event)
function someAsyncEvent(socket) {
    return new Promise((resolve) => {
        socket.once("message", (message) => {
            serverLog(`Received message from peer: ${message} `);
            resolve(true);
        });
    });
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
