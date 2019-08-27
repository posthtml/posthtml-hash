const fs = require('fs-extra');

function clean() {
  fs.removeSync('processed');
  fs.copySync('original', 'processed');
}

clean();
