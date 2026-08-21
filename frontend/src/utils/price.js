// Menu prices are display strings like "£10.95" or "From £8.95" (the
// Bento Box is a build-your-own item with no configurator yet, so its
// price is a starting point, not an exact total).
//
// parsePrice() pulls out the numeric GBP value for cart math. For a
// "From £X" item this is the starting price, not a guaranteed final
// price - the cart and WhatsApp order message both keep the original
// "From £X" label so nothing is presented as more precise than it is.

export function parsePrice(priceLabel) {
  const match = priceLabel.match(/£(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

export function formatGBP(amount) {
  return `£${amount.toFixed(2)}`;
}
