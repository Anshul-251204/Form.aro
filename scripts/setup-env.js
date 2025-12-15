const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const content = 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/formhost?schema=public"\n';

fs.writeFileSync(envPath, content);
console.log('.env file created successfully');
