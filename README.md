# Stratix — application mobile-first

## Démarrage local

Prérequis : Node.js 20+ et une clé API OpenAI.

1. Décompressez le dossier.
2. Dans ce dossier, copiez `.env.example` vers `.env`.
3. Ajoutez votre clé dans `OPENAI_API_KEY=...`.
4. Dans un terminal, exécutez :

```bash
npm install
npm start
```

5. Ouvrez http://localhost:3000 sur votre ordinateur ou téléphone (le téléphone doit être sur le même réseau Wi-Fi et utiliser l'adresse IP locale de l'ordinateur).

La clé API reste côté serveur : ne la placez jamais dans le HTML ou dans une application distribuée.

## Déploiement

Déployez ce projet sur un hébergeur Node.js (par exemple Render, Railway ou un VPS), configurez `OPENAI_API_KEY` comme variable d'environnement et lancez `npm start`. HTTPS est recommandé.

## Fonctionnement

- Le formulaire envoie les informations à `/api/analyze`.
- Le serveur appelle l'API OpenAI via le SDK officiel.
- L'interface valide la structure JSON et affiche une erreur si l'analyse échoue.
- La carte peut être partagée en PNG vertical 9:16 ou téléchargée.
- Le délai d'attente côté navigateur est limité à 9 secondes ; la latence réelle dépend du réseau et du modèle.

L'API OpenAI est facturée selon votre compte et votre utilisation. Aucun avis utilisateur ni résultat de match n'est prérempli.
