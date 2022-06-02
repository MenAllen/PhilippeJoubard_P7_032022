// Import des déclarations de classes et fonctions externes
import { getRecipes } from "../utils/APIfetch.js";
import { Recipe } from "../models/recipe.js";
import { List } from "../models/list.js";
import { TagsArray } from "../models/tags.js";
import { filterTab } from "../utils/string.js"

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

	for (let i in recipes) {

		for (let j in recipes[i].ingredients) {
			if (!tabIngredients.includes(recipes[i].ingredients[j].ingredient)) {
				tabIngredients.push(recipes[i].ingredients[j].ingredient);
			}
		}

		if (!tabAppliances.includes(recipes[i].appliance)) {
			tabAppliances.push(recipes[i].appliance.replace(".", ""));
		}

		for (let k in recipes[i].ustensils) {
			if (!tabIngredients.includes(recipes[i].ustensils[k])) {
				tabUstensils.push(recipes[i].ustensils[k]);
			}
		}
	}

	ingredientsList.updateList(tabIngredients.sort());
	appliancesList.updateList(tabAppliances.sort());
	ustensilsList.updateList(tabUstensils.sort());
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

	for (let i in recipes) {

		for (let j in recipes[i].ingredients) {
			if (!tabIngredients.includes(recipes[i].ingredients[j].ingredient)) {
				tabIngredients.push(recipes[i].ingredients[j].ingredient);
			}
		}

		if (!tabAppliances.includes(recipes[i].appliance)) {
			tabAppliances.push(recipes[i].appliance.replace(".", ""));
		}

		for (let k in recipes[i].ustensils) {
			if (!tabIngredients.includes(recipes[i].ustensils[k])) {
				tabUstensils.push(recipes[i].ustensils[k]);
			}
		}
	}

	const ingredientsModel = new List(tabIngredients.sort(), "$ingredients", "menuIngredients", "listIngredients", "btnIngredients", "ingredients-list-item", "ingredients-extendedwidth");
	const appliancesModel = new List(tabAppliances.sort(), "$appliances", "menuAppliances", "listAppliances", "btnAppliances", "appliances-list-item", "appliances-extendedwidth");
	const ustensilsModel = new List(tabUstensils.sort(), "$ustensils", "menuUstensils", "listUstensils", "btnUstensils", "ustensils-list-item", "ustensils-extendedwidth");

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
 * Un élément Tag étant constitué de deux éléments: le nom du Tag et le type de Tag 
 *
 * @param {} listRecipes
 * @returns tagFilteredRecipes updated
 */
function tagFilterRecipes(listRecipes) {
	let resultIndex = [];
	const len = selectedTags._tableT.length;

	for (let i in listRecipes) { resultIndex[i]= false};

	if (len > 0) {
		for (let i in selectedTags._tableT) {
			if (selectedTags._tableT[i][1] === "$appliances") {
				for (let j in listRecipes) {
					if (listRecipes[j].appliance.toLowerCase().includes(selectedTags._tableT[i][0].toLowerCase())) {
						resultIndex[j] = true;
					}
				}
				listRecipes = filterTab(listRecipes, resultIndex);
				resultIndex = [];
			}

			if (selectedTags._tableT[i][1] === "$ustensils") {
				for (let j in listRecipes) {
					for (let k in listRecipes[j].ustensils) {
						if (listRecipes[j].ustensils[k].toLowerCase().includes(selectedTags._tableT[i][0].toLowerCase())) {
							resultIndex[j] = true;
							break;
						}
					}
				}
				listRecipes = filterTab(listRecipes, resultIndex);
				resultIndex = [];
			}

			if (selectedTags._tableT[i][1] === "$ingredients") {
				for (let j in listRecipes) {
					for (let k in listRecipes[j].ingredients) {
							if ( listRecipes[j].ingredients[k].ingredient.toLowerCase() === selectedTags._tableT[i][0].toLowerCase() ) {
								resultIndex[j] = true;
								break;
							}
					}
				}
				listRecipes = filterTab(listRecipes, resultIndex);
				resultIndex = [];
			}
		}
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
	let filterIndex = 0;
	filteredRecipes = allRecipes;
	tagFilteredRecipes = allRecipes;

	// Si au moins 3 caractères recherche générale dans le nom, la description et les ingrédients de chaque recette
	if (inputString.length >= 3) {

		filteredRecipes = [];
		for (let i in allRecipes) {
			if (allRecipes[i].name.toLowerCase().includes(inputString.toLowerCase()) ||
				allRecipes[i].description.toLowerCase().includes(inputString.toLowerCase()) ||
					(() => { for (let j in allRecipes[i].ingredients) {
							if ( allRecipes[i].ingredients[j].ingredient.toLowerCase().includes(inputString.toLowerCase()) ) {
								return true;
							}
						}
						return false;
					})())	{
						filteredRecipes[filterIndex++] = allRecipes[i];
					}
		}
	}

	// Filtrage des recettes suivant les tags sélectionnés
	tagFilterRecipes(filteredRecipes);

	// Affichage des recettes sélectionnées
	displayRecipes(tagFilteredRecipes);

	// Mise à jour des listes d'ingredients, appliances et ustensiles
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
