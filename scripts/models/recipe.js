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
 * @Property (boolean) active - Recette visualisée ou non
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
		this._active = true;
	}

	/**
	 * Construit la liste des ingrédients de la recette pour utilisation dans RecipeCardDom:
	 * (Ingredient): (Quantité) (Unité). Au passage 'grammes' devient 'g'
	 *
	 * @readonly
	 * @memberof Recipe
	 */
	get ingredients() {
		let listeIngredients = ``;

		listeIngredients = this._ingredients
			.map((element) => {
				return `			
			<strong>${element.ingredient}</strong>
			${ "quantity" in element ? `: ${element.quantity}` : ""}
			${ "unit" in element ? (element.unit === "grammes" ? "g" : element.unit) : "" }<br>`;
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
			 	<article class="card col-lg-4 col-md-6 col-sm-12 g-4 border-0">
			 		<img class="card-img-top" src="assets/icons/img.svg" alt="Card image cap" />
			 		<div class="card-body px-2 bg-grey-light card-Format">
				 		<div class="d-flex justify-content-between">
					 		<p class="card-Recipe-name font-Lato18">${this._name}</p>
					 		<div>
						 		<img src="assets/icons/clock.svg" alt="Temps de preparation">
						 		<small class="font-Lato18 Bold">${this._time} mins</small>
					 		</div>
				 		</div>
				 		<div class="d-flex mt-2 justify-content-between align-items-center">
					 		<p class="card-Recipe-ingredients font-Lato12">${this.ingredients}</p>
					 		<p class="card-Recipe-description font-Roboto12">${this._description}</p>
				 		</div>
			 		</div>
		 		</article>`;
	}
}
