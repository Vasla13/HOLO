// --- SYSTÈME AUDIO ---
// Crée un dossier "sounds" à côté de ton index.html et mets-y tes fichiers .mp3 ou .ogg
const audioSystem = {
    ringtone: new Audio('sounds/ringtone.mp3'),
    accept: new Audio('sounds/accept.mp3'),
    end: new Audio('sounds/end.mp3'),
    glitch: new Audio('sounds/glitch.mp3')
};

// Configuration des sons
audioSystem.ringtone.loop = true; // La sonnerie tourne en boucle
audioSystem.ringtone.volume = 0.4;
audioSystem.accept.volume = 0.6;
audioSystem.end.volume = 0.6;
audioSystem.glitch.volume = 0.3;

function playSound(soundName) {
    if (audioSystem[soundName]) {
        audioSystem[soundName].currentTime = 0; // Remet à zéro
        audioSystem[soundName].play().catch(e => console.log("Audio bloqué par le navigateur", e));
    }
}

function stopSound(soundName) {
    if (audioSystem[soundName]) {
        audioSystem[soundName].pause();
        audioSystem[soundName].currentTime = 0;
    }
}

// --- LOGIQUE UI ---
let timerInterval = null;
let seconds = 0;

window.addEventListener('message', function(event) {
    let data = event.data;

    if (data.action === "incomingCall") {
        document.getElementById('incoming-call').classList.remove('hidden');
        document.getElementById('caller-name').innerText = data.name;
        playSound('ringtone');
    } 
    else if (data.action === "startCallUI") {
        document.getElementById('incoming-call').classList.add('hidden');
        document.getElementById('holo-active').classList.remove('hidden');
        stopSound('ringtone');
        playSound('accept');
        setTimeout(() => playSound('glitch'), 500); // Petit son de parasite après acceptation
        startTimer();
    } 
    else if (data.action === "endCallUI") {
        document.getElementById('incoming-call').classList.add('hidden');
        document.getElementById('holo-active').classList.add('hidden');
        stopSound('ringtone');
        playSound('end');
        stopTimer();
    }
});

function postMsg(endpoint) {
    // Mode Test Navigateur
    if (typeof GetParentResourceName === "undefined") {
        if (endpoint === 'acceptCall') {
            window.postMessage({ action: "startCallUI" }, "*");
        } else if (endpoint === 'declineCall' || endpoint === 'endCall') {
            window.postMessage({ action: "endCallUI" }, "*");
        }
        return;
    }

    // Mode FiveM
    fetch(`https://${GetParentResourceName()}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    });
}

document.getElementById('btn-accept').addEventListener('click', () => postMsg('acceptCall'));
document.getElementById('btn-decline').addEventListener('click', () => postMsg('declineCall'));
document.getElementById('btn-end').addEventListener('click', () => postMsg('endCall'));

function startTimer() {
    seconds = 0;
    document.getElementById('call-timer').innerText = "00:00";
    stopTimer();
    timerInterval = setInterval(() => {
        seconds++;
        let m = Math.floor(seconds / 60).toString().padStart(2, '0');
        let s = (seconds % 60).toString().padStart(2, '0');
        document.getElementById('call-timer').innerText = `${m}:${s}`;
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}   