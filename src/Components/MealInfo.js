import { useEffect } from "react";
import { ReactComponent as CloseSvg } from "../assets/close.svg";

export default function MealInfo({ meal, closeMealInfo }) {
   
   const ingredientsList = [];
   for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`])
         ingredientsList.push(<li key={i}>{meal[`strIngredient${i}`] + " - " + meal[`strMeasure${i}`]}</li>);
   }

   useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => document.body.style.overflow = "initial"
   })

   return (
      <div>
         <div className="mealInfo">
            <div className="mealInfoCon">
               <button aria-label="close" className="closeInfo">
                  <CloseSvg onClick={closeMealInfo}/>
               </button>
               <h1 className="mealName">{meal.strMeal}</h1>
               <img src={meal.strMealThumb} alt="meal" />
               <div className="instructions">{meal.strInstructions}</div>
               <div className="ingredients">
                  <h3>Ingredients:</h3>
                  <ul>
                     {ingredientsList}
                  </ul>
               </div>
            </div>
         </div>
      </div>
   );
}
