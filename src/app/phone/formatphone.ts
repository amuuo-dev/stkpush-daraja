export function formatPhoneNumber(phone: string) {
  //remove spaces
  let formatted = phone.replace(/\s+/g, "");
  if (formatted.startsWith("0")) {
    formatted = "254" + formatted.substring(1);
  } else if (formatted.startsWith("+254")) {
    formatted = formatted.substring(1);
  }
  return formatted;
}
