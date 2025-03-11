const recipeListEl = document.getElementById("recipe-list");
const searchInputEl = document.getElementById("search-input");
const searchButtonEl = document.getElementById("search-button");

// Function to display recipes
function displayRecipes(meals) {
    recipeListEl.innerHTML = "";
    if (!meals || meals.length === 0) {
        recipeListEl.innerHTML = "<p>No recipes found.</p>";
        return;
    }

    meals.forEach((meal) => {
        const recipeItemEl = document.createElement("li");
        recipeItemEl.classList.add("recipe-item");

        const recipeImageEl = document.createElement("img");
        recipeImageEl.src = meal.strMealThumb;
        recipeImageEl.alt = meal.strMeal;

        const recipeTitleEl = document.createElement("h3");
        recipeTitleEl.innerText = meal.strMeal;

        const recipeIngredientsEl = document.createElement("p");
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
                ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
            }
        }
        recipeIngredientsEl.innerHTML = `<strong>Ingredients:</strong> ${ingredients.join(", ")}`;

        const recipeLinkEl = document.createElement("a");
        recipeLinkEl.href = `recipe.html?id=${meal.idMeal}`;
        recipeLinkEl.target = "_self"; // Ensures it opens in the same tab        
        recipeLinkEl.innerText = "View Recipe";
       

        recipeItemEl.appendChild(recipeImageEl);
        recipeItemEl.appendChild(recipeTitleEl);
        recipeItemEl.appendChild(recipeIngredientsEl);
        recipeItemEl.appendChild(recipeLinkEl);
        recipeListEl.appendChild(recipeItemEl);
    });
}

// Fetch 10 random meals
async function getPopularMeals() {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood`);
        const data = await response.json();
        const mealIds = data.meals.slice(0, 10).map(meal => meal.idMeal);

        // Fetch full details for each meal
        const mealPromises = mealIds.map(id =>
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`).then(res => res.json())
        );

        const mealsData = await Promise.all(mealPromises);
        return mealsData.map(data => data.meals[0]);
    } catch (error) {
        console.error("Error fetching popular meals:", error);
        return [];
    }
}

// Search for meals
async function searchMeals(query) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await response.json();
        return data.meals || [];
    } catch (error) {
        console.error("Error searching for meals:", error);
        return [];
    }
}

// Initialize with popular meals
async function init() {
    const meals = await getPopularMeals();
    displayRecipes(meals);
}


// Handle search
searchButtonEl.addEventListener("click", async () => {
    const query = searchInputEl.value.trim();
    if (query) {
        const meals = await searchMeals(query);
        displayRecipes(meals);
    }
});

// Load 10 random meals on page load
init();
