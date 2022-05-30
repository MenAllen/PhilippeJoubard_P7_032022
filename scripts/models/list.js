// Déclaration
import { selectedTags, updateRecipes } from "../pages/index.js";
import { closeAllLists } from "../pages/index.js";
import { clearString } from "../utils/string.js";

/**
 * Classe Liste
 *
 * @Property (array) name - tableau des éléments de la liste
 * @property (array) active - tableau de booleens des elements de liste actifs ou non actifs
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
		this._actives = data.map((i) => true);

		// Nettoyage de la liste des ingredients: accents et fautes d'orthographe
		this._elements = clearString(this._elements);

		let elementMenu = document.getElementById(this._menuId);
		elementMenu.addEventListener("keyup", (e) => {
			e.preventDefault();
			e.stopImmediatePropagation();
			this._input = e.target.value.toLowerCase();
			if (this._input.length > 2) {
				this._elements = this._elements.filter((elt) => elt.toLowerCase().includes(this._input.toLowerCase()));
				this.activateList(true);
			}
			updateRecipes();
		});

	}

	// Affichage de la liste des éléments ingrédients, appliances ou ustensiles
	displayListDOM() {
		let itemsListString = "";

		for (let i = 0; i < this._elements.length; i++) {
			if (!selectedTags.existsTag(this._elements[i])) {
				itemsListString += `<i id="btnClose" class="${this._itemClass} font-Lato18 text-white" data-name="${this._elements[i]}" data-type="${this._dataType}">${this._elements[i]}</i>`;
			}
		}

		return itemsListString;
	}

	/**
	 * Affichage ou fermeture de la liste des éléments visés (ingrédients, appareils ou ustensiles)
	 * 
	 * @param {*} open boolean True => afficher la liste / False: ouvrir ou fermer selon l'état actuel
	 * @returns 
	 */
	activateList(open) {
		let elementMenu = document.getElementById(this._menuId);
		let elementBtn = document.getElementById(this._btnId);
		let elementUl = document.getElementById(this._listId);

		if (!open) {
			if (elementUl.classList.contains("items-display")) {
				elementMenu.classList.remove(this._widthClass);
				elementBtn.childNodes[1].style.transform = "rotate(0deg)";
				elementUl.classList.remove("items-display");
				return;
			};
		};
		closeAllLists();
		elementMenu.classList.add(this._widthClass);
		elementBtn.childNodes[1].style.transform = "rotate(180deg)";
		elementUl.classList.add("items-display");
		elementUl.innerHTML = this.displayListDOM();
		this.activateListItems();

	} 

	// Activer des listeners sur chaque élément de la liste
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

	// Supprimer un élément de la liste
	removeListItem(itemName) {
		let myIndex = this._elements.indexOf(itemName);
		if (myIndex !== -1) {
    	this._elements.splice(myIndex, 1);
		}
	}

	// Ajouter un élément de la liste
	addListItem(itemName) {
		let myIndex = this._elements.indexOf(itemName);
		if (myIndex === -1) {
	   	this._elements.push(itemName);
			this._elements.sort();
		} 
	}

	updateList(tabList) {
		this._elements = tabList;
		// Nettoyage de la liste des ingredients: accents et fautes d'orthographe
		this._elements = clearString(this._elements);
	}

	// Close list: display à none, largeur bouton mini, chevron vers le bas
	closeList() {
		document.getElementById(this._listId).classList.remove("items-display");
		document.getElementById(this._menuId).classList.remove(this._widthClass);
		document.getElementById(this._btnId).childNodes[1].style.transform = "rotate(0deg)";
	}

	//
	clearInput() {
		this._input = "";
		document.getElementById(this._dataType).value = "";
		updateRecipes();
	}
}
