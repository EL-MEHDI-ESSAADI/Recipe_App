import FavoriteBox from "./FavoriteBox";
import React from "react";
function Favorites(props) {
   const favoriteElements = props.favoriteMeals.map(meal => <FavoriteBox key={meal.idMeal} meal={meal} removeMealFromFavorites={props.removeMealFromFavorites} makeMealActive={props.makeMealActive}/>)

   return (
      <div className="fovriteMeals">
         <header>Favorite Meals</header>
         <ul className="FavoriteMeilsContainer flex">
            {favoriteElements}
         </ul>
      </div>
   );
}

export default React.memo(Favorites, (prevProps, newProps) => prevProps.favoriteMeals === newProps.favoriteMeals)