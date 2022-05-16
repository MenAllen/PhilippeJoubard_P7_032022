/**
 * Classe Recipe
 *
 * @Property (string) name - nom de la recette
 * @property (number) id - id de la recette
 * @Property (number) time - Temps de réalisation de la recette
 * @Property (array) ingredients - Table de ingredients de la recette
 * @Property (string) description - Description de la recette
 * @Property (string) appliance - Appareil pour réaliser la recette
 * @Property (array) ustensils - Table des ustensiles pour réaliser la recette
 * */

export class Recipe {
	constructor(data) {
		this._name = data.name;
		this._id = data.id;
		this._time = data.time;
		this._ingredients = data.ingredients;
		this._description = data.description;
		this._appliance = data.appliance;
		this._ustensils = data.ustensils;
	}

	/**
	 * Construit la liste des ingrédients de la recette pour utilisation dans RecipeCardDom:
	 * (Ingredient): (Quantité) (Unité)
	 *
	 * @readonly
	 * @memberof Recipe
	 */
	get ingredients() {
		let listeIngredients = ``;

		listeIngredients = this._ingredients
			.map((element) => {
				return `			
			<strong>${element.ingredient}:</strong><br>`;
			})
			.join("");

		return listeIngredients;
	}

	/**
	 * Affiche une "carte de presentation" d'une recette dans la page d'accueil
	 *
	 * @readonly
	 * @memberof Recipe
	 */
	get recipeCardDOM() {
		return `
			 	<div class="card mb-4 px-0 card-Width">
			 		<img class="card-img-top" src="assets/icons/img.svg" alt="Card image cap" />
			 		<div class="card-body bg-grey-light card-Height">
				 		<div class="d-flex justify-content-between">
					 		<p class="font-Lato18">${this._name}</p>
					 		<div>
						 		<img src="assets/icons/clock.svg" alt="Temps de preparation">
						 		<small class="font-Lato18 Bold">${this._time} mins</small>
					 		</div>
				 		</div>
				 		<div class="d-flex justify-content-between align-items-center">
					 		<p class="card-Recipe-ingredients font-Lato12">${this.ingredients}</p>
					 		<p class="card-Recipe-description font-Roboto12">${this._description}</p>
				 		</div>
			 		</div>
		 		</div>`;
	}
}
