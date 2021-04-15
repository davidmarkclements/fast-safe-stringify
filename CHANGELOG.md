# Changelog

## v.2.1.0

Features

- Added optional parameter options - depthLimit and edgesLimit
- Added default options.depthLimit 10
- Added default options.edgesLimit 20

## v.2.0.0

Features

- Added stable-stringify (see documentation)
- Support replacer
- Support spacer
- toJSON support without forceDecirc property
- Improved performance

Breaking changes

- Manipulating the input value in a `toJSON` function is not possible anymore in
  all cases (see documentation)
- Dropped support for e.g. IE8 and Node.js < 4
