# te-prefs-lib

> TE Prefs Library

[![NPM](https://img.shields.io/npm/v/te-prefs-lib.svg)](https://www.npmjs.com/package/te-prefs-lib) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Build to GCP storage bucket

3 branches trigger different environment builds
production -> triggers production build
test -> triggers test (staging) build
beta -> triggers beta build

Running:
```bash
git add .
git commit -m "commit message"
git push origin remoteBranch
```
will initiate a CircleCI job, and push the new artifacts to the GCP storage bucket.

After the build has finished, the minified builds will be available at:

```bash
https://storage.googleapis.com/te-prefs-lib/te-prefs-lib@${environment}.js / css
```

# Build to NPM
Run
```bash
yarn build
npm publish
```
to build and upload to the private TimeEdit NPM repository

# Use from CDN
Use script and link tags to include the files in the project
```bash
Javascript file: https://storage.googleapis.com/te-prefs-lib/te-prefs-lib@${environment}.js (or .es.js)
CSS file: https://storage.googleapis.com/te-prefs-lib/te-prefs-lib@${environment}.css
```

# Use as NPM library

## Install

```bash
npm install --save te-prefs-lib
```

## Usage

```jsx
import React, { Component } from 'react'

import MyComponent from 'te-prefs-lib'

class Example extends Component {
  render () {
    return (
      <MyComponent />
    )
  }
}
```

## License

ICT © [TimeEdit](https://github.com/TimeEdit)
