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

		// Nettoyage de la liste des ingredients: accents et fautes d'orthographe
		this._elements = clearString(this._elements);
		this._actives = this._elements;

		const elementMenu = document.getElementById(this._menuId);

		/* Sur keyup, si plus de 2 caractères, on recherche les items sélectionnables */
		elementMenu.addEventListener("keyup", (e) => {
			e.preventDefault();
			e.stopImmediatePropagation();
			this._input = e.target.value.toLowerCase();
			if (this._input.length > 2) {
				this._actives = this._actives.filter((elt) => elt.toLowerCase().includes(this._input.toLowerCase()));
				this.activateInputList();
			} else {
				this._actives = this._elements;
			}
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

	// Affichage de la liste des éléments trouvés dan this_elements à partir de l'expression rentrée dans l'input
	displayInputListDOM() {
		let itemsListString = "";

		for (let i = 0; i < this._actives.length; i++) {
			if (!selectedTags.existsTag(this._actives[i])) {
				itemsListString += `<i id="btnClose" class="${this._itemClass} font-Lato18 text-white" data-name="${this._actives[i]}" data-type="${this._dataType}">${this._actives[i]}</i>`;
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

		if (elementUl.classList.contains("items-display")) {
			elementMenu.classList.remove(this._widthClass, "input-extendedwidth");
			elementBtn.childNodes[1].style.transform = "rotate(0deg)";
			elementUl.classList.remove("items-display", "inputList");
			return;
		};

		closeAllLists();
		elementMenu.classList.add(this._widthClass);
		elementBtn.childNodes[1].style.transform = "rotate(180deg)";
		elementUl.classList.add("items-display");
		elementUl.innerHTML = this.displayListDOM();
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
		this._elements = tabList;
		// Nettoyage de la liste des ingredients: accents et fautes d'orthographe
		this._elements = clearString(this._elements);
	}

	/**
	 * Arrêt de l'affichage de la liste, larguer bouton à mini et chevron vers le bas
	 */
	closeList() {
		document.getElementById(this._listId).classList.remove("items-display", "inputList");
		document.getElementById(this._menuId).classList.remove(this._widthClass, "input-extendedwidth");
		document.getElementById(this._btnId).childNodes[1].style.transform = "rotate(0deg)";
		document.getElementById(this._dataType).value = "";		
		this._actives = this._elements;
		this._input = "";
	}

	/**
	 * Effacement de la valeur de l'input
	 */
	clearInput() {
		this._input = "";
		document.getElementById(this._dataType).value = "";
		updateRecipes();
	}
}
