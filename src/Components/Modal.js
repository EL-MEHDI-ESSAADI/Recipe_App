import React from "react";
import ReactDOM from "react-dom";
import { ReactComponent as CloseSvg } from "../assets/close.svg";

export default function Modal(props) {
   return ReactDOM.createPortal(
      <div className="modal">
         <div className="modal__overlay" onClick={props.closeModal}/>
         <div className="modal__content">
            {props.children}
            <button className="modal__close-btn" onClick={props.closeModal}>
               <CloseSvg />
            </button>
         </div>
      </div>,
      document.getElementById("modal-container")
   );
}
