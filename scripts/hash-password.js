// Generates a bcrypt hash for your admin password.
// Usage: node scripts/hash-password.js "your-password-here"
const bcrypt = require('bcrypt');

const plainPassword = process.argv[2];

if (!plainPassword) {
  console.error('Usage: node scripts/hash-password.js "your-password-here"');
  process.exit(1);
}

bcrypt.hash(plainPassword, 10).then((hash) => {
  console.log('\nAdd this to your .env file as ADMIN_PASSWORD_HASH:\n');
  console.log(hash);
  console.log('');
});
