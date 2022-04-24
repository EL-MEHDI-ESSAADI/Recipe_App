import { ReactComponent as Heart } from "../assets/heart.svg";

export default function Meal({ meal, type, addMealToFavorites, removeMealFromFavorites, makeMealActive }) {
   if (type === "template") {
      return (
         <div className="meal withPreloader">
            <figure>
               <div className="image"></div>
               <figcaption className="flex" style={{ height: "56px" }}></figcaption>
            </figure>
         </div>
      );
   } else {
      return (
         <div className={`meal ${meal.isRandom ? "random" : ""}`}>
            <figure>
               <img className="image" src={meal.strMealThumb} alt="meal" onClick={() => makeMealActive(meal)} />
               <figcaption className="flex">
                  <div className="title">{meal.strMeal}</div>
                  {meal.isFavorite ? (
                     <button aria-label="add to favorite" className="favorite" onClick={() => removeMealFromFavorites(meal.idMeal)}>
                        <Heart />
                     </button>
                  ) : (
                     <button aria-label="add to favorite" className="normal" onClick={() => addMealToFavorites(meal)}>
                        <Heart />
                     </button>
                  )}
               </figcaption>
            </figure>
         </div>
      );
   }
}
