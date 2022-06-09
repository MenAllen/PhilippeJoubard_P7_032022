# Base de code du projet P7 - Parcours Front-end (branche algo2)
Développer un algorithme de recherche pour un site de recettes de cuisine en JavaScript.
L'objectif est de permettre une recherche à partir d'une expression texte et / ou à partir de pré-selection de tags correspondant au ingrédients, aux appareils et aux ustensiles utilisés pour la recette.

Il sera réalisé deux versions de cet algorithme, l'une basée sur une recherche fonctionnelle (.filter, .map, .forEach, .find, .some), l'autre basée sur des boucles de recherche (for.., while, ...).
Des tests sont effectués pour sélectionner, dans le cas de la recherche nominale (pas de tags sélectionnés), la version la plus performante

## Page github
La page github: https://menallen.github.io/PhilippeJoubard_P7_032022 permet d'afficher la branche main ou la branche algo2 selon le choix

## Installation
cloner le repo github, en choisissant la version main (recherche fonctionnelle) ou algo2 (recherche for), puis
 - npm install,
 - npm run lint pour linter
 - Lancer le serveur local (Go live sous VS code)

## Inputs
Maquettes FIGMA
Tableau JSON de 50 recettes avec pour chacune ingrédients, équipements, ustensiles et description
Fiche de description du cas d'utilisation de la recherche
Exemple de fiche d'investigation de fonctionnalité

## Code
 - Constructor pattern avec 3 classes: recipe(recette), list(liste ingredients, appliances et ustensils) et tags, et leurs méthodes
 - Fonction d'initialisation au démarrage (function init) de la page pour initialisation des objets recettes, listes et tags, mise en place des écouteurs
 - Fonction de gestion des recherches (function updateRecipes) appelée pour la mise à jour des recettes affichées et des listes suite à un input ou un ajout / retrait de tag

## Outputs
 - Fiche d'investigation de fonctionnalité -> Algorigramme
 - Application incluant deux options de réalisation -> 2 branches main et algo2
 - Comparaison des deux solutions avec l'outil JSben.ch

## Outils utilisés
 - Bootstrap 5 HTML & CSS librairie
 - ESlint Linter
 - Prettier Code formateur
 - P42 code analyseur et amelioreur
 - JSBen.ch, JSBench.me : test de performance javascript

## Livraisons
 - Livraison initiale : template page d'accueil avec lecture json et visualisation des recettes
 - Livraison 2 : affichage des listes ingredients, appareils et ustensiles
 - Livraison 3 : Ajout et suppression des Tags
 - Livraison 4 : Ajout Fiche investigation de fonctionnalité
 - Livraison 5 : Algo 1 de recherche
 - Livraison 6 : Ajout input ingredients, appliances, ustensils
 - Livraison 7 : Corrections scroll, format input ing, appli & ustensils
 - Livraison 8 : Ajout commentaires, thin scrollbar et fix fiche investigation
 - Livraison 9 : Ajout Algo2 avec boucles for
 - Livraison 10: Ajout linter & gitignore
 - Livraison 11: Modification filterTab