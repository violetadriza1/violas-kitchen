// Basic server-side input cleanup.
// EJS's <%= %> already HTML-escapes everything on output, which is the main
// XSS defense. This trims input and caps length as a second line of defense
// and to keep the database tidy.

function cleanText(value, maxLength = 5000) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

module.exports = { cleanText };
