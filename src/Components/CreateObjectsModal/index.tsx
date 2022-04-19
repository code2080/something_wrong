import { useMemo, useState } from 'react';
import { Modal, Radio, Space, Typography } from 'antd';

// REDUX
import useSSP from 'Components/SSP/Utils/hooks';

// HOOKS
import { useGroupManagement } from 'Hooks/useGroupManagement';

// COMPONENTS
import SummaryTable from './Components/SummaryTable';

// TYPES
import { ECreateObjectsMode } from 'Types/GroupManagement.type';
type Props = {
  visible: boolean;
  onClose: () => void;
};

const CreateObjectsModal = ({ visible, onClose }: Props) => {
  const { selectedKeys, metadata } = useSSP();
  const { requestCreateObjects, createRequestSummary } = useGroupManagement();

  /**
   * STATE
   */
  const [mode, setMode] = useState<ECreateObjectsMode>(
    ECreateObjectsMode.USE_TRACKS,
  );
  /**
   * MEMOIZED PROPS
   */
  const requestSummary = useMemo(
    () => createRequestSummary(metadata.groupTypeExtId, mode, selectedKeys),
    [metadata.groupTypeExtId, selectedKeys, mode, createRequestSummary],
  );

  /**
   * EVENT HANDLERS
   */
  const onCreateObjects = () => {
    if (!requestSummary) return;
    requestCreateObjects(requestSummary);
    onClose();
  };

  return (
    <Modal
      title='Create new objects'
      visible={visible}
      onCancel={onClose}
      closable={false}
      okText='Start creating objects'
      onOk={onCreateObjects}
      okButtonProps={{ size: 'small' }}
      cancelButtonProps={{ size: 'small' }}
    >
      <Space direction='vertical' size='middle' style={{ width: '100%' }}>
        <Space direction='vertical' size='small' style={{ width: '100%' }}>
          <Typography.Text style={{ fontSize: '0.75rem' }}>
            How many objects are needed:
          </Typography.Text>
          <Radio.Group
            onChange={(e) => setMode(e.target.value)}
            value={mode}
            style={{ fontSize: '0.75rem' }}
          >
            <Radio
              value={ECreateObjectsMode.SINGLE_GROUP}
              style={{ fontSize: '0.75rem' }}
            >
              One group
            </Radio>
            <Radio
              value={ECreateObjectsMode.USE_TRACKS}
              style={{ fontSize: '0.75rem' }}
            >
              Maximum number of needed tracks
            </Radio>
          </Radio.Group>
        </Space>
        <Space direction='vertical' size='small' style={{ width: '100%' }}>
          <Typography.Text style={{ fontSize: '0.75rem' }}>
            Summary:
          </Typography.Text>
          <SummaryTable requestSummary={requestSummary} mode={mode} />
        </Space>
      </Space>
    </Modal>
  );
};

export default CreateObjectsModal;
