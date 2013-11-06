
# SAMI Cubes

Volume renderings of two SAME galaxies.

## Getting Started

  * Drop two FITS cubes from your local filesystem into the interface.
  * The FITS files are parsed using `fitsjs`. Unfortunately it does not support `BITPIX=-64` right now.
  * The cube might need processing if `BITPIX=64`. Use `process.py` to map the cube to single-precision floats.

    python process.py [some-directory-with-fits-cubes]


## Development

  * Download and install NodeJS if you don't have it.
  * Run `npm install` to install development dependencies
  * Run `npm start` to start a local server
  * Visit the URL that's printed in the console (usually localhost:8080)

