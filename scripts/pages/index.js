// Import des déclarations de classes et fonctions externes
import { getRecipes } from "../utils/APIfetch.js";
import { Recipe } from "../models/recipe.js";
import { List } from "../models/list.js";
import { TagsArray } from "../models/tags.js";

// Listes des ingredients, appareils et ustensiles
let ingredientsList;
let appliancesList;
let ustensilsList;

export let selectedTags;

/**
 * Fermeture des menus dropdown, appelée avant l'ouverture
 */
export function closeAllLists() {
	ingredientsList.closeList();
	appliancesList.closeList();
	ustensilsList.closeList();
}


/**
 * Créer les listeners des 3 boutons ingredients, appliances et ustensiles
 * pour afficher les listes au click
 *
 * @param {*} les listes associées aux boutons
 */
function displayLists(ingList, appList, ustList) {

	// Ingredients
	ingList.activateList();

	// Appliances
	appList.activateList(); 

	// Ustensiles
	ustList.activateList(); 

}

/**
 * Créé la liste des ingrédients, des appareils et des ustensiles
 * à partir des recettes fournies. Permet d'ignorer les doublons
 *
 * @param {*} recipes la liste des recettes issues du json
 */
function createResources(recipes) {
	let tabIngredients = [];
	let tabAppliances = [];
	let tabUstensils = [];

	recipes.forEach((recipe) => {
//		tabIngredients = [...new Set([...tabIngredients, ...recipe.ingredients.map((elt) => elt.ingredient.toLowerCase())])].sort();
		tabIngredients = [...new Set([...tabIngredients, ...recipe.ingredients.map((elt) => elt.ingredient)])].sort();
		tabAppliances = [...new Set([...tabAppliances, ...[recipe.appliance.replace(".","")]])].sort();
		tabUstensils = [...new Set([...tabUstensils, ...recipe.ustensils])].sort();
	});

	let ingredientsModel = new List(tabIngredients, "$ingredients", "menuIngredients", "listIngredients", "btnIngredients", "ingredients-list-item", "ingredients-extendedwidth");
	let appliancesModel = new List(tabAppliances, "$appliances", "menuAppliances", "listAppliances", "btnAppliances", "appliances-list-item", "appliances-extendedwidth");
	let ustensilsModel = new List(tabUstensils, "$ustensils", "menuUstensils", "listUstensils", "btnUstensils", "ustensils-list-item", "ustensils-extendedwidth");

	return [ingredientsModel, appliancesModel, ustensilsModel];
}

/**
 * Affiche toutes les recettes sur la page d'accueil
 *
 * @param {*} recipes la liste des recettes issues du json
 */
async function displayRecipes(recipes) {
	let recipeDisplaySection = document.getElementById("recipes-display-section");
	recipeDisplaySection.innerHTML = "";

	recipes.forEach((recipe) => {
		const recipeModel = new Recipe(recipe);
		recipeDisplaySection.innerHTML += recipeModel.recipeCardDOM;
	});
}

/**
 * Initialisation de la page d'accueil
 */
async function init() {

	/* Extraire les recettes du JSON et les afficher */
	const { recipes } = await getRecipes();
	displayRecipes(recipes);

	/* Extraire les listes d'ingrédients, d'appareils et d'ustensiles des recettes, et active les écouteurs */
	[ingredientsList, appliancesList, ustensilsList] = createResources(recipes);
	displayLists(ingredientsList, appliancesList, ustensilsList);

	/* Initialiser la table des tags */
	selectedTags = new TagsArray();

}

init();
