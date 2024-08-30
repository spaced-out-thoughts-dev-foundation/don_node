import { Socket } from "socket.io";

export type PeerConnection = [string | undefined, string];

export function serverLog(message: string, peer: PeerConnection | null = null) {
  baseLog(`[Server] ${message}`, peer);
}

export function clientLog(message: string, peer: PeerConnection | null = null) {
  baseLog(`[Client] ${message}`, peer);
}

export function baseLog(message: string, peer: PeerConnection | null = null) {
  if (!peer) {
    console.log(`${getFormattedTimestamp()} - ${message} `);
    return;
  }

  console.log(`${getFormattedTimestamp()} - ${peer[1]} | ${message} `);
}

export function getFormattedTimestamp() {
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

export function waitForInput(socket: Socket, timeout: number = 5000): Promise<boolean> {
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
function someAsyncEvent(socket: Socket): Promise<boolean> {
  return new Promise((resolve) => {
    socket.once("message", (message: string) => {
      serverLog(`Received message from peer: ${message} `);

      resolve(true);
    });
  });
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}