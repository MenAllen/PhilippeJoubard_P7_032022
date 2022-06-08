/**
 * clearString est un utilitaire de traitement de chaine de caractères
 * entree : tableau de chaines de caractères
 *
 * @returns tableau traité : corrections doublons, fautes, suppression accents
 */
export function clearString(stringArray) {
	// Variables de travail
	const workingArray = [];
	let uniqueworkingArray = [];
	let str = "";

	// Déclarer le Tableau des exceptions et le tableau des corrections
	const tabExceptions = ["Bananes", "Huile d'olives", "Kiwis", "Pommes"];
	const tabCorrections = [
		["casserolle", "Casserole"],
		["Casserolle", "Casserole"],
		["Casserolle.", "Casserole"],
		["Crème Fraiche", "Crème fraîche"],
		["Crème fraiche", "Crème fraîche"],
		["Crème Fraîche", "Crème fraîche"],
		["Crême fraîche", "Crème fraîche"],
		["cuillère en bois", "Cuillère en bois"],
		["cuillère à Soupe", "Cuillère à Soupe"],
		["couteau", "Couteau"],
		["économe", "Économe"],
		["poelle à frire", "Poelle à frire"],
		["Lait de Coco", "Lait de coco"],
		["Sucre en Poudre", "Sucre en poudre"],
		["farine", "Farine"],
		["huile d'olive", "Huile d'olive"],
		["huile d'olives", "Huile d'olive"],
		["gruyère râpé", "Gruyère râpé"],
		["Petits poids", "Petits pois"],
		["Poudre d'amendes", "Poudre d'amandes"],
	];

	// Enlever les "s" pour éviter les doublons
	for (let i = 0; i < stringArray.length; i++) {
		workingArray[i] = stringArray[i];
		if (workingArray[i].endsWith("s") && tabExceptions.includes(workingArray[i])) {
			str = workingArray[i].slice(0, -1);
			workingArray[i] = str;
		}
	}

	// Corriger certains cas où des fautes d'orthographe génèrent des doublons
	for (let i = 0; i < workingArray.length; i++) {
		for (const tabCorrection of tabCorrections) {
			if (workingArray[i] === tabCorrection[0]) {
				workingArray[i] = tabCorrection[1];
			}
		}
	}

	// Supprimer les doublons et retourner le tableau
	uniqueworkingArray = [...new Set(workingArray.sort())];
	return uniqueworkingArray;
}

/**
 * la fonction filterTab réalise un filtrage sur le tableau de recettes reçu
 * Un tableau de booleens de même longueur lui indique si chacn des éléments doit
 * être filtré ou non
 *
 * @param {*} indexTab la table des index à true ou false
 * @returns tableau filteredRecipes filtré
 */
export function filterTab(inputTab, indexTab) {
	const resultTab = [];

	for (let i in indexTab) {
		if (indexTab[i]) {
			resultTab.push(inputTab[i]);
		}
	}
	return resultTab;
}

/**
 * La fonction itemPresent vérifie la présence dans un tableau d'un item donné
 *
 * @param {*} inputTab
 * @param {*} item
 * @returns itemExists boolean
 */
export function itemPresent(inputTab, item) {
	let itemExists = false;

	for (let i in inputTab) {
		itemExists ||= inputTab[i] === item;
	}
	return itemExists;
}
