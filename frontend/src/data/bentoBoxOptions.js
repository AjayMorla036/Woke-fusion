// Options for the Custom Bento Box configurator.
//
// PLACEHOLDER PRICING: the menu only gives a single starting price
// ("From £8.95") with no per-size breakdown anywhere in the source data.
// The Value size below uses that real £8.95; Regular/Large are inferred
// £2 steps and need confirming with the restaurant before this goes live.
// Base/Protein/Sauce carry no price delta - swap in real premiums (e.g.
// prawns) if the business charges for them.
export const BENTO_SIZES = [
  { key: "value", label: "Value", price: 8.95 },
  { key: "regular", label: "Regular", price: 10.95 },
  { key: "large", label: "Large", price: 12.95 },
];

export const BENTO_BASES = [
  "Egg Fried Rice",
  "Veg Fried Rice",
  "Hakka Noodles",
  "Plain Rice",
  "Spicy Chips",
];

export const BENTO_PROTEINS = ["Chicken", "Beef", "Prawns", "Paneer", "Soya"];

export const BENTO_SAUCES = [
  { key: "chinese", label: "Chinese Style" },
  { key: "indian", label: "Indian Style" },
];

// The menu lists "Dry Item" as a 4th choice with no options given anywhere.
// Using the two Spring Roll varieties already sold under Sides (see
// menuCategories category 6 in App.jsx) rather than inventing a new item.
export const BENTO_DRY_ITEMS = ["Veg Spring Rolls", "Chicken Spring Rolls"];
