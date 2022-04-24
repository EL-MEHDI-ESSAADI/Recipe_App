/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Header from "./Components/Header";
import Favorites from "./Components/Favorites";
import Meals from "./Components/Meals";
import MealInfo from "./Components/MealInfo";
import * as thirdParty from "./modules/thirsParty";

function App() {
   const [meals, setMeals] = useState([]);
   const [favoriteMeals, setFavoriteMeals] = useState(() => JSON.parse(localStorage.getItem("favorites")) || []);
   // active meal is the that currently the user exploring his details
   const [activeMeal, setActiveMeal] = useState(null);
   const [isPreloaderOn, setIsPreloaderOn] = useState(false);

   // hendling localStorage
   useEffect(() => {
      localStorage.setItem("favorites", JSON.stringify(favoriteMeals));
   }, [favoriteMeals]);
   
   // hendling first random meal
   useEffect(() => {
      thirdParty.handelData(thirdParty.RANDOM_MEAL_API, (data) => {
         const randomMeal = data.meals[0];
         randomMeal.isRandom = true;
         randomMeal.isFavorite = favoriteMeals.some((item) => item.idMeal === randomMeal.idMeal);
         setMeals([randomMeal]);
      });
   }, []);

   function addMealToFavorites(meal) {
      setFavoriteMeals((old) => [...old, meal]);
      setMeals((old) => old.map((item) => (item.idMeal === meal.idMeal ? { ...item, isFavorite: true } : item)));
   }
   function removeMealFromFavorites(mealId) {
      setFavoriteMeals((old) => old.filter((item) => item.idMeal !== mealId));
      setMeals((old) => old.map((item) => (item.idMeal === mealId ? { ...item, isFavorite: false } : item)));
   }

   function makeMealActive(meal) {
      setActiveMeal(meal);
   }

   function searchForMeals(searchStr) {
      // add preloader
      setIsPreloaderOn(true);
      const endPoint = thirdParty.SEARCH_MEAL_API.replace("searchStr", searchStr);
      thirdParty.handelData(endPoint, ({ meals: mealsData }) => {
         // remove preloader
         setIsPreloaderOn(false);
         // check if mealsData is empty
         if (!mealsData) {
            window.alert(`there is no meals with "${searchStr}" name`);
            return;
         }
         // add  isFavorite property to mealsData"s elements
         mealsData.forEach((item) => {
            item.isFavorite = favoriteMeals.some((favorite) => favorite.idMeal === item.idMeal);
         });
         // update our meals state
         setMeals(mealsData);
      });
   }

   return (
      <>
         <Header searchForMeals={searchForMeals} />
         <Favorites
            favoriteMeals={favoriteMeals}
            removeMealFromFavorites={removeMealFromFavorites}
            makeMealActive={makeMealActive}
         />
         <Meals
            meals={meals}
            makeMealActive={makeMealActive}
            addMealToFavorites={addMealToFavorites}
            removeMealFromFavorites={removeMealFromFavorites}
         />
         {activeMeal && <MealInfo meal={activeMeal} closeMealInfo={() => setActiveMeal(null)} />}
         {isPreloaderOn && <div className="preloader"></div>}
      </>
   );
}

export default App;
