// --- CONFIGURATION AUDIO ---
const audioDir = 'sounds/';
const sfx = {
    ringtone: new Audio(`${audioDir}ringtone.mp3`),
    accept: new Audio(`${audioDir}accept.mp3`),
    end: new Audio(`${audioDir}end.mp3`),
    glitch: new Audio(`${audioDir}glitch.mp3`)
};

// Réglages audio
sfx.ringtone.loop = true;
sfx.ringtone.volume = 0.3;
Object.values(sfx).forEach(sound => { if(sound !== sfx.ringtone) sound.volume = 0.5; });

function playSound(name) {
    if (sfx[name]) {
        sfx[name].currentTime = 0;
        sfx[name].play().catch(() => {});
    }
}
function stopSound(name) {
    if (sfx[name]) {
        sfx[name].pause();
        sfx[name].currentTime = 0;
    }
}

// --- STATE MANAGER (Gestionnaire d'état) ---
const UI = {
    incoming: document.getElementById('incoming-call'),
    holo: document.getElementById('holo-active'),
    timerText: document.getElementById('call-timer'),
    timerInterval: null,
    seconds: 0,

    // ÉTAPE 1: Afficher l'appel entrant avec animation
    showIncoming(callerName) {
        document.getElementById('caller-name').innerText = callerName;
        
        this.incoming.classList.remove('hidden', 'anim-crt-off');
        this.incoming.classList.add('anim-slide-in');
        
        playSound('ringtone');
    },

    // ÉTAPE 2: Accepter l'appel (Transition de Incoming vers Holo)
    acceptCall() {
        stopSound('ringtone');
        playSound('accept');
        
        // On ferme proprement l'appel entrant
        this.incoming.classList.remove('anim-slide-in');
        this.incoming.classList.add('anim-crt-off');

        // On attend la fin de l'animation de sortie (400ms) pour afficher l'Holo
        setTimeout(() => {
            this.incoming.classList.add('hidden');
            
            // Lancement de l'hologramme avec son animation
            this.holo.classList.remove('hidden', 'anim-crt-off');
            this.holo.classList.add('anim-unfold');
            
            setTimeout(() => playSound('glitch'), 300);
            this.startTimer();
        }, 400);
    },

    // ÉTAPE 3: Raccrocher / Refuser l'appel
    endCall() {
        stopSound('ringtone');
        playSound('end');
        this.stopTimer();

        // Si on était dans l'appel entrant
        if (!this.incoming.classList.contains('hidden')) {
            this.incoming.classList.remove('anim-slide-in');
            this.incoming.classList.add('anim-crt-off');
            setTimeout(() => this.incoming.classList.add('hidden'), 400);
        }

        // Si on était dans l'appel holo
        if (!this.holo.classList.contains('hidden')) {
            this.holo.classList.remove('anim-unfold');
            this.holo.classList.add('anim-crt-off');
            setTimeout(() => this.holo.classList.add('hidden'), 400);
        }
    },

    // --- CHRONOMÈTRE ---
    startTimer() {
        this.seconds = 0;
        this.timerText.innerText = "00:00";
        this.timerInterval = setInterval(() => {
            this.seconds++;
            let m = Math.floor(this.seconds / 60).toString().padStart(2, '0');
            let s = (this.seconds % 60).toString().padStart(2, '0');
            this.timerText.innerText = `${m}:${s}`;
        }, 1000);
    },

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
};

// --- ECOUTEURS D'EVENEMENTS (NUI & Boutons) ---

// Réception des messages Lua (FiveM)
window.addEventListener('message', function(event) {
    let data = event.data;
    if (data.action === "incomingCall") UI.showIncoming(data.name);
    else if (data.action === "startCallUI") UI.acceptCall();
    else if (data.action === "endCallUI") UI.endCall();
});

// Envoi des actions au Lua (ou simulation navigateur)
function triggerAction(actionName) {
    if (typeof GetParentResourceName === "undefined") {
        // Mode Test Navigateur
        if (actionName === 'acceptCall') window.postMessage({ action: "startCallUI" }, "*");
        else window.postMessage({ action: "endCallUI" }, "*");
        return;
    }
    // Mode FiveM
    fetch(`https://${GetParentResourceName()}/${actionName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    });
}

// Clics sur les boutons
document.getElementById('btn-accept').addEventListener('click', () => triggerAction('acceptCall'));
document.getElementById('btn-decline').addEventListener('click', () => triggerAction('declineCall'));
document.getElementById('btn-end').addEventListener('click', () => triggerAction('endCall'));