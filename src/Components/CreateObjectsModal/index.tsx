import { useMemo, useState } from 'react';
import { Modal, Select, Space, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// REDUX
import { selectLabelsForTypes } from 'Redux/TE/te.selectors';
import { selectMappedTypesForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';
import useSSP from 'Components/SSP/Utils/hooks';
import { useGroupManagement } from 'Hooks/useGroupManagement';
import SummaryTable from './Components/SummaryTable';

// TYPES
type Props = {
  visible: boolean;
  onClose: () => void;
};

const CreateObjectsModal = ({ visible, onClose }: Props) => {
  const { formId } = useParams<{ formId: string }>();

  const { selectedKeys } = useSSP();
  const { requestCreateObjects, createRequestSummary } = useGroupManagement();

  /**
   * SELECTORS
   */
  const mappedObjects = useSelector(selectMappedTypesForForm(formId));
  const objectLabels = useSelector(selectLabelsForTypes(mappedObjects));

  /**
   * STATE
   */
  const [objectType, setObjectType] = useState<string | undefined>(undefined);

  /**
   * MEMOIZED PROPS
   */
  const requestSummary = useMemo(() => createRequestSummary(objectType, 'DELKLASS', selectedKeys), [objectType, selectedKeys, createRequestSummary]);
  
  /**
   * EVENT HANDLERS
   */
  const onCreateObjects = () => {
    /**
     * NOT SSP COMPATIBLE
     */
    if (!objectType) return;
    requestCreateObjects(requestSummary);
  };

  return (
    <Modal
      title='Create new objects'
      visible={visible}
      onCancel={onClose}
      closable={false}
      okText='Start creating objects'
      onOk={onCreateObjects}
      okButtonProps={{ disabled: false }}
    >
      <Space direction='vertical' size="middle" style={{ width: '100%' }}>
        <Space direction='vertical' size="small" style={{ width: '100%' }}>
          <Typography.Text>Select type to create objects of:</Typography.Text>
          <Select
            options={mappedObjects.map((value, idx) => ({ value, label: objectLabels[idx] }))}
            value={objectType}
            onSelect={(val) => setObjectType(val)}
            style={{ width: '100%' }}
            placeholder="Select an object type"
          />
        </Space>
        <SummaryTable requestSummary={requestSummary} mode={'HELKLASS'} />
      </Space>
    </Modal>
  );
};

export default CreateObjectsModal;
