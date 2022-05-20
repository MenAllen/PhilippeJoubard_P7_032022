// Déclaration
import { selectedTags } from "../pages/index.js";
import { closeAllLists } from "../pages/index.js";
import { List } from "./list.js";

/**
 * Classe TagsArray
 *
 * @Property (array) _selectedTags - tableau des éléments tags sélectionnés
 *
 * */

export class TagsArray {
	constructor() {
		this._selectedTags = [];
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
    this._selectedTags.forEach( (tag) => { 
      exists ||= tagname === tag[0]});
    return exists;
  }

  // Supprimer un Tag
	removeTag(event) {

		// Récupérer l'élément <li> et les noms et types dans le dataset
		const liElement = event.target.parentNode;
    const name = liElement.getAttribute("data-name");
		const type = liElement.getAttribute("data-type");

		// Chercher l'index
		let index = -1;
    for (let i = 0; i < this._selectedTags.length; i++) {
			if (this._selectedTags[i][0] === name) {
				index = i;
			}
		}

		if (index != -1) {
			liElement.remove();
			this._selectedTags.splice(index, 1);
		}
	}

  // Ajouter un Tag
	addTag(name, type) {
		if (!this.existsTag(name)) {
			// insérer un nouvel élément
			this._selectedTags.push([name, type]);

      let color = this.getTagcolor(type);

			// Construire le nouvel élément <li> enfant de <ul>
			const ulNode = document.getElementById("listTags");
			ulNode.innerHTML += `
        <li class="d-flex flex-row mt-2 justify-content-between align-items-center ${color} blockTags-item"
            data-name="${name}" data-type="${type}">${name}
          <img id="closetag" src="assets/icons/close.svg" alt="Supprimer le tag" class="mx-1">	
        </li>
      `;

      let tabclose = document.querySelectorAll("#closetag");
			// Configurer le listener sur tous les éléments <li>
			tabclose.forEach((li) => {
        li.addEventListener("click", (e) => {
				  e.preventDefault();
				  this.removeTag(e);
			  });
      })
		}
	}
}
