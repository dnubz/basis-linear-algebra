# Basis — Linear algebra, made clear

An interactive educational website explaining Gauss–Jordan elimination, eigenvalues, and eigenvectors.

**Live website:** https://dnubz.github.io/basis-linear-algebra/

## What's included

- Complete lessons on row operations, RREF, consistency, rank, free variables, and inverses.
- An exact-fraction row-reduction calculator for 2–4 equations and unknowns.
- Eigenvalue and eigenvector lessons, including complex and repeated eigenvalues, eigenspaces, and diagonalization.
- An interactive 2 × 2 transformation explorer.
- Six practice problems with worked solutions.
- A printable formula sheet and browser-local chapter progress.

## Run locally

Serve the `docs` directory with any static web server. For example, with Python installed:

```sh
python -m http.server 8765 --directory docs
```

Then open http://localhost:8765.

## Validate the algebra and formulas

With Node.js installed:

```sh
npm ci
node verify.cjs
```

## Deploy

GitHub Pages publishes the `docs` folder from the `main` branch. Push changes to that folder to update the live site. The website requires no build step or backend. Its assets use relative URLs for GitHub Pages project hosting.

KaTeX and its fonts are included under `docs/vendor`, with their license. Google Fonts are requested for the interface, with system-font fallbacks.
