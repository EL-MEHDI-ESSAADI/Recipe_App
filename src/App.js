/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Header from "./Components/Header";
import Favorites from "./Components/Favorites";
import Meals from "./Components/Meals";
import MealInfo from "./Components/MealInfo";
import * as thirdParty from "./modules/thirsParty";
import Modal from "./Components/Modal";
function App() {
   const [meals, setMeals] = useState([]);
   const [favoriteMeals, setFavoriteMeals] = useState(() => JSON.parse(localStorage.getItem("favorites")) || []);
   // active meal is the that currently the user exploring his details
   const [activeMeal, setActiveMeal] = useState(null);
   const [showPreloader, setShowPreloader] = useState(false);
   const [pageModal, setPageModal] = useState(()=>({show: false, content: null}))

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
      setShowPreloader(true);
      const endPoint = thirdParty.SEARCH_MEAL_API.replace("searchStr", searchStr);
      thirdParty.handelData(endPoint, ({ meals: mealsData }) => {
         // remove preloader
         setShowPreloader(false);
         // check if mealsData is empty
         if (!mealsData) {
            setPageModal({show: true, content: `There is no meals with "${searchStr}" name`})
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

   function closeModal() {
      setPageModal({show: false, content: null})
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
         {showPreloader && <div className="preloader"></div>}
         {pageModal.show && <Modal closeModal={closeModal} > {pageModal.content}</Modal>}
      </>
   );
}

export default App;
