const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

imagemin(['img/*'], {
  destination: 'compressed_images',
  plugins: [imageminWebp({quality: 100})]
}).then(() => {
  console.log('Done!');
});