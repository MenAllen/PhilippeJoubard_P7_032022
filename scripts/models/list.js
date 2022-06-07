// Déclaration
import { selectedTags } from "../pages/index.js";
import { closeAllLists } from "../pages/index.js";
import { clearString } from "../utils/string.js";

/**
 * Classe Liste
 *
 * @Property (array) elements - tableau des éléments de la liste
 * @property (string) dataType - type de tableau: £ingredients, $appliances ou $ustensils
 * @property (string) input - l'expression entrée
 * @property (string) menuId - l'id de l'élément menu
 * @property (string) listId - l'id de l'élément liste
 * @property (string) btnId - l'id du bouton
 * @property (string) itemClass - la classe de l'element i
 * @property (string) widthClass - la largeur spécifique de la liste
 * @property (array) actives - tableau des éléments de la liste sélectionnés suite à l'entrée d'une expression dans l'input
 * 
 * */

export class List {
	constructor(data, dataType, menuId, listId, btnId, itemClass, widthClass) {
		this._elements = data;
		this._dataType = dataType;
		this._input = "";
		this._menuId = menuId;
		this._listId = listId;
		this._btnId = btnId;
		this._itemClass = itemClass;
		this._widthClass = widthClass;

		// Nettoyage de la liste des ingredients: accents et fautes d'orthographe
		this._elements = clearString(this._elements);
		this._actives = this._elements;
		
		// Initialisations complémentaires pour les placeholder
		this._firstPlaceholder = document.getElementById(this._dataType).getAttribute("placeholder");
		switch(this._dataType) {
			case "$ingredients":
				this._secondPlaceholder = "Rechercher un ingrédient";
				break;
			case "$ustensils":
				this._secondPlaceholder = "Rechercher un ustensile";
				break;
			case "$appliances":
				this._secondPlaceholder = "Rechercher un appareil";
				break;
			default:
				console.log("Placeholder: erreur type");
		}

		/* Sur keyup, si plus de 2 caractères, on recherche les items sélectionnables */
		const elementMenu = document.getElementById(this._menuId);
		elementMenu.addEventListener("keyup", (e) => {
			e.preventDefault();
			this._input = e.target.value.toLowerCase();
			this._actives = this._elements;
			this._actives = this._input.length > 2 ? this._actives.filter((elt) => elt.toLowerCase().includes(this._input.toLowerCase())) : [];
			this.activateInputList();
		});

	}

	/**
	 *  Affichage de la liste des éléments ingrédients, appliances ou ustensiles
	 *  On omet les tags créés de la liste
	 * 
	 * @returns string fait des éléments <i> trouvés
	 */
	displayListDOM() {
		let itemsListString = "";

		for (const element of this._elements) {
			if (!selectedTags.existsTag(element)) {
				itemsListString += `<i id="btnClose" class="${this._itemClass} font-Lato18 text-white" data-name="${element}" data-type="${this._dataType}">${element}</i>`;
			}
		}

		return itemsListString;
	}

	// Affichage de la liste des éléments trouvés dan this_elements à partir de l'expression rentrée dans l'input
	displayInputListDOM() {
		let itemsListString = "";

		for (const element of this._actives) {
			if (!selectedTags.existsTag(element)) {
				itemsListString += `<i id="btnClose" class="${this._itemClass} font-Lato18 text-white" data-name="${element}" data-type="${this._dataType}">${element}</i>`;
			}
		}

		return itemsListString;
	}

	/**
	 * Affichage ou fermeture de la liste des éléments visés (ingrédients, appareils ou ustensiles)
	 *  
	 */
	activateList() {
		const elementMenu = document.getElementById(this._menuId);
		const elementBtn = document.getElementById(this._btnId);
		const elementUl = document.getElementById(this._listId);
		const elementInput = document.getElementById(this._dataType);

		console.log("Input:", elementInput);

		if (elementUl.classList.contains("items-display")) {
			elementMenu.classList.remove(this._widthClass, "input-extendedwidth");
			elementBtn.childNodes[1].style.transform = "rotate(0deg)";
			elementUl.classList.remove("items-display", "inputList");
			elementInput.setAttribute("placeholder", this._firstPlaceholder );
			elementInput.classList.remove("change");
			return;
		}

		closeAllLists();
		elementMenu.classList.add(this._widthClass);
		elementBtn.childNodes[1].style.transform = "rotate(180deg)";
		elementUl.classList.add("items-display");
		elementUl.innerHTML = this.displayListDOM();
		elementInput.setAttribute("placeholder", this._secondPlaceholder);
		elementInput.classList.add("change");
		this.activateListItems();

	}

	/**
	 * Affichage de la liste des éléments trouvés suite à l'input de 3 caractères ou plus
	 * Les éléments sont listés sur une seule colonne
	 * La fermeture se fera via les closelists ou un click
	 */
	activateInputList() {
		const elementMenu = document.getElementById(this._menuId);
		const elementUl = document.getElementById(this._listId);

		elementMenu.classList.add("input-extendedwidth");
		elementUl.classList.add("items-display", "inputList");
		elementUl.innerHTML = this.displayInputListDOM();
		this.activateListItems();
	}

	/**
	 * Activation des listeners sur chaque élément de la liste sélectionnée
	 */
	activateListItems() {
		const listItems = document.querySelectorAll(`.${this._itemClass}`);
		listItems.forEach((item) => {
			item.addEventListener("click", (e) => {
				e.preventDefault();
				selectedTags.addTag(item.dataset.name, item.dataset.type);
				this.removeListItem(item.dataset.name);
				this.closeList();
				this.clearInput();
				e.stopPropagation();
			});
		});
	}

	/**
	 * Supprimer un élément de la liste suite à sa sélection en tag
	 * @param {*} itemName 
	 */
	removeListItem(itemName) {
		const myIndex = this._elements.indexOf(itemName);
		if (myIndex !== -1) {
			this._elements.splice(myIndex, 1);
		}
	}

	/**
	 * Ajouter un élément de la liste suite à une suppression de tag
	 * @param {*} itemName 
	 */
	addListItem(itemName) {
		const myIndex = this._elements.indexOf(itemName);
		if (myIndex === -1) {
			this._elements.push(itemName);
			this._elements.sort();
		} 
	}

	/**
	 * Mise à jour de la liste suite à une liste de recettes modifiée
	 * @param {*} tabList 
	 */
	updateList(tabList) {
		// Nettoyage de la liste des ingredients: accents et fautes d'orthographe
		this._elements = clearString(tabList);
	}

	/**
	 * Arrêt de l'affichage de la liste, larguer bouton à mini et chevron vers le bas
	 */
	closeList() {
		document.getElementById(this._listId).classList.remove("items-display", "inputList");
		document.getElementById(this._menuId).classList.remove(this._widthClass, "input-extendedwidth");
		document.getElementById(this._btnId).childNodes[1].style.transform = "rotate(0deg)";
		document.getElementById(this._dataType).value = "";
		document.getElementById(this._dataType).setAttribute("placeholder", this._firstPlaceholder );
		document.getElementById(this._dataType).classList.remove("change");

		this._actives = this._elements;
		this._input = "";
	}

	/**
	 * Effacement de la valeur de l'input et update de l'affichage des recettes
	 */
	clearInput() {
		this._input = "";
		document.getElementById(this._dataType).value = "";
	}
}
