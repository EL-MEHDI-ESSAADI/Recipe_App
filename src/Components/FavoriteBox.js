import { ReactComponent as RemoveSvg } from "../assets/removeFav.svg";

export default function FavoriteBox({meal, removeMealFromFavorites, makeMealActive}) {
   return (
      <li>
         <figure>
            <img src={meal.strMealThumb} alt="favorite meal" onClick={() => makeMealActive(meal)} />
            <figcaption>{meal.strMeal}</figcaption>
         </figure>
         <button aria-label="remove from favorite">
            <RemoveSvg onClick={() => removeMealFromFavorites(meal.idMeal)} />
         </button>
      </li>
   );
}
