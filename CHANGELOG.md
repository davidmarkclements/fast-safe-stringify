# Changelog

## v.2.1.0

This release only changed the deterministic ("stable") stringify version

Features

- Improved performance in most cases
- Manipulation of the input value is from now on possible

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
