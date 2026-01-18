const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'configs', 'Images', 'logo.png');
const destDir = path.join(__dirname, 'public', 'configs', 'Images');
const dest = path.join(destDir, 'logo.png');

try {
  // Check if source exists
  if (!fs.existsSync(source)) {
    console.warn('⚠️  Logo source not found at:', source);
    console.warn('   Skipping logo copy. Make sure configs/Images/logo.png exists.');
    // Don't exit with error - allow build to continue
    process.exit(0);
  }

  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  // Copy the logo
  fs.copyFileSync(source, dest);
  console.log('✅ Logo copied successfully to public/configs/Images/logo.png');
} catch (error) {
  console.error('❌ Error copying logo:', error.message);
  // Don't exit with error - allow build to continue even if logo copy fails
  console.warn('   Build will continue without logo.');
}
