import { memo } from 'react';
import { useSelector } from 'react-redux';

// SELECTORS
import { Field, selectExtIdLabel } from '../../../Redux/TE/te.selectors';

// TYPES
type Props = {
  field: Field;
  extId: string;
};

const TitleCell = ({ field, extId }: Props) => {
  const label: string = useSelector(selectExtIdLabel)(field, extId) as string;
  return <>{label}</>;
};

export default memo(TitleCell);
