import { useSelector } from 'react-redux';
import { selectLabelByTypeAndExtId } from 'Redux/TE/te.selectors';

const ObjectLabel = ({ type, extId }: { type: string; extId?: string }) => {
  const label = useSelector(selectLabelByTypeAndExtId({ type, extId }));
  return <span>{label}</span>;
};

export default ObjectLabel;
