// Import des déclarations de classes et fonctions externes
import { getRecipes } from "../utils/APIfetch.js";
import { Recipe } from "../models/recipe.js";
import { List } from "../models/list.js";
import { TagsArray } from "../models/tags.js";
import { itemPresent } from "../utils/string.js";

// Tableaux de travail
const recipeObjects = []; // Tableau des objets recettes
let filteredRecipes = []; // Tableau des objets recettes filtrées par l'expression d'entrée et/ou les tags
let inputString = ""; // Input de la recherche générale
export let selectedTags; // Tableau des tags sélectionnés

// Listes des ingredients, appareils et ustensiles
export let ingredientsList;
export let appliancesList;
export let ustensilsList;

/**
 * Fermer les 3 menus dropdown
 */
export function closeAllLists() {
	ingredientsList.closeList();
	appliancesList.closeList();
	ustensilsList.closeList();
}

/**
 * Créer les listeners dédiés au click pour la page d'accueil:
 * 	- les 3 boutons ingredients, appliances et ustensiles
 * 	- l'icône de recherche de la barre principale
 *  - tout click sur la page
 *
 * @param {*} Aucun
 */
function activateLists() {
	document.body.addEventListener("click", (e) => {
		e.preventDefault();
		if (e.target.classList.contains("chevronIngredients")) {
			ingredientsList.activateList();
		} else if (e.target.classList.contains("chevronAppliances")) {
			appliancesList.activateList();
		} else if (e.target.classList.contains("chevronUstensils")) {
			ustensilsList.activateList();
		} else {
			if (e.target.classList.contains("fa-search")) {
				updateRecipes();
			}
			closeAllLists();
		}
	});
}

/**
 * Fonction de Mise à jour des 3 listes ingredients, appliances et ustensils
 * à partir de la table filteredRecipes des objets recette
 *
 */
function updateLists() {
	let tabIngredients = [];
	let tabAppliances = [];
	let tabUstensils = [];

	for (let i in filteredRecipes) {
		// Appliances
		if (!itemPresent(tabAppliances, filteredRecipes[i].getAppliance())) {
			tabAppliances.push(filteredRecipes[i].getAppliance());
		}

		// Ingredients
		for (let j in filteredRecipes[i]._ingredients) {
			if (!itemPresent(tabIngredients, filteredRecipes[i].getIngredient(j))) {
				tabIngredients.push(filteredRecipes[i].getIngredient(j));
			}
		}

		// Ustensils
		for (let k in filteredRecipes[i]._ustensils) {
			if (!itemPresent(tabUstensils, filteredRecipes[i].getUstensil(k))) {
				tabUstensils.push(filteredRecipes[i].getUstensil(k));
			}
		}
	}

	tabIngredients = tabIngredients.sort();
	tabAppliances = tabAppliances.sort();
	tabUstensils = tabUstensils.sort();

	ingredientsList.updateList(tabIngredients);
	appliancesList.updateList(tabAppliances);
	ustensilsList.updateList(tabUstensils);
}

/**
 * Créer les listes des ingrédients, des appareils et des ustensiles
 * à partir de la table de toutes les recettes.
 * Set permet d'ignorer les doublons
 *
 * @param {*} recipes la liste des recettes issues du json
 */
function createLists(recipes) {
	let tabIngredients = [];
	let tabAppliances = [];
	let tabUstensils = [];

	recipes.forEach((recipe) => {
		tabIngredients = [...new Set([...tabIngredients, ...recipe.ingredients.map((elt) => elt.ingredient)])].sort();
		tabAppliances = [...new Set([...tabAppliances, ...[recipe.appliance.replace(".", "")]])].sort();
		tabUstensils = [...new Set([...tabUstensils, ...recipe.ustensils])].sort();
	});

	const ingredientsModel = new List(tabIngredients, "$ingredients", "menuIngredients", "listIngredients", "btnIngredients", "ingredients-list-item", "ingredients-extendedwidth");
	const appliancesModel = new List(tabAppliances, "$appliances", "menuAppliances", "listAppliances", "btnAppliances", "appliances-list-item", "appliances-extendedwidth");
	const ustensilsModel = new List(tabUstensils, "$ustensils", "menuUstensils", "listUstensils", "btnUstensils", "ustensils-list-item", "ustensils-extendedwidth");

	return [ingredientsModel, appliancesModel, ustensilsModel];
}

/**
 * Afficher toutes les recettes sur la page d'accueil
 *
 * @param {*} recipes la liste des recettes à afficher
 */
async function displayRecipes(recipes) {
	const recipeDisplaySection = document.getElementById("recipes-display-section");
	recipeDisplaySection.innerHTML = "";

	recipes.forEach((recipe) => {
		recipeDisplaySection.innerHTML += recipe.recipeCardDOM;
	});
}

/**
 * Créer la table des objets recette recipeObjects
 *
 * @param {} recipes
 */
async function createRecipes(recipes) {
	recipes.forEach((recipe) => {
		recipeObjects.push(new Recipe(recipe));
	});
}

/**
 * Filtrer la liste des recettes sélectionnées à partir de la table des tags sélectionnés
 * La variable filteredRecipes est mise à jour
 *
 */
function tagFilter() {
	const len = selectedTags._tableT.length;

	if (len > 0) {
		selectedTags._tableT.forEach((item) => {
			if (item[1] === "$appliances") {
				filteredRecipes = filteredRecipes.filter((recipe) => recipe.applianceSearch(item[0]));
			}

			if (item[1] === "$ustensils") {
				filteredRecipes = filteredRecipes.filter((recipe) => {
					return recipe.ustensilsSearch(item[0]);
				});
			}

			if (item[1] === "$ingredients") {
				filteredRecipes = filteredRecipes.filter((recipe) => {
					return recipe.ingredientsSearch(item[0]);
				});
			}
		});
	}
}

/**
 * 	Fonction principale de mise à jour de la page
 *  	Mettre à jour les recettes sélectionnées suite à changement de valeur de l'input
 *  	Mettre à jour les recettes sélectionnées suite à ajout ou suppression de tag
 * 		Mettre à jour les recettes affichées
 * 		Mettre à jour la listes associées aux boutons ingrédients, appliances et ustensils
 * 		Si rien à afficher, message
 */
export function updateRecipes() {
	let filterIndex = 0;
	filteredRecipes = recipeObjects;

	if (inputString.length >= 3) {
		filteredRecipes = [];
		for (let i in recipeObjects) {
			if (recipeObjects[i].mainSearch(inputString)) {
				filteredRecipes[filterIndex++] = recipeObjects[i];
			}
		}
	}

	tagFilter();
	displayRecipes(filteredRecipes);
	updateLists();

	if (filteredRecipes.length === 0) {
		document.getElementById("recipes-display-section").innerHTML = `<p id="noRecipes">
				Aucune recette ne correspond à votre critère ...vous pouvez, par exemple, rechercher 'tarte aux pommes', 'poisson', etc. 
			 </p>`;
	}
}

/**
 * Déclaration du listener sur l'input de la recherche principale qui appellera updateRecipes
 *
 */
async function activateSearch() {
	/* Initialisation du champ Input */
	const elementMenu = document.getElementById("menuPrincipal");
	elementMenu.value = "";

	elementMenu.addEventListener("keyup", (e) => {
		e.preventDefault();
		inputString = e.target.value.toLowerCase();
		updateRecipes();
	});
}

/**
 * Initialisation de la page d'accueil
 */
async function init() {
	/* Extraire les recettes du JSON et initialiser le tableau des 50 recettes */
	const { recipes } = await getRecipes();
	const allRecipes = [...recipes];

	/* Construire la table des objets recette, afficher toutes les recettes et activer les écouteurs */
	createRecipes(allRecipes);
	displayRecipes(recipeObjects);
	activateSearch();

	/* Construire les listes d'ingrédients, d'appareils et d'ustensiles à partir des recettes, et active les écouteurs */
	[ingredientsList, appliancesList, ustensilsList] = createLists(allRecipes);
	activateLists();

	/* Initialiser la table des tags */
	selectedTags = new TagsArray();
}

init();
