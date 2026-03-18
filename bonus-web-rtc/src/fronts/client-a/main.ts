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
startBtn.onclick = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;
    localVideo.muted = true;
    localVideo.autoplay = true;
    localVideo.playsInline = true;
    console.log("Caméra et micro A démarrés ✅");
};

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
        console.log("Track distante reçue sur A ✅");
    };

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) ws.send(JSON.stringify({ type: "ice", candidate: event.candidate }));
    };

    console.log("PeerConnection A créée ✅");
}

// --- Bouton Call ---
callBtn.onclick = async () => {
    if (!localStream) return alert("Démarrez la caméra d'abord !");
    if (!peerConnection) createPeerConnection();

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    ws.send(JSON.stringify({ type: "offer", sdp: offer.sdp }));
    console.log("Offre envoyée par A ✅");
};

// --- Quitter ---
hangupBtn.onclick = () => {
    if (peerConnection) peerConnection.close();
    peerConnection = null;
    console.log("Call A terminé ❌");
};

// --- Signalisation ---
ws.onmessage = async (event) => {
    let dataStr = "";
    if (typeof event.data === "string") dataStr = event.data;
    else if (event.data instanceof Blob) dataStr = await event.data.text();

    const data = JSON.parse(dataStr);

    if (!peerConnection) return;

    if (data.type === "answer") {
        await peerConnection.setRemoteDescription({ type: "answer", sdp: data.sdp });
        console.log("Réponse reçue par A ✅");
    } else if (data.type === "ice" && data.candidate) {
        await peerConnection.addIceCandidate(data.candidate);
    }
};

ws.onopen = () => console.log("WebSocket A connecté ✅");
