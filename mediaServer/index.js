import express from 'express';
import { WebSocketServer } from 'ws';
import SimplePeer from 'simple-peer';

const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// WebSocket server setup
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Create a SimplePeer instance for handling WebRTC connections
  const peer = new SimplePeer({ initiator: false });

  // Handle incoming messages from the client
  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === 'createOffer' || parsedMessage.type === 'createAnswer') {
      peer.signal(parsedMessage.sdp);
    } else if (parsedMessage.type === 'iceCandidate') {
      peer.signal({ ice: parsedMessage.candidate });
    }
  });

  // Handle peer signaling
  peer.on('signal', (data) => {
    ws.send(JSON.stringify(data));
  });

  // Handle peer connection and stream
  peer.on('connect', () => {
    console.log('Peer connected');
  });

  peer.on('stream', (stream) => {
    console.log('Received stream');
    // Forward the stream to the client if needed
    // In this example, the stream is simply logged
  });

  peer.on('data', (data) => {
    console.log('Received data:', data.toString());
  });

  // Handle WebSocket closure
  ws.on('close', () => {
    console.log('Client disconnected');
  });

  // Send an initial message to the client to start the connection
  ws.send(JSON.stringify({ type: 'createOffer' }));
});
