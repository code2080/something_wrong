import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useFetchLabelsFromExtIds } from '../Hooks/TECoreApiHooks';
import { GetExtIdPropsPayload } from '../Types/TECorePayloads.type';

type Props = {
  type: string | null;
  extId: string | null;
};

const LabelRenderer = ({ type, extId }: Props): JSX.Element => {
  const payload = useMemo(
    () => ({ [type ?? '']: [extId] } as GetExtIdPropsPayload),
    [type, extId],
  );
  useFetchLabelsFromExtIds(payload);
  const label = useSelector(
    (state: any) => state.te.extIdProps[type || ''][extId || ''],
  );
  if (!extId || !type) return <>N/A</>;

  return <>{label?.label || extId}</>;
};

export default LabelRenderer;
