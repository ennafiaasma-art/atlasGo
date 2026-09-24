AtlasGo - Application web de promotion touristique de la région Béni Mellal-Khénifra

AtlasGo est une application web full-stack conçue pour promouvoir le tourisme dans la région de Béni Mellal-Khénifra. Elle centralise les destinations touristiques, les hébergements locaux, la gestion des favoris et un système complet de réservation au sein d'une plateforme moderne et intuitive.

🚀 Fonctionnalités Principales

Découverte des destinations : Explorez les richesses naturelles (cascades, lacs, montagnes, forêts) et culturelles de la région grâce à des filtres et une recherche avancée.

Localisation et détails : Accédez à des informations détaillées, des photos et des repères géographiques pour chaque site.

Hébergements et chambres : Recherchez des auberges et hôtels à proximité des destinations et consultez la disponibilité des chambres.

Gestion des favoris : Permet aux utilisateurs connectés de sauvegarder et de gérer leurs destinations coups de cœur pour plus tard.

Système de réservation : Réservez facilement une chambre, consultez l'historique des réservations ou effectuez une annulation.

Tableau de bord administrateur : Un espace dédié pour gérer les destinations, catégories, auberges, chambres, utilisateurs, réservations et consulter les statistiques.

🛠️ Stack Technique

Backend

PHP (v8.2+)

Framework Laravel (Architecture MVC & API RESTful)

MySQL (Base de données relationnelle)

Frontend

React.js

JavaScript (ES6+)

HTML5 / CSS3

Tailwind CSS

Outils & Méthodologie

Git / GitHub (Gestion de version)

Postman (Test des API)

Draw.io / StarUML (Modélisation UML & ERD)

📂 Structure du Projet

AtlasGo/
├── backend/                # Application API Laravel
│   ├── app/Http/Controllers # Contrôleurs API
│   ├── database/migrations # Migrations de la base de données
│   └── routes/api.php      # Routes de l'API
├── frontend/               # Application client React
│   ├── src/components/     # Composants & Vues UI
│   └── src/services/       # Connexion avec l'API
└── README.md


⚙️ Installation et Configuration (Développement Local)

Prérequis

PHP >= 8.2 & Composer

Node.js & npm

MySQL

1. Cloner le dépôt

git clone https://github.com/AsmaEnnafia/AtlasGo.git
cd AtlasGo


2. Configuration du Backend (Laravel)

cd backend
composer install
cp .env.example .env
php artisan key:generate


Configurez vos accès à la base de données MySQL dans le fichier .env, puis exécutez :

php artisan migrate --seed
php artisan serve


3. Configuration du Frontend (React)

cd ../frontend
npm install
npm run dev


👥 Auteur

Asma Ennafia - Développeuse Full-Stack & Projet de Fin d’Études (PFE)

📄 Licence

Ce projet est développé dans le cadre d'un Projet de Fin d’Études (PFE).