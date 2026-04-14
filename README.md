# 🌆 Cyberpunk HoloCall UI - Pro Edition

Une interface utilisateur (UI) d'appel téléphonique holographique immersive, fortement inspirée par l'esthétique Kiroshi Optics et le HUD de **Cyberpunk 2077**. 
Ce projet est conçu pour être utilisé comme une interface NUI sur **FiveM** (GTA V Roleplay), mais peut également fonctionner de manière autonome (standalone) dans un navigateur web.

## ✨ Fonctionnalités

- **Esthétique Cyberpunk** : Formes coupées asymétriques (`clip-path`), couleurs néons (Jaune, Cyan, Rouge), scanlines, et grilles de données.
- **Animations fluides 60fps** : Effets de glitch (aberration chromatique), déploiement holographique, et fermeture façon "écran cathodique" (CRT).
- **HUD Dynamique** : Visualiseur vocal animé (EQ), compte à rebours de la durée d'appel, et fausses données système.
- **Sound Design Intégré** : 
  - Sonnerie en boucle pour l'appel entrant.
  - Effets sonores d'interface distincts pour l'acceptation et le refus d'appel.
- **Prêt pour FiveM** : Inclut des écouteurs d'événements pour communiquer facilement avec les scripts Lua (via `postMessage` et les Callbacks NUI).

## 📁 Structure du Projet

Assurez-vous que tous les fichiers soient placés à la racine du dossier pour que les chemins audio et CSS fonctionnent correctement.

```text
HOLO/
├── index.html                                  # Structure de l'interface
├── style.css                                   # Design Cyberpunk et animations
├── script.js                                   # Logique, chronomètre et gestion audio
├── Ringtone.mp3                                # Audio : Sonnerie d'appel entrant
├── outgoing call.MP3                           # Audio : Appel sortant (optionnel)
├── ui_phone_incoming_call_positive.MP3         # Audio : Appel accepté
└── ui_phone_incoming_call_negative.MP3         # Audio : Appel refusé / raccroché

Pour tester : window.postMessage({ action: "incomingCall", name: "Jackie Welles" }, "*");