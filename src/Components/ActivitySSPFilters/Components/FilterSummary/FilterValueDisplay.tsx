import { capitalize, startCase } from 'lodash';

// TYPES
import { ReactNode } from 'react';

type Props = {
  label: string | ReactNode;
  content: string | ReactNode;
};

const ValueDisplay = ({ label, content }: Props) => (
  <div className='filter-modal__value-display'>
    <b>{typeof label === 'string' ? capitalize(startCase(label)) : label}:</b>
    <div>{content}</div>
  </div>
);

export default ValueDisplay;
