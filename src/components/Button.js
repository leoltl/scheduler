import React from "react";
import classnames from "classnames";

import "components/Button.scss";

export default function Button({confirm, danger, disabled, onClick, children}) {
   const buttonClass = classnames('button', {
      'button--confirm': confirm, 
      'button--danger': danger
   })
   return (
      <button 
         className={buttonClass}
         disabled={disabled} 
         onClick={onClick}>
      {children}
      </button>
   );
}
