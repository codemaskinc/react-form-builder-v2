
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./react-form-builder-v2.cjs.production.min.js')
} else {
  module.exports = require('./react-form-builder-v2.cjs.development.js')
}
