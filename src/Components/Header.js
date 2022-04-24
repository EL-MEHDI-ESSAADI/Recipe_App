import { useState } from "react";

export default function Header(props) {
   const [formData, setFormData] = useState(() => ({search: ""}));

   function hendelInputChange(e) {
      const {name, value} = e.target;
      setFormData(old => ({...old, [name]: value}))
   }

   function hendelSubmit() {
      if(!formData.search) return;
      props.searchForMeals(formData.search)
      setFormData(old => ({...old, search :""}))
   }

   function hendelKeyDown(e) {
      if(e.key === "Enter") hendelSubmit()
   }

   return (
      <header className="pageHeader flex">
         <input className="searchInput" type="text" placeholder="search" name="search" onKeyDown={hendelKeyDown} value={formData.search} onChange={hendelInputChange}/>
         <button aria-label="search" className="searchBtn" onClick={hendelSubmit}>
            <img src={require("../assets/search.svg").default} alt="search" />
         </button>
      </header>
   );
}
