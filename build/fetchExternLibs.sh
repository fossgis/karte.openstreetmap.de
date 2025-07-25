#!/usr/bin/env bash
set -e

mkdir -p ../public/tests/lib
mkdir -p ../public/tests/lib/extern

mkdir -p ../public/tests/lib/extern/mocha
mkdir -p ../public/tests/lib/extern/@testing-library

curl -L https://unpkg.com/mocha@9.2.2/mocha.css -o ../public/tests/lib/extern/mocha/mocha.css
curl -L https://unpkg.com/chai@4.3.6/chai.js -o ../public/tests/lib/extern/mocha/chai.js
curl -L https://unpkg.com/mocha@9.2.2/mocha.js -o ../public/tests/lib/extern/mocha/mocha.js
curl -L https://unpkg.com/@testing-library/dom@8.17.1/dist/@testing-library/dom.umd.js -o ../public/tests/lib/extern/@testing-library/dom.umd.js

echo "All files downloaded and placed in the ../public/tests/lib/extern directory."
