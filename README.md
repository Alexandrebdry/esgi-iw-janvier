# 🌐 Cours Web Temps Réel - ESGI

Ce repository contient les **corrections des exercices** du cours de Web en Temps Réel dispensé à l'ESGI.

## 📚 Sommaire

- [Présentation](#-présentation)
- [Prérequis](#-prérequis)
- [Structure du projet](#-structure-du-projet)
- [Exercices](#-exercices)
- [Installation et lancement](#-installation-et-lancement)

## 🎯 Présentation

Ce cours explore les différentes techniques de communication en temps réel sur le web :

| Technique | Type | Description |
|-----------|------|-------------|
| **Polling** | Pseudo temps réel | Requêtes HTTP à intervalles réguliers |
| **Long Polling** | Pseudo temps réel | Requêtes HTTP maintenues ouvertes côté serveur |
| **Server-Sent Events (SSE)** | Temps réel | Communication unidirectionnelle serveur → client |
| **WebSocket** | Temps réel | Communication bidirectionnelle full-duplex |

## 🛠 Prérequis

- [Node.js](https://nodejs.org/) (version 18+)
- npm ou yarn
- Un navigateur moderne (Chrome, Firefox, Edge...)

## 📁 Structure du projet

```
IW-J/
├── 1-polling/           # Exercice 1 - Polling
├── 2-long-polling/      # Exercice 2 - Long Polling
├── 3-server-sent-event/ # Exercice 3 - Server-Sent Events
├── websocket/           # Exercices WebSocket
└── README.md
```

## 📝 Exercices

### Exercice 1 - Polling

Le Polling est une méthode de **pseudo temps réel** se basant sur les intervalles.

**Objectifs :**
- Créer un serveur qui envoie une liste d'utilisateurs (mise à jour toutes les 5 secondes)
- Créer un client qui récupère et affiche la liste (rafraîchissement chaque seconde)
- Ne pas ré-afficher les utilisateurs existants
- Mettre en avant les limites via l'inspecteur du navigateur (onglet Network)

📂 [Voir la correction](./1-polling/)

---

### Exercice 2 - Long Polling

Le Long Polling est une amélioration du polling classique où le serveur maintient la connexion ouverte.

**Objectifs :**
- Créer un serveur qui envoie une liste d'utilisateurs
- Créer un client qui récupère et affiche la liste
- Prendre en compte les ralentissements réseau
- Ne pas ré-afficher les utilisateurs existants

📂 [Voir la correction](./2-long-polling/)

---

### Exercice 3 - Server-Sent Events (SSE)

Le SSE est une méthode de **temps réel** qui se base sur des events. Il permet une communication unidirectionnelle serveur → client.

**Objectifs :**
- Créer un serveur qui envoie une liste d'utilisateurs
- La liste se rafraîchit uniquement lors des mises à jour serveur
- Utiliser une seule connexion au serveur

📂 [Voir la correction](./3-server-sent-event/)

---

### Exercices WebSocket

Les WebSockets permettent une communication **bidirectionnelle** en temps réel entre le client et le serveur.

📂 [Voir les exercices](./websocket/)

## 🚀 Installation et lancement

Chaque exercice est indépendant. Pour lancer un exercice :

```bash
# Se placer dans le dossier de l'exercice
cd 1-polling  # ou 2-long-polling, 3-server-sent-event, websocket

# Installer les dépendances
npm install

# Lancer le serveur back-end
npm run server:back

# Dans un autre terminal, lancer le serveur front-end
npm run server:front
```

## 🔧 Technologies utilisées

- **TypeScript** - Langage principal
- **Express.js** - Framework serveur
- **Vite** - Serveur de développement front-end
- **Nodemon** - Hot reload pour le back-end

## 📖 Ressources complémentaires

- [MDN - Server-Sent Events](https://developer.mozilla.org/fr/docs/Web/API/Server-sent_events)
- [MDN - WebSocket](https://developer.mozilla.org/fr/docs/Web/API/WebSocket)
- [MDN - Fetch API](https://developer.mozilla.org/fr/docs/Web/API/Fetch_API)

---

**ESGI** - École Supérieure de Génie Informatique

**Réalisé par** : Alexandre BAUDRY

