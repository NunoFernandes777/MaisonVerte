# Maison Verte

Maison Verte est une application mobile en francais developpee avec React Native, Expo et Expo Router. Elle aide un utilisateur a organiser les plantes de sa maison, suivre leur arrosage, consulter leurs informations importantes et recevoir des conseils simples pour leur entretien.

L'application est pensee comme un assistant personnel pour les plantes: visuelle, moderne, facile a utiliser et adaptee a une demonstration sur telephone avec Expo Go.

## Objectif

Le but du projet est de proposer une app de suivi des plantes domestiques. L'utilisateur peut se connecter, enregistrer ses plantes, consulter une fiche detaillee pour chaque plante, arroser une plante ou toutes les plantes, ajouter une photo avec la camera et consulter la meteo locale pour adapter les soins.

## Fonctionnalites principales

- Authentification reelle avec Supabase Auth.
- Session persistante avec AsyncStorage.
- Base de donnees distante Supabase pour stocker les plantes.
- CRUD complet sur les plantes: lecture, ajout, mise a jour et suppression.
- Securite RLS dans Supabase: chaque utilisateur accede uniquement a ses propres plantes.
- Navigation structuree avec Expo Router: ecran d'accueil, authentification, onglets et page detaillee.
- Page meteo avec geolocalisation du telephone.
- Page "Mes Plantes" avec cartes de plantes, ajout, suppression et arrosage global.
- Page detaillee d'une plante avec statistiques, conseils, plantes compatibles et arrosage individuel.
- Camera native pour prendre une photo et l'utiliser comme image de la plante.
- Gestion des etats loading, error et empty.

## Ecrans de l'application

- **Accueil**: meteo locale, humidite, vent, saison actuelle et conseils saisonniers.
- **Mes Plantes**: liste des plantes, ajout, suppression et bouton d'arrosage general.
- **Detail plante**: informations completes, niveau d'eau, frequence d'arrosage, lumiere, conseils et camera.
- **Explorer**: suggestions et idees de plantes.
- **Profil**: preferences de l'utilisateur.

## Technologies utilisees

- React Native
- Expo / Expo Go
- Expo Router
- Supabase Auth
- Supabase Database
- Row Level Security
- AsyncStorage
- Expo Camera
- Expo Location
- Expo Navigation Bar

Version actuelle du projet: Expo SDK 54, pour garder la compatibilite avec Expo Go.

## Prerequis

- Node.js installe
- npm installe
- Expo Go sur le telephone
- Un projet Supabase

## Installation

Installer les dependances:

```bash
npm install
```

Lancer le projet:

```bash
npm run start -- --lan --clear
```

Ensuite, scanner le QR code avec Expo Go.

## Configuration Supabase

Creer un fichier `.env` a la racine du projet avec les variables suivantes:

```env
EXPO_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre-cle-publique
```

Le fichier `.env.example` montre le format attendu.

Ensuite, dans Supabase, executer le fichier:

```text
supabase-schema.sql
```

Ce fichier cree la table `plants` et active les policies RLS:

- lecture des plantes de l'utilisateur connecte;
- insertion uniquement pour son propre compte;
- mise a jour uniquement de ses propres plantes;
- suppression uniquement de ses propres plantes.

## Demonstration attendue

Pendant la demonstration, il est possible de montrer:

1. La connexion ou la creation d'un compte.
2. La page d'accueil avec la meteo locale.
3. La liste des plantes.
4. L'ajout d'une nouvelle plante.
5. L'arrosage global avec le bouton d'eau.
6. L'ouverture d'une fiche plante.
7. L'arrosage individuel.
8. La prise de photo avec la camera.
9. La suppression d'une plante.

## Requis du projet

- Navigation structuree: Expo Router avec plusieurs ecrans, onglets et page detaillee.
- Authentification reelle: Supabase Auth avec session persistante.
- Base de donnees distante: Supabase avec CRUD et RLS.
- Fonctionnalites natives: camera et geolocalisation.
- Gestion d'etat: loading, error et empty.

## Note

Si Supabase n'est pas configure, l'application peut encore afficher une demo locale avec des plantes par defaut. Pour valider l'authentification et la base de donnees distante pendant l'evaluation, il faut utiliser le fichier `.env` et executer le SQL dans Supabase.
