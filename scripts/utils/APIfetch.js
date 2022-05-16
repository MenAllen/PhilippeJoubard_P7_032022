/**
 * getPhotographers récupère les données du fichier photographsers.json par un fetch
 *
 * @returns
 */
export function getRecipes() {
	return fetch("./data/recipes.json")
		.then((response) => response.json())
		.catch((err) => {
			throw `la requete API fetch a échoué: ${err}`;
		});
}
