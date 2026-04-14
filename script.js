// --- CONFIGURATION AUDIO ---
// Intégration de tes nouveaux sons présents à la racine
const sfx = {
    ringtone: new Audio('Ringtone.mp3'),
    accept: new Audio('ui_phone_incoming_call_positive.MP3'),
    decline: new Audio('ui_phone_incoming_call_negative.MP3'),
    outgoing: new Audio('outgoing call.MP3') // Chargé au cas où pour de futurs appels sortants
};

// Réglages audio (Ajuste les volumes si les sons sont trop forts/faibles)
sfx.ringtone.loop = true;
sfx.ringtone.volume = 0.3;
if(sfx.accept) sfx.accept.volume = 0.5;
if(sfx.decline) sfx.decline.volume = 0.5;
if(sfx.outgoing) sfx.outgoing.volume = 0.5;

function playSound(name) {
    if (sfx[name]) {
        sfx[name].currentTime = 0;
        sfx[name].play().catch((e) => console.log("Audio bloqué par le navigateur :", e));
    }
}

function stopSound(name) {
    if (sfx[name]) {
        sfx[name].pause();
        sfx[name].currentTime = 0;
    }
}

// --- STATE MANAGER ---
const UI = {
    incoming: document.getElementById('incoming-call'),
    holo: document.getElementById('holo-active'),
    timerText: document.getElementById('call-timer'),
    timerInterval: null,
    seconds: 0,

    showIncoming(callerName) {
        document.getElementById('caller-name').innerText = callerName;
        this.incoming.classList.remove('hidden', 'anim-crt-off');
        this.incoming.classList.add('anim-slide-in');
        
        // Lance la sonnerie quand ça appelle
        playSound('ringtone');
    },

    acceptCall() {
        stopSound('ringtone');
        // Joue le son positif ("Accepter")
        playSound('accept'); 
        
        this.incoming.classList.remove('anim-slide-in');
        this.incoming.classList.add('anim-crt-off');

        setTimeout(() => {
            this.incoming.classList.add('hidden');
            this.holo.classList.remove('hidden', 'anim-crt-off');
            this.holo.classList.add('anim-unfold');
            this.startTimer();
        }, 400);
    },

    endCall() {
        stopSound('ringtone');
        // Joue le son négatif ("Raccrocher / Déconnecter")
        playSound('decline'); 
        
        this.stopTimer();

        if (!this.incoming.classList.contains('hidden')) {
            this.incoming.classList.remove('anim-slide-in');
            this.incoming.classList.add('anim-crt-off');
            setTimeout(() => this.incoming.classList.add('hidden'), 400);
        }

        if (!this.holo.classList.contains('hidden')) {
            this.holo.classList.remove('anim-unfold');
            this.holo.classList.add('anim-crt-off');
            setTimeout(() => this.holo.classList.add('hidden'), 400);
        }
    },

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

// --- ECOUTEURS D'EVENEMENTS ---
window.addEventListener('message', function(event) {
    let data = event.data;
    if (data.action === "incomingCall") UI.showIncoming(data.name);
    else if (data.action === "startCallUI") UI.acceptCall();
    else if (data.action === "endCallUI") UI.endCall();
});

function triggerAction(actionName) {
    if (typeof GetParentResourceName === "undefined") {
        if (actionName === 'acceptCall') window.postMessage({ action: "startCallUI" }, "*");
        else window.postMessage({ action: "endCallUI" }, "*");
        return;
    }
    fetch(`https://${GetParentResourceName()}/${actionName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    });
}

// Relier les clics aux actions
document.getElementById('btn-accept').addEventListener('click', () => triggerAction('acceptCall'));
document.getElementById('btn-decline').addEventListener('click', () => triggerAction('endCall'));
document.getElementById('btn-end').addEventListener('click', () => triggerAction('endCall'));