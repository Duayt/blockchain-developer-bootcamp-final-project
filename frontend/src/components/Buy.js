import React from "react";

export function Buy({ buy }) {
  return (
    <div>
      <h3>Buy</h3>
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target);
          const amount = formData.get("amount");

          if (amount ) {
            buy(amount);
          }
        }}
      >
        <div className="form-group">
          <label>Amount of Eth to buy</label>
          <input
            className="form-control"
            type="number"
            step="any"
            name="amount"
            placeholder="1"
            required
          />
        </div>
        
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Buy token" />
        </div>
      </form>
    </div>
  );
}
