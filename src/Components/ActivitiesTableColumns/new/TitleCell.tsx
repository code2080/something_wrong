import React from 'react';
import { useSelector } from 'react-redux';

// SELECTORS
import { selectExtIdLabel } from '../../../Redux/TE/te.selectors';

// TYPES
type Props = {
  field: string,
  extId: string,
};

const TitleCell = ({ field, extId }: Props) => {
  const label: string = useSelector(selectExtIdLabel)(field, extId) as string;
  return <React.Fragment>{label}</React.Fragment>;
};

export default React.memo(TitleCell);
