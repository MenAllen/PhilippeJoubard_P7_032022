// Import des déclarations de classes et fonctions externes
import { getRecipes } from "../utils/APIfetch.js";
import { Recipe } from "../models/recipe.js";
import { List } from "../models/list.js";
import { TagsArray } from "../models/tags.js";

// Listes des ingredients, appareils et ustensiles
export let ingredientsList;
export let appliancesList;
export let ustensilsList;

// Variables de travail
let inputString = ""; 					// input de la recherche générale
let allRecipes = []; 						// les 50 recettes chargées depuis le fichier
let filteredRecipes = []; 			// les recettes filtrées par l'expression d'entrée
let tagFilteredRecipes = []; 		// les recettes filtrées par les tags et l'expression d'entrée
export let selectedTags; 				// le tableau des tags sélectionnés

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
		console.log("click :", e.target);
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
		e.stopImmediatePropagation();
	});
}

/**
 * Mise à jour des listes à partir d'une liste de recettes
 *
 * @param {*} recipes
 */
function updateLists(recipes) {
	console.log("updateLists");

	let tabIngredients = [];
	let tabAppliances = [];
	let tabUstensils = [];

	recipes.forEach((recipe) => {
		tabIngredients = [...new Set([...tabIngredients, ...recipe.ingredients.map((elt) => elt.ingredient)])].sort();
		tabAppliances = [...new Set([...tabAppliances, ...[recipe.appliance.replace(".", "")]])].sort();
		tabUstensils = [...new Set([...tabUstensils, ...recipe.ustensils])].sort();
	});

	ingredientsList.updateList(tabIngredients);
	appliancesList.updateList(tabAppliances);
	ustensilsList.updateList(tabUstensils);
}

/**
 * Créer la liste des ingrédients, des appareils et des ustensiles
 * à partir des recettes fournies. Permet d'ignorer les doublons
 *
 * @param {*} recipes la liste des recettes issues du json
 */
function createResources(recipes) {
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
 * @param {*} recipes la liste des recettes issues du json
 */
async function displayRecipes(recipes) {
	const recipeDisplaySection = document.getElementById("recipes-display-section");
	recipeDisplaySection.innerHTML = "";

	recipes.forEach((recipe) => {
		const recipeModel = new Recipe(recipe);
		recipeDisplaySection.innerHTML += recipeModel.recipeCardDOM;
	});
}

/**
 * Filtrer la liste des recettes avec les tags sélectionnés
 *
 * @param {} listRecipes
 * @returns tagFilteredRecipes updated
 */
function tagFilterRecipes(listRecipes) {
	const len = selectedTags._tableT.length;

	if (len > 0) {
		selectedTags._tableT.forEach((item) => {
			if (item[1] === "$appliances") {
				listRecipes = listRecipes.filter((recipe) => {
					return recipe.appliance.toLowerCase().includes(item[0].toLowerCase());
				});
			}

			if (item[1] === "$ustensils") {
				listRecipes = listRecipes.filter((recipe) => {
					return recipe.ustensils.find((elt) => elt.toLowerCase().includes(item[0].toLowerCase()));
				});
			}

			if (item[1] === "$ingredients") {
				listRecipes = listRecipes.filter((recipe) => {
					return recipe.ingredients.find((elt) => elt.ingredient.toLowerCase() === item[0].toLowerCase());
				});
			}
		});

		tagFilteredRecipes = listRecipes;
		return;
	}
	tagFilteredRecipes = listRecipes;
}

/**
 *  Mettre à jour les recettes affichées
 */
export function updateRecipes() {
	console.log("updateRecipes");
	filteredRecipes = allRecipes;
	tagFilteredRecipes = allRecipes;

	if (inputString.length >= 3) {
		filteredRecipes = allRecipes.filter((recipe) => {
			return (
				recipe.name.toLowerCase().includes(inputString) ||
				recipe.description.toLowerCase().includes(inputString) ||
				recipe.ingredients.some((item) => {
					item.ingredient.toLowerCase().includes(inputString);
				})
			);
		});
	}

	tagFilterRecipes(filteredRecipes);
	displayRecipes(tagFilteredRecipes);
	updateLists(tagFilteredRecipes);

	if (tagFilteredRecipes.length === 0) {
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
	allRecipes = [...recipes];

	/* Afficher les recettes et activer le listener sur l'input */
	displayRecipes(allRecipes);
	activateSearch();

	/* Construire les listes d'ingrédients, d'appareils et d'ustensiles à partir des recettes, et active les écouteurs */
	[ingredientsList, appliancesList, ustensilsList] = createResources(allRecipes);
	activateLists();

	/* Initialiser la table des tags */
	selectedTags = new TagsArray();
}

init();
