import React from "react";

export function Withdraw({ withdraw, buttonMessage, disabled }) {
  return (
    <div>
      <h3>{buttonMessage}</h3>
      <button onClick={withdraw} disabled={disabled || false}>
        {disabled ? "Locked" : "Submit"}
      </button>
    </div>
  );
}
