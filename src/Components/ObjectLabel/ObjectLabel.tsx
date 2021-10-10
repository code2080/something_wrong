import { useSelector } from 'react-redux';
import { selectLabels } from 'Redux/TE/te.selectors';

interface Props {
  objects: Array<{ type: string; extId?: string }>;
}
const ObjectLabel = ({ objects }: Props) => {
  const labels = useSelector(selectLabels(objects));
  return <span>{labels.join(', ')}</span>;
};

export default ObjectLabel;
