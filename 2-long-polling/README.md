# Exercice 2 - Long - Polling 
Le Long Polling est une **méthode de pseudo temps réel** se basant sur les intervals 

 Objectif : mettre en avant les limites via l'inspecteur du navigateur (onglet network)


## Ennoncé 

- Créer un serveur qui envoi une liste d’utilisateurs
- La liste d’utilisateurs doit être mise à jour toutes les 5 secondes
- Créer un client qui récupère la liste des utilisateurs et l’affiche
- La liste doit être rafraîchie
- Prendre en compte les ralentissement réseau
- Si l’utilisateur existe déjà ne pas le re-afficher
- Un utilisateur à un « id » , un « name », un « username » et un « email »


## Installer et lancer la correction 

Installation
```
npm install
```


Lancer le serveur "back"
```
npm run server:back
```

lancer le serveur "front"
```
npm run server:front
```

