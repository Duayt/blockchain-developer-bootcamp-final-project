# Contract security measures

## SWC-104 (Unchecked Call Return Value)

The return value from a call to the owner's address in `addAsTenant` is checked with `require` to ensure transaction rollback if call fails.

## Modifiers used only for validation

All modifiers in contract(s) only validate data with `require` statements.

## Pull over push

All functions that modify state are based on receiving calls rather than making contract calls.