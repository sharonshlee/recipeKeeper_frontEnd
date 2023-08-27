window.onload = () => {
	let name = document.getElementById("name");
	let ingredients = document.getElementById("ingredients");
	let steps = document.getElementById("steps");
	let imageUrl = document.getElementById("imageUrl");
	let submitButton = document.getElementById("submitButton");

	let nameError = document.getElementById("nameError");
	let ingredientsError = document.getElementById("ingredientsError");
	let stepsError = document.getElementById("stepsError");

	let container = document.getElementById("container");
	removeAllRecipesButton = document.getElementById("removeAllRecipesButton");
	removeAllRecipesDiv = document.getElementById("removeAllRecipesDiv");
	let recipeId = document.getElementById("recipeId");
	let recipeFormTitle = document.getElementById("recipeFormTitle");

	let recipes = [];

	const checkError = (newRecipe) => {
		let errorCount = 0;
		if (!newRecipe.name) {
			nameError.innerText = "Name cannot be empty.";
			errorCount++;
		} else {
			nameError.innerText = "";
		}
		if (!newRecipe.ingredients) {
			ingredientsError.innerText = "Ingredients cannot be empty.";
			errorCount++;
		} else if (!newRecipe.ingredients.includes(",")) {
			ingredientsError.innerText = "Ingredients must be comma separated.";
			errorCount++;
		} else {
			ingredientsError.innerText = "";
		}
		if (!newRecipe.steps) {
			stepsError.innerText = "Steps cannot be empty.";
			errorCount++;
		} else {
			stepsError.innerText = "";
		}

		return errorCount > 0;
	};

	const emptyFields = () => {
		name.value = "";
		ingredients.value = "";
		steps.value = "";
		imageUrl.value = "";
		name.focus();
	};

	const displayRecipe = (newRecipe) => {
		let newRecipeDiv = document.createElement("div");
		newRecipeDiv.classList.add("recipe");

		newRecipeDiv.id = `recipe${newRecipe.id}`;

		newRecipeDiv.innerHTML = `
			<div class="header">
				<h2 id="recipeTitle${newRecipe.id}">${newRecipe.name}</h2>
				<span></span>
				<div class="editDeletebuttons">
					<button class="material-symbols-outlined" onclick="editRecipe('${
						newRecipe.id
					}')">edit</button>
					<button class="material-symbols-outlined" onclick="removeRecipe('${
						newRecipe.id
					}')">delete</button>
				</div>
			</div>
			
			<img id="recipeImage${newRecipe.id}" src="${
			newRecipe.imageUrl
		}" alt="recipe image" />

			<div class="content">
				<h3>Ingredients: </h3><span id="recipeIngredients${newRecipe.id}">${
			newRecipe.ingredients
		}</span>
				<br><h3>Steps: </h3><span id="recipeSteps${
					newRecipe.id
				}">${newRecipe.steps.replace(/\n/g, "<br>")}</span>
			</div>
			<br />
        `;

		container.appendChild(newRecipeDiv);
	};

	const toggleRemoveAllButton = () => {
		removeAllRecipesButton.style.display =
			recipes.length === 0 ? "none" : "inline-block";
	};

	const toggleEditDeleteButtons = (disabled) => {
		for (const editDeleteBtn of document.getElementsByClassName(
			"editDeletebuttons"
		)) {
			editDeleteBtn.childNodes.forEach(
				(btn) => (btn.disabled = disabled)
			);
		}
		removeAllRecipesButton.disabled = disabled;
	};

	const toggleAddUpdateForm = (actionMessage) => {
		recipeFormTitle.innerText = actionMessage;
		submitButton.value = actionMessage;
	};

	if (localStorage.getItem("recipes")) {
		recipes = JSON.parse(localStorage.getItem("recipes"));
		for (recipe of recipes) {
			displayRecipe(recipe);
		}
	}

	toggleRemoveAllButton();

	recipeForm.addEventListener("submit", (event) => {
		event.preventDefault();

		const recipe = {
			name: name.value,
			ingredients: ingredients.value,
			steps: steps.value,
			imageUrl: imageUrl.value,
		};

		if (checkError(recipe)) {
			return;
		}

		if (recipeId.value) {
			recipeToUpdate = recipes.find(
				(recipe) => recipe.id === recipeId.value
			);

			recipe.id = recipeId.value;
			recipes[recipes.indexOf(recipeToUpdate)] = recipe;

			document.getElementById(`recipeTitle${recipe.id}`).innerText =
				recipe.name;
			document.getElementById(`recipeIngredients${recipe.id}`).innerText =
				recipe.ingredients;
			document.getElementById(`recipeSteps${recipe.id}`).innerText =
				recipe.steps;
			document.getElementById(`recipeImage${recipe.id}`).src =
				recipe.imageUrl;

			recipeId.value = "";
			toggleAddUpdateForm("Add Recipe");
			emptyFields();
			toggleEditDeleteButtons(false);
		} else {
			recipe.id = recipes.length.toString();
			displayRecipe(recipe);
			recipes.push(recipe);
		}

		localStorage.setItem("recipes", JSON.stringify(recipes));

		toggleRemoveAllButton();
		emptyFields();
	});

	editRecipe = (id) => {
		name.focus();
		toggleAddUpdateForm("Update Recipe");

		name.value = document.getElementById(`recipeTitle${id}`).innerText;
		ingredients.value = document.getElementById(
			`recipeIngredients${id}`
		).innerText;
		steps.value = document.getElementById(`recipeSteps${id}`).innerText;
		imageUrl.value = document.getElementById(`recipeImage${id}`).src;

		recipeId.value = id;
		toggleEditDeleteButtons(true);
	};

	removeRecipe = (id) => {
		recipeDiv = document.getElementById(`recipe${id}`);
		container.removeChild(recipeDiv);

		recipeToDelete = recipes.find((recipe) => recipe.id === id);
		if (recipeToDelete) {
			recipes.splice(recipes.indexOf(recipeToDelete), 1);
		}

		localStorage.setItem("recipes", JSON.stringify(recipes));
		toggleRemoveAllButton();
	};

	removeAllRecipesButton.onclick = () => {
		recipes = [];
		// Remove all child nodes of the container
		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}
		removeAllRecipesButton.hidden = true;
		container.appendChild(removeAllRecipesDiv);
		localStorage.clear();
		toggleRemoveAllButton();
	};
};
