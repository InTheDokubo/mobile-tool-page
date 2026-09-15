# Parity status — 2026-09-15

This project is an incomplete independent implementation, NOT a complete God Field reproduction.
Original textures/audio/source code have not been imported.

## Observed on the live reference

- Initial HP 40, MP 10, money 20; nine starting cards.
- A selected hand card remains in the hand, with its details in the combat column.
- Unusable cards remain inspectable.
- Attack and defense details occupy separate columns.
- The in-game attribute guide says light can substitute for fire/water/wood/earth; other mixed attributes become neutral.
- The in-game exchange guide states HP1 = MP1 = money1.

## Regression tests

Run `node tests/game.test.cjs`.
Tests cover starting values, attribute composition, inspection, target selection,
rainbow defense selection/removal, conserved exchange totals, stale timers and
preventing the previous erroneous sale/steal behavior.
These are implementation regression tests, not proof of full reference parity.

## Remaining gaps

- Card catalog, numeric values, prices and draw weights are incomplete and include invented entries.
- Sale is explicitly unavailable; purchase/discard/offering flows are missing.
- Reflection chains, miracles, status effects, guardians, end-times events and multiplayer are incomplete or missing.
- Timing has not been measured frame by frame; animation parity is NOT verified.
- Mobile native-app layout has NOT been tested against the app.
- Desktop visual layout is closer, but not pixel-identical.
- Exchange inputs conserve totals, but their screen flow has not been matched to the original.
- Duplicate legacy functions and CSS remain in index.html and should be consolidated with tests.

## Deployment

GitHub Pages deploys main using `.github/workflows/pages.yml`.
Do not describe a successful deployment as feature completion.
