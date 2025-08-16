#!/usr/bin/env bash
set -e

mkdir -p ./tests/lib/external/mocha
mkdir -p ./tests/lib/external/@testing-library

curl -L https://unpkg.com/mocha@9.2.2/mocha.css -o ./tests/lib/external/mocha/mocha.css
curl -L https://unpkg.com/chai@4.3.6/chai.js -o ./tests/lib/external/mocha/chai.js
curl -L https://unpkg.com/mocha@9.2.2/mocha.js -o ./tests/lib/external/mocha/mocha.js
curl -L https://unpkg.com/@testing-library/dom@8.17.1/dist/@testing-library/dom.umd.js -o ./tests/lib/external/@testing-library/dom.umd.js

echo "All files downloaded and placed in the ../tests/lib/external directory."
