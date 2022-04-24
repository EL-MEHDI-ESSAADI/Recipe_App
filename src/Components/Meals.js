import Meal from "./Meal";

export default function Meals({meals, addMealToFavorites, removeMealFromFavorites, makeMealActive}) {
   const mealsElements = meals.map((meal) => (
      <Meal key={meal.idMeal} meal={meal} makeMealActive={makeMealActive} addMealToFavorites={addMealToFavorites} removeMealFromFavorites={removeMealFromFavorites}/>
   ));

   return <div className="mealsContainer grid">{mealsElements.length ? mealsElements: <Meal type="template" />}</div>;
}
