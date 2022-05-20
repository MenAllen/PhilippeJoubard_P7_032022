// Déclaration 
import { selectedTags } from "../pages/index.js";
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
    this._menuId = menuId;
    this._listId = listId;
    this._btnId = btnId;
    this._itemClass = itemClass;
    this._widthClass = widthClass;
		this._actives = data.map((i) => true);

    // Nettoyage de la liste des ingredients: accents et fautes d'orthographe
    this._elements = clearString(this._elements);

  }

  // Affichage de la liste des éléments ingrédients, appliances ou ustensiles
  displayListDOM() {

    let itemsListString = "";

    for (let i=0; i < this._elements.length; i++) {
      itemsListString += `<i id="btnClose" class="${this._itemClass} font-Lato18 text-white" data-name="${this._elements[i]}" data-type="${this._dataType}">${this._elements[i]}</i>`;
    }

    return (itemsListString);
  }

  // Activation des listeners sur les boutons de chaque liste
  activateList() {

    const elementMenu = document.getElementById(this._menuId);
    const elementBtn = document.getElementById(this._btnId);
    const elementUl = document.getElementById(this._listId);
  
    elementBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (elementUl.classList.contains("items-display")) {
        elementMenu.classList.remove(this._widthClass);
        elementBtn.childNodes[1].style.transform = "rotate(0deg)";
        elementUl.classList.remove("items-display");
        return;
      }
      /*clearLists();*/
      closeAllLists();
      elementMenu.classList.add(this._widthClass);
      elementBtn.childNodes[1].style.transform = "rotate(180deg)";
      elementUl.classList.add("items-display");
      elementUl.innerHTML = this.displayListDOM();
      this.activateListItems();
    });
  
  }

  // Activation des listeners sur chaque élément de la liste
  activateListItems () {

    const listItems = document.querySelectorAll(`.${this._itemClass}`);
    listItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        selectedTags.addTag(item.dataset.name, item.dataset.type);
        this.closeList();
       })
    });
  }

  // Close list: display à none, largeur bouton mini, chevron vers le bas
  closeList() {

		document.getElementById(this._listId).classList.remove("items-display");
		document.getElementById(this._menuId).classList.remove(this._widthClass);	
		document.getElementById(this._btnId).childNodes[1].style.transform = "rotate(0deg)";
  }
}