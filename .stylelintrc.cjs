module.exports = {
  extends: ['stylelint-config-standard'],
  customSyntax: 'postcss-scss',
  rules: {
    'block-no-empty': true,
    'color-no-invalid-hex': true,
    'selector-class-pattern': null,
    'custom-property-pattern': null,
    'declaration-block-no-duplicate-properties': true,
    'font-family-no-duplicate-names': true,
    'no-descending-specificity': null,
  },
};
