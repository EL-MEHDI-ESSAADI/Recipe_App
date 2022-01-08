// global variabls
let searchInputEl = document.querySelector(".searchInput");
let searchBtnEl = document.querySelector(".searchBtn");
let FavMealsCon = document.querySelector(".FavoriteMeilsContainer");
let mealsConEl = document.querySelector(".mealsContainer");
let normalMeals = {};
let favoriteMeals;
let allInfoEl = document.querySelector(".allInfo");


// set the random recipe
makeRequest("https://www.themealdb.com/api/json/v1/1/random.php", ({meals}) => {
      createMeals(meals, "random");  
});

// add event listner to search button and input
searchBtnEl.addEventListener("click", _ => {
   let searchStr = searchInputEl.value; 
   if(!searchStr) return;
   searchInputEl.value = "";
   makeRequest(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchStr}`, ({meals}) => {
         createMeals(meals, "", searchStr);
   });
});

searchInputEl.addEventListener("keydown", e => {
   if(e.key === "Enter") searchBtnEl.click();
});

// get user favorite meals from local storage 
favoriteMeals = JSON.parse(localStorage.getItem("favoriteMeals")) || {};
for(let key in favoriteMeals) {
   addToFavorite(favoriteMeals[key], false);
}

// functions

// createMeals is a function that creat all meals elements
function createMeals(meals, random = "", searchStr) {
   // check if the meals is null
   if(!meals) {
      window.alert(`there is no meals with "${searchStr}" name`);
      return
   };
   // remove the mealsconEl template
   mealsConEl.innerHTML = "";
   // ceate meal elements
   meals.forEach(meal => {
      let mealEl = document.createElement("div");
      // know if this meal is one of the user favorites meals or just a norma meal
      let mealType = favoriteMeals[meal.idMeal] ? "favorite": "normal";  
      normalMeals[meal.idMeal] = meal;
      mealEl.classList.add("meal");
      // add class random if the meal is randomly
      if(random) mealEl.classList.add(random);

      mealEl.innerHTML = `
      <figure >
         <img data-idmeal="${meal.idMeal}" class="image" src="${meal.strMealThumb}" alt="meal image" />
         <figcaption class="flex">
            <div class="title">${meal.strMeal}</div>
            <button aria-label="add to favorite" class= "${mealType}">
               <svg
               xmlns="http://www.w3.org/2000/svg"
               width="24"
               height="24"
               viewBox="0 0 24 24"
               style="fill: rgb(197, 188, 188)"
               >
               <path
                  d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z"
               />
               </svg>
            </button>
         </figcaption>
      </figure>
      `
      // set the functionality of desplaying meal info when we click on meal image
      displayMealInfo(mealEl.querySelector(".image"));
      // set the functionality of add the meal to favorite and remove from it, when we clicking on meal button
      mealEl.querySelector("button").addEventListener("click", function () {
         if(this.classList.contains("normal")){
            addToFavorite(meal);
            this.classList.remove("normal");
            this.classList.add("favorite");
            return;
         }
         removeFromFavorite(meal.idMeal);
      });
      mealsConEl.append(mealEl);
   });
};

/* displayMealInfo is a function that add a event click listner to meal image and when the event fire, meal information 
   will appear
*/
function displayMealInfo(image, state = "normal") {
   image.addEventListener("click", _ => {
      // set meal object depend of state, if it normal or favorite
      let meal = state === "normal" ? normalMeals[image.dataset.idmeal]: favoriteMeals[image.dataset.idmeal];
      let mealInfo = document.createElement("div");
      let ingridinetsLiS = "";
      // set all ingridinets in liS
      for (let i = 1; i <= 20; i++) {
         if(meal[`strIngredient${i}`]) {
            let value = meal[`strIngredient${i}`] + " - " + meal[`strMeasure${i}`] 
            ingridinetsLiS += `<li> ${value} </li>` ;
         }
      };
      mealInfo.classList.add("mealInfo");
      mealInfo.innerHTML = `
      <div class="mealInfoCon">
         <button aria-label="close" class="closeInfo">
            <svg
               xmlns="http://www.w3.org/2000/svg"
               aria-hidden="true"
               focusable="false"
               role="img"
               viewBox="0 0 352 512"
               >
               <path
                  fill="currentColor"
                  d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
               />
            </svg>
         </button>
         <h1 class="mealName">${meal.strMeal}</h1>
         <img src="${meal.strMealThumb}" alt="" />
         <div class="instructions">
            ${meal.strInstructions}
         </div>
      <div class="ingredients">
         <h3>Ingredients:</h3>
         <ul>
            ${ingridinetsLiS}
         </ul>
      </div>
   </div>
      `
      // remove the mealInfo if we click on close button
      mealInfo.querySelector("button").addEventListener("click", _ => {
         mealInfo.remove();
      })
      allInfoEl.append(mealInfo);
   });


}

// is a makeRequest function makes requests
function makeRequest(url="",fun= _ =>{}) {
   let httpRequest;
   if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
      httpRequest = new XMLHttpRequest();
   } else if (window.ActiveXObject) { // IE 6 and older
      httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
   }
   // create one http request and set for it a event listner for statechanging
   httpRequest = new XMLHttpRequest();
   httpRequest.responseType = "json";
   httpRequest.open('GET', `${url}`);
   httpRequest.addEventListener("readystatechange", _ => {
      if(httpRequest.readyState != XMLHttpRequest.DONE) return;
      if(httpRequest.status != 200) {
         // allert Request error we didn't receive data  
         window.alert("Request error");
         return
      };
      fun(httpRequest.response);
   });
   httpRequest.send();
}

// addToFavorite adds meal to favorite and  removeFromFavorite remove it from favorite

function addToFavorite(meal, storage = true){
   let li = document.createElement("li");
   // check if we need to add the meal object to favoriteMeals obj and user local storage  
   if(storage) {
      favoriteMeals[meal.idMeal] = meal;
      localStorage.setItem("favoriteMeals", JSON.stringify(favoriteMeals));
   }
   li.innerHTML = `
   <figure>
      <img
         src="${meal.strMealThumb}"
         alt="favorite meal image"
         data-idmeal="${meal.idMeal}"
      />
      <figcaption>${meal.strMeal}</figcaption>
   </figure>
   <button aria-label="remove from favorite">
      <svg
         xmlns="http://www.w3.org/2000/svg"
         aria-hidden="true"
         focusable="false"
         data-prefix="fas"
         data-icon="window-close"
         class="svg-inline--fa fa-window-close fa-w-16"
         role="img"
         viewBox="0 0 512 512"
      >
         <path
            fill="currentColor"
            d="M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-83.6 290.5c4.8 4.8 4.8 12.6 0 17.4l-40.5 40.5c-4.8 4.8-12.6 4.8-17.4 0L256 313.3l-66.5 67.1c-4.8 4.8-12.6 4.8-17.4 0l-40.5-40.5c-4.8-4.8-4.8-12.6 0-17.4l67.1-66.5-67.1-66.5c-4.8-4.8-4.8-12.6 0-17.4l40.5-40.5c4.8-4.8 12.6-4.8 17.4 0l66.5 67.1 66.5-67.1c4.8-4.8 12.6-4.8 17.4 0l40.5 40.5c4.8 4.8 4.8 12.6 0 17.4L313.3 256l67.1 66.5z"
         />
      </svg>
   </button>
   `
   displayMealInfo(li.querySelector("img"), "favorote");
   // add event listner for "remove" button
   li.querySelector("button").addEventListener("click", _ => removeFromFavorite(meal.idMeal));
   FavMealsCon.append(li);
}

function removeFromFavorite(idMeal) {
   let favImageTarget = FavMealsCon.querySelector(`[data-idmeal="${idMeal}"]`);
   let button = mealsConEl.querySelector(`[data-idmeal="${idMeal}"] ~ figcaption button`);
   // delete meal from all favoriteMeals obj and user local storage 
   delete favoriteMeals[idMeal];
   localStorage.setItem("favoriteMeals", JSON.stringify(favoriteMeals));
   // remove favorite meal element if it exist
   if (favImageTarget) favImageTarget.parentElement.parentElement.remove();
   // set the color of favorite button of the meal to nermal if the meal element exist
   if (button) {
      button.classList.remove("favorite");
      button.classList.add("normal");
   }
   
}; 