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

Including many JavaScript and CSS files with `<script>` and `<link>` tags can make `index.html` messy. Instead, we use `@import` in `index.css` and `import` in `index.js`, so that only these two files need to be included in the HTML.

### External libraries

External libraries shall be downloaded to `public/lib/<add-official-name-of-library>` and added to the git repo.
