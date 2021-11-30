import React from "react";

export function Deposit({ deposit }) {
  return (
    <div>
      <h3>Deposit</h3>
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target);
          const amount = formData.get("amount");
          const locktime = formData.get("locktime");

          if (amount && locktime) {
            deposit(amount, locktime);
          }
        }}
      >
        <div className="form-group">
          <label>Amount of Eth to deposit</label>
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
          <label>Time lock in seconds</label>
          <input
            className="form-control"
            type="number"
            step="1"
            name="locktime"
            placeholder="1"
            required
          />
        </div>
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Deposit" />
        </div>
      </form>
    </div>
  );
}
