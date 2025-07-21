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

## External libraries

External libraries shall be downloaded to `public/lib/<add-official-name-of-library>` and added to the git repo.

