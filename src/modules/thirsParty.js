/* eslint-disable no-template-curly-in-string */

export const RANDOM_MEAL_API = "https://www.themealdb.com/api/json/v1/1/random.php"
export const SEARCH_MEAL_API = "https://www.themealdb.com/api/json/v1/1/search.php?s=searchStr"


export function handelData(url, successGetData) {
   fetchData(url).then(successGetData).catch(err => {
      console.error(err);
      if(err instanceof RangeError) window.alert(err.message);
   })
}

// fetch data
async function fetchData(url) {
   const response = await fetch(url);
   // throw a range error because respinse.og is out of the range 200-299
   if(!response.ok) throw new RangeError(`${response.status} request error`);
   return await response.json();
}