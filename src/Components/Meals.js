import Meal from "./Meal";
import React from "react";

function Meals({meals, addMealToFavorites, removeMealFromFavorites, makeMealActive}) {
   console.log("meals render")
   const mealsElements = meals.map((meal) => (
      <Meal key={meal.idMeal} meal={meal} makeMealActive={makeMealActive} addMealToFavorites={addMealToFavorites} removeMealFromFavorites={removeMealFromFavorites}/>
   ));

   return <div className="mealsContainer grid">{mealsElements.length ? mealsElements: <Meal type="template" />}</div>;
}

export default React.memo(Meals, (prevProps, newProps) => prevProps.meals === newProps.meals)