export default [
  {
    input: 'src/background.js',
    output: {
      file: 'dist/background.js',
      format: 'es'
    }
  },
  {
    input: 'src/content.js',
    output: {
      file: 'dist/content.js',
      format: 'es'
    }
  },
  {
    input: 'src/popup.js',
    output: {
      file: 'dist/popup.js',
      format: 'es'
    }
  }
]
