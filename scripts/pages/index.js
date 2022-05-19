// Import des déclarations de classes et fonctions externes
import { getRecipes } from "../utils/APIfetch.js";
import { Recipe } from "../models/recipe.js";
import { List } from "../models/list.js";

// Décalartion de variables globales
export const itemsSelected = [];

function clearLists() {

	console.log("clearLists");

	const tabUl = ["listIngredients", "listAppliances", "listUstensils"];
	const tabMenu = ["menuIngredients", "menuAppliances","menuUstensils",];
	const tabBtn = ["btnIngredients", "btnAppliances", "btnUstensils"];
	
	tabUl.map( (elt) => {
		document.getElementById(elt).classList.remove("items-display");
	});
	tabMenu.map( (elt) => {
		document.getElementById(elt).setAttribute("class", "input-group input-Format");	
	});
	tabBtn.map( (elt) => {
		document.getElementById(elt).childNodes[1].style.transform = "rotate(0deg)";
	});
}

/**
 * Activation des boutons dropdown
 * 
 * @param {*} list	la liste des ingredients, des appliances ou des ustensiles
 * @param {*} btnClass 
 * @param {*} ulClass 
 * @param {*} displayClass 
 * @param {*} itemClass 
 */
function activateListeners(list, menuId, btnId, ulId, displayClass, itemClass, widthClass) {

	const elementMenu = document.getElementById(menuId);
	const elementBtn = document.getElementById(btnId);
	const elementUl = document.getElementById(ulId);

	elementBtn.addEventListener("click", (e) => {
		e.preventDefault();
		if (elementUl.classList.contains(displayClass)) {
			elementMenu.classList.remove(widthClass);
			elementBtn.childNodes[1].style.transform = "rotate(0deg)";
			elementUl.classList.remove(displayClass);
			return;
		}
		clearLists();
		elementMenu.classList.add(widthClass);
		elementBtn.childNodes[1].style.transform = "rotate(180deg)";
		elementUl.classList.add(displayClass);
		elementUl.innerHTML = list.displayListDOM();
		list.activateListItems();
	});


}
/**
 * Créer les listeners des 3 boutons ingredients, appliances et ustensiles
 *
 * @param {*} les listes associées aux boutons
 */
function displayLists(ingList, appList, ustList) {

	// Ingredients
	activateListeners(ingList, "menuIngredients","btnIngredients", "listIngredients", "items-display", "ingredients-list-item", "ingredients-extendedwidth");

	// Appliances 
	activateListeners(appList, "menuAppliances", "btnAppliances", "listAppliances", "items-display", "appliances-list-item", "appliances-extendedwidth")

	// Ustensiles 
	activateListeners(ustList, "menuUstensils", "btnUstensils", "listUstensils", "items-display", "ustensils-list-item", "ustensils-extendedwidth")

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
		tabIngredients = [...new Set([...tabIngredients, ...recipe.ingredients.map((elt) => elt.ingredient.toLowerCase())])].sort();
		tabAppliances = [...new Set([...tabAppliances, ...[recipe.appliance.toLowerCase().replace(".","")]])].sort();
		tabUstensils = [...new Set([...tabUstensils, ...recipe.ustensils.map((elt) => elt.toLowerCase())])].sort();
	});

	let ingredientsModel = new List(tabIngredients, "menuIngredients", "listIngredients", "btnIngredients", "ingredients-list-item", "ingredients-extendedwidth");
	let appliancesModel = new List(tabAppliances, "menuAppliances", "listAppliances", "btnAppliances", "appliances-list-item", "appliances-extendedwidth");
	let ustensilsModel = new List(tabUstensils, "menuUstensils", "listUstensils", "btnUstensils", "ustensils-list-item", "ustensils-extendedwidth");

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
	const [ingredientsList, appliancesList, ustensilsList] = createResources(recipes);
	displayLists(ingredientsList, appliancesList, ustensilsList);
}

init();
