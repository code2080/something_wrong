import { useState } from 'react';
import { Col, Modal, Row, Select, Slider, Space, Typography } from 'antd';
import { useSelector } from 'react-redux';

// HOOKS
import useSSP from 'Components/SSP/Utils/hooks';
import { useScheduling } from 'Hooks/useScheduling';

// REDUX
import { constraintProfilesSelector } from 'Redux/ConstraintProfiles';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const StartJobModal = ({ visible, onClose }: Props) => {
  const { getSelectedActivityIds, selectedKeys, setSelectedKeys } = useSSP();
  const { scheduleSelectedActivities } = useScheduling();

  /**
   * SELECTORS
   */
  const constraintProfiles = useSelector(constraintProfilesSelector);

  /**
   * STATE
   */
  const [scheduleQuality, setScheduleQuality] = useState(4);
  const [selectedConstraintProfileId, setSelectedConstraintProfileId] =
    useState<string | undefined>(undefined);

  const onScheduleActivities = () => {
    if (!selectedKeys.length || !selectedConstraintProfileId) return;
    scheduleSelectedActivities(
      selectedKeys,
      selectedConstraintProfileId,
      scheduleQuality,
    );
    setSelectedKeys([]);
    onClose();
  };

  return (
    <Modal
      title='Schedule'
      visible={visible}
      onCancel={onClose}
      closable={false}
      okText='Schedule'
      onOk={onScheduleActivities}
      okButtonProps={{
        disabled: !selectedKeys.length || !selectedConstraintProfileId,
      }}
    >
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        <Space direction='vertical'>
          <Typography.Text strong>Scheduling info</Typography.Text>
          <Typography.Text>
            {`Number of activities in selection: ${
              getSelectedActivityIds().length
            }`}
          </Typography.Text>
        </Space>

        <Space direction='vertical' style={{ width: '100%' }}>
          <Typography.Text strong>Constraint profile</Typography.Text>
          <Select
            options={constraintProfiles.map((el) => ({
              value: el._id,
              label: el.name,
            }))}
            value={selectedConstraintProfileId}
            onSelect={(val) => setSelectedConstraintProfileId(val)}
            style={{ width: '100%' }}
            placeholder='Select a constraint profile'
          />
        </Space>

        <Space direction='vertical' style={{ width: '100%' }}>
          <Typography.Text strong>Performance vs quality</Typography.Text>
          <Row gutter={16} align='middle'>
            <Col>
              <Typography.Text>Fast</Typography.Text>
            </Col>
            <Col flex='auto'>
              <Slider
                min={1}
                max={10}
                step={1}
                value={scheduleQuality}
                onChange={setScheduleQuality}
              />
            </Col>
            <Col>
              <Typography.Text>Optimized</Typography.Text>
            </Col>
          </Row>
        </Space>
      </Space>
    </Modal>
  );
};

export default StartJobModal;
