const localVideo = document.getElementById("localVideo") as HTMLVideoElement;
const remoteVideo = document.getElementById("remoteVideo") as HTMLVideoElement;
const startBtn = document.getElementById("startBtn") as HTMLButtonElement;
const callBtn = document.getElementById("callBtn") as HTMLButtonElement;
const hangupBtn = document.getElementById("hangupBtn") as HTMLButtonElement;
const muteBtn = document.getElementById("muteBtn") as HTMLButtonElement;

let localStream: MediaStream;
let peerConnection: RTCPeerConnection | null = null;
let isMuted = false;

const ws = new WebSocket("ws://localhost:4000");
const configuration: RTCConfiguration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

// --- Démarrer caméra + micro ---
async function startCamera() {
    if (!localStream) {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
        localVideo.muted = true;
        localVideo.autoplay = true;
        localVideo.playsInline = true;
        console.log("Caméra et micro B démarrés ✅");
    }
}

startBtn.onclick = startCamera;

// --- Mute / Unmute ---
muteBtn.onclick = () => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
    });
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? "Unmute" : "Mute";
    console.log(`Micro ${isMuted ? "désactivé ❌" : "activé ✅"}`);
};

// --- Créer PeerConnection ---
function createPeerConnection() {
    peerConnection = new RTCPeerConnection(configuration);

    localStream.getTracks().forEach(track => peerConnection!.addTrack(track, localStream));

    const remoteStream = new MediaStream();
    remoteVideo.srcObject = remoteStream;
    remoteVideo.autoplay = true;
    remoteVideo.playsInline = true;
    remoteVideo.muted = false;

    peerConnection.ontrack = (event) => {
        remoteStream.addTrack(event.track);
        console.log("Track distante reçue sur B ✅");
    };

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) ws.send(JSON.stringify({ type: "ice", candidate: event.candidate }));
    };

    console.log("PeerConnection B créée ✅");
}

// --- Bouton Call ---
callBtn.onclick = async () => {
    await startCamera();
    if (!peerConnection) createPeerConnection();
};

// --- Quitter ---
hangupBtn.onclick = () => {
    if (peerConnection) peerConnection.close();
    peerConnection = null;
    console.log("Call B terminé ❌");
};

// --- Signalisation ---
ws.onmessage = async (event) => {
    let dataStr = "";
    if (typeof event.data === "string") dataStr = event.data;
    else if (event.data instanceof Blob) dataStr = await event.data.text();

    const data = JSON.parse(dataStr);

    if (data.type === "offer") {
        await startCamera();
        if (!peerConnection) createPeerConnection();

        await peerConnection.setRemoteDescription({ type: "offer", sdp: data.sdp });
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        ws.send(JSON.stringify({ type: "answer", sdp: answer.sdp }));
        console.log("Réponse envoyée par B ✅");
    } else if (data.type === "ice" && data.candidate) {
        if (peerConnection) await peerConnection.addIceCandidate(data.candidate);
    }
};

ws.onopen = () => console.log("WebSocket B connecté ✅");
