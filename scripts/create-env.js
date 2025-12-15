const fs = require('fs');
const path = require('path');

const envContent = `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/formhost?schema=public"`;
const envPath = path.join(__dirname, '..', '.env');

fs.writeFileSync(envPath, envContent);
console.log('.env file created successfully');
