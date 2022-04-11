const OperatorRenderer = (value: string) => {
  switch (value) {
    case '>':
      return 'Greater than';
    case '>=':
      return 'Greater or equal';
    case '<':
    case '&lt;':
      return 'Less than';
    case '<=':
    case '&lt;=':
      return 'Less or equal';
    case '=':
      return 'Equal';
    default:
      return value;
  }
};

export default OperatorRenderer;
