import { useEffect } from "react"


export const Receiver = () => {
    
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => {
            socket.send(JSON.stringify({
                type: 'receiver'
            }));
        }
        startReceiving(socket);
    }, []);

    function startReceiving(socket) {
        const video = document.createElement('video');
        document.body.appendChild(video);

        const pc = new RTCPeerConnection();
        pc.ontrack = (event) => {
            console.log(event);
            video.srcObject = new MediaStream([event.track]);
            video.play();
        }
        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'createOffer') {
              await pc.setRemoteDescription(message.sdp);
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              socket.send(JSON.stringify({
                type: 'createAnswer',
                sdp: answer
              }));
            } else if (message.type === 'iceCandidate') {
              await pc.addIceCandidate(message.candidate);
            }
          };
          
    }

    return <div>
        recieve
    </div>
}