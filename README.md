# karte.openstreetmap.de

This repository contains the map from [https://openstreetmap.de](https://openstreetmap.de) (work in progress).

## Setup

Run via:

```shell
python3 -m http.server 8000 --directory public
```

Open your browser on [http://0.0.0.0:8000/](http://0.0.0.0:8000/) to see the website.

## Code Quality

For checking code quality in JavaScript and CSS files we use [Biome](https://biomejs.dev/). It can be installed as binary on all operating systems.

How to run:

```shell
# simple check of files
biome check

# automatically fix files
biome check --fix
```

## Libraries

External libraries shall be downloaded to `public/lib/external/<add-official-name-of-library>` and added to the git repo. Documentation of the external libraries we use can be found in the `fetchExternalLibs.sh` file located in the `/scripts` directory. This file also allows for quick restore or updating of the external libraries.

```shell
./scripts/fetchExternalLibs.sh
```

JavaScript/CSS files are included directly in `index.js` and `index.css`.

## Tests

External libraries for testing are downloaded into `tests/lib/external/<official-library-name>`.
These files are not tracked by git (see `.gitignore`).

The script `tests/scripts/fetchExternalLibs.sh` documents which libraries are used and can be used to download or update them:

```sh
./tests/scripts/fetchExternalLibs.sh
```

To start the local test setup, run the Python script:

```sh
python3 ./tests/scripts/startTests.sh
```

This will launch a server on `http://127.0.0.1:8000`.

* Open `http://127.0.0.1:8000/` → main app
* Open `http://127.0.0.1:8000/tests/` → test runner output

For examples of how to add new tests, see:

* `tests/map-libre.test.js`
* `tests/index.html`
