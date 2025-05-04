import React, { useRef, useState } from 'react';
import io from 'socket.io-client';
import { v4 as uuidV4 } from 'uuid';

const socket = io('https://social-media-app-0uma.onrender.com'); // ✅ Change port if needed

function Audio() {
  const localAudio = useRef(null);
  const peerRef = useRef(null);

  const [isCalling, setIsCalling] = useState(false);
  const [socketId, setSocketId] = useState('');
  const [targetSocketId, setTargetSocketId] = useState('');

  React.useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected with socket ID:', socket.id);
      setSocketId(socket.id);
    });

    socket.on('call-made', async data => {
      console.log('Incoming call...');
      const peer = createPeer(null, false);
      peerRef.current = peer;

      await peer.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.emit('make-answer', {
        answer,
        to: data.socket,
      });
    });

    socket.on('answer-made', async data => {
      console.log('Answer received!');
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
    });

    return () => {
      socket.off('connect');
      socket.off('call-made');
      socket.off('answer-made');
    };
  }, []);

  const createPeer = (stream, initiator = true) => {
    const peer = new RTCPeerConnection();

    if (stream) {
      stream.getTracks().forEach(track => peer.addTrack(track, stream));
    }

    peer.ontrack = event => {
      const remoteStream = event.streams[0];
      if (localAudio.current) {
        localAudio.current.srcObject = remoteStream;
      }
    };

    return peer;
  };

  const startCall = () => {
    setIsCalling(true);

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        if (localAudio.current) {
          localAudio.current.srcObject = stream;
        }

        const peer = createPeer(stream);
        peerRef.current = peer;

        peer.createOffer()
          .then(offer => {
            return peer.setLocalDescription(offer);
          })
          .then(() => {
            if (targetSocketId) {
              socket.emit('call-user', {
                offer: peerRef.current.localDescription,
                to: targetSocketId,
              });
            }
          });
      })
      .catch(err => {
        console.error("Error accessing microphone", err);
        setIsCalling(false);
      });
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Audio Calling App 🎧</h2>

      <p>Your Socket ID: <strong>{socketId}</strong></p>

      <input
        type="text"
        placeholder="Enter Target Socket ID"
        value={targetSocketId}
        onChange={(e) => setTargetSocketId(e.target.value)}
        style={{ padding: '8px', width: '300px' }}
      />

      <br /><br />

      {!isCalling ? (
        <button onClick={startCall} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Start Audio Call
        </button>
      ) : (
        <audio ref={localAudio} autoPlay controls />
      )}
    </div>
  );
}

export default Audio;
