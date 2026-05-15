# karte.openstreetmap.de

This repository contains the webmap that is deployed on  [https://karte.openstreetmap.de](https://karte.openstreetmap.de)

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

External libraries are located at `public/lib/external/<add-official-name-of-library>` and checked in to the git repo. The libraries can be downloaded with this script:

```shell
./scripts/fetchExternalLibs.sh
```
