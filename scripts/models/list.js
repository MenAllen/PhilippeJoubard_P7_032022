// Déclaration 
import { itemsSelected } from "../pages/index.js";

/**
 * Classe Liste
 *
 * @Property (array) name - tableau des éléments de la liste
 * @property (array) active - tableau de booleens des elements de liste actifs ou non actifs
 *   
* */

 export class List {

	constructor(data, menuId, listId, btnId, itemClass, widthClass) {
		this._elements = data;
    this._menuId = menuId;
    this._listId = listId;
    this._btnId = btnId;
    this._itemClass = itemClass;
    this._widthClass = widthClass;
		this._actives = data.map((i) => true);
	}

  // Affichage de la liste des éléments ingrédients, appliances ou ustensiles
  displayListDOM() {

    let expression = "";

    for (let i=0; i < this._elements.length; i++) {
      expression += `<i class="${this._itemClass} font-Lato18 text-white">${this._elements[i]}</i>`;
    }

    return (expression);
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
        elementUl.classList.remove(displayClass);
        return;
      }
      /*clearLists();*/
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
        console.log(item.outerText);
       })
    });
  }

  // Close list
  closeList() {

		document.getElementById(this._listId).classList.remove("items-display");
		document.getElementById(this._menuId).classList.remove(this._widthClass);	
		document.getElementById(this._btnId).childNodes[1].style.transform = "rotate(0deg)";
  }
}