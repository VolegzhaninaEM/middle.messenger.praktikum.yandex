export default {
  "plugins": ["stylelint-less"],
  ignoreFiles: ['dist/*'],
  rules: {
    'selector-class-pattern': null,
    "at-rule-no-unknown": null,
    "color-no-invalid-hex": true,
    "less/color-no-invalid-hex": true
  }
}
