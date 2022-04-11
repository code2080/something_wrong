import { useSelector } from 'react-redux';

// REDUX
import { selectLabelForType, selectLabelForObject } from 'Redux/TE/te.selectors';

// TYPES
type Props = {
  extId?: string;
  missingExtIdReturnVal?: string;
  wrapperEl?: 'span' | 'div' | 'none';
};

export const TypeLabel = ({ extId, missingExtIdReturnVal = 'N/A', wrapperEl = 'span', ...rest }: Props) => {
  const label = useSelector(selectLabelForType(extId, missingExtIdReturnVal));
  if (wrapperEl === 'none') return <>{label}</>;
  if (wrapperEl === 'span') return <span {...rest}>{label}</span>;
  return <div {...rest}>{label}</div>;
};

export const ObjectLabel = ({ extId, missingExtIdReturnVal = 'N/A', wrapperEl = 'span', ...rest }: Props) => {
  const label = useSelector(selectLabelForObject(extId, missingExtIdReturnVal));
  if (wrapperEl === 'none') return <>{label}</>;
  if (wrapperEl === 'span') return <span {...rest}>{label}</span>;
  return <div {...rest}>{label}</div>;
};
