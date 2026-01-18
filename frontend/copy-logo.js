const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'configs', 'Images', 'logo.png');
const destDir = path.join(__dirname, 'public', 'configs', 'Images');
const dest = path.join(destDir, 'logo.png');

try {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  // Copy the logo
  fs.copyFileSync(source, dest);
  console.log('✅ Logo copied successfully to public/configs/Images/logo.png');
} catch (error) {
  console.error('❌ Error copying logo:', error.message);
  process.exit(1);
}
