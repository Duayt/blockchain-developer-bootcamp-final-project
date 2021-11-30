import React from "react";

export function SuccessTransactionMessage({ message, dismiss }) {
  return (
    <div className="alert alert-success" role="alert">
      Last success transaction: {message.substring(0, 100)}
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
        onClick={dismiss}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}
