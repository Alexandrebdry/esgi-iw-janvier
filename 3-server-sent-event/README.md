# Exercice 3 - ServerSentEvents
Le SSE est une **méthode de temps réel** qui se base sur des events. 
Il permet de faire du temps réel unidirectionnel server -> client 

 Objectif : mettre en avant  via l'inspecteur du navigateur (onglet network)


## Ennoncé 

- Créer un serveur qui envoi une liste d’utilisateurs
- La liste d’utilisateurs doit être mise à jour toutes les 5 secondes
- Créer un client qui récupère la liste d’utilisateur et l’affiche
- La liste doit être rafraîchie uniquement lorsque le serveur envoi des mises à
jour
- Utiliser une et une seule connexion au serveur
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

