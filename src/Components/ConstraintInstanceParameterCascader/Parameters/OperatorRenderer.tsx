const OperatorRenderer = (value: string) => {
  switch (value) {
    case '>':
      return '>';
    case '>=':
      return '>=';
    case '<':
    case '&lt;':
      return '<';
    case '<=':
    case '&lt;=':
      return '<=';
    case '=':
      return '=';
    default:
      return value;
  }
};

export default OperatorRenderer;
