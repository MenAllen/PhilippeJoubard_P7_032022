// Import des déclarations de classes et fonctions externes
import { getRecipes } from "../utils/APIfetch.js";
import { Recipe } from "../models/recipe.js";

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
	const { recipes } = await getRecipes();
	displayRecipes(recipes);
}

init();
