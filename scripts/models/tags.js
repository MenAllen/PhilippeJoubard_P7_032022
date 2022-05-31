// Déclaration
import { ingredientsList, appliancesList, ustensilsList, updateRecipes } from "../pages/index.js";

/**
 * Classe TagsArray
 *
 * @Property (array) _tableT - tableau des éléments tags sélectionnés
 *
 * */

export class TagsArray {
	constructor() {
		this._tableT = [];
	}

  // Retourne la longueur de la table
  readLength() {
    return this._tableT.length;
  }

  // Retourne le type de tag associé à l'élément soumis
  readType(elt) {
    return elt[1];
  }

  // Retourne la couleur de fond du tag en fonction du type de tag
  getTagcolor(type) {
    let color = "bg-primary";
    switch (type) {
      case "$ustensils":
        color = "bg-red";
        break;
      case "$appliances" :
        color = "bg-green";
      default:;
    }
    return color;
  }

  // Vérifie l'existence du Tag à partir du nom dans la table
  existsTag(tagname) {
    let exists = false;
    this._tableT.forEach( (tag) => { 
      exists ||= tagname === tag[0]});
    return exists;
  }

  // Supprime un Tag
	removeTag(event) {

		// Récupérer l'élément <li> et les noms et types dans le dataset
		const liElement = event.target.parentNode;
    const name = liElement.getAttribute("data-name");
		const type = liElement.getAttribute("data-type");

		// Chercher l'index
		let index = -1;
    for (let i = 0; i < this._tableT.length; i++) {
			if (this._tableT[i][0] === name) {
				index = i;
			}
		}

		if (index != -1) {
			liElement.remove();
			this._tableT.splice(index, 1);

      switch (type) {
        case "$ingredients":
          ingredientsList.addListItem(name);
          break;
        case "$ustensils":
          ustensilsList.addListItem(name);
          break;
        case "$appliances" :
          appliancesList.addListItem(name);
          break;
        default:
          console.log("Tags: erreur type");
      }
      updateRecipes();
		}
	}

  // Ajouter un Tag
	addTag(name, type) {

    if (!this.existsTag(name)) {
			// insérer un nouvel élément
			this._tableT.push([name, type]);

      let color = this.getTagcolor(type);

			// Construire le nouvel élément <li> enfant de <ul>
			const ulNode = document.getElementById("listTags");
			ulNode.innerHTML += `
        <li class="d-flex flex-row mt-2 justify-content-between align-items-center ${color} blockTags-item"
            data-name="${name}" data-type="${type}">${name}
          <img id="closetag" src="assets/icons/close.svg" alt="Supprimer le tag" class="mx-1">	
        </li>
      `;

      const tabclose = document.querySelectorAll("#closetag");
			// Configurer le listener sur tous les éléments <li>
			tabclose.forEach((li) => {
        li.addEventListener("click", (e) => {
				  e.preventDefault();
				  this.removeTag(e);
          e.stopPropagation();
			  });
      })

      // Activer la mise à jour des recettes avec ce nouveau tag
      updateRecipes();
		}
	}
}
