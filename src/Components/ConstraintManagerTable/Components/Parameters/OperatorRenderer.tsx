const OperatorRenderer = (value: string) => {
  switch (value) {
    case '>':
      return 'Greater than';
    case '>=':
      return 'Greater or equals to';
    case '<':
    case '&lt;':
      return 'Less than';
    case '=<':
    case '=&lt;':
      return 'Equals or less then';
    case '=':
      return 'Equals to';
    default:
      return value;
  }
};

export default OperatorRenderer;
