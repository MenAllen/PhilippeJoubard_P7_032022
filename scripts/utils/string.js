/**
 *
 * @param {*} a
 * @returns string
 */
function strNoAccent(a) {
	var b = "áàâäãåçéèêëíïîìñóòôöõúùûüýÁÀÂÄÃÅÇÉÈÊËÍÏÎÌÑÓÒÔÖÕÚÙÛÜÝ",
		c = "aaaaaaceeeeiiiinooooouuuuyAAAAAACEEEEIIIINOOOOOUUUUY",
		d = "";
	for (var i = 0, j = a.length; i < j; i++) {
		var e = a.substr(i, 1);
		d += b.indexOf(e) !== -1 ? c.substr(b.indexOf(e), 1) : e;
	}
	return d;
}

/**
 * clearString est un utilitaire de traitement de chaine de caractères
 * entree : tableau de chaines de caractères
 *
 * @returns tableau traité : corrections doublons, fautes, suppression accents
 */
export function clearString(stringArray) {

  // Variables de travail
  let workingArray = [];
  let uniqueworkingArray = [];
  let str = "";

  // Tableu des exceptions à traiter: les éléments qui gardent un "s" et les éléments à remplacer
  let tabExceptions = ["bananes", "huile d'olives", "kiwis", "pommes"];
  let tabCorrections = [["casserolle", "casserole"]]

	for (let i = 0; i < stringArray.length; i++) {
    workingArray[i] = strNoAccent(stringArray[i]);
    if (workingArray[i].endsWith("s")) {
      if (tabExceptions.indexOf(workingArray[i]) != -1) {
        str = workingArray[i].slice(0, -1);
        workingArray[i] = str;
      }
    } else if (workingArray[i] === tabCorrections[0][0]) {
      workingArray[i] = tabCorrections[0][1]
    }
  }
	//  workingArray = stringArray.map((elt) => { elt = strNoAccent(elt) });
  uniqueworkingArray = [...new Set(workingArray)];
	return uniqueworkingArray;
}
