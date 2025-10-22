export function maskPhone(phone){
  // keep visible start and last 3 digits; mask rest
  const digits = phone.replace(/\D/g,'');
  if (digits.length <= 6) return phone.replace(/\d(?=\d{3})/g, '*');
  const last = digits.slice(-3);
  const prefix = phone.slice(0,4);
  return `${prefix}${'*'.repeat(6)}${last}`;
}
