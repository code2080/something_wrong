import React, { useState } from 'react';
import { Col, Modal, Row, Select, Slider, Space, Typography } from 'antd';
import useSSP from 'Components/SSP/Utils/hooks';
import { useSelector } from 'react-redux';
import {
  makeSelectConstraintConfigurationsForForm,
  selectSelectedConstraintConfiguration,
} from 'Redux/ConstraintConfigurations/constraintConfigurations.selectors';
import { useParams } from 'react-router-dom';
import { IState } from 'Types/State.type';
import { TConstraintConfiguration } from 'Types/DEPR_ConstraintConfiguration.type';
import { useAppDispatch } from 'Hooks/useAppHooks';
import { selectConstraintConfiguration } from 'Redux/ConstraintConfigurations/constraintConfigurations.actions';
import { useScheduling } from 'Hooks/useScheduling';

type Props = {
  visible: boolean;
  onClose: () => void;
};


const StartJobModal = ({ visible, onClose }: Props) => {
  const { formId } = useParams<{ formId: string }>();
  const dispatch = useAppDispatch();

  const { getSelectedActivityIds, selectedKeys, setSelectedKeys } = useSSP();
  const { scheduleSelectedActivities } = useScheduling();

  /**
   * SELECTORS
   */
  const selectedConstraitConfiguration = useSelector((state) =>
    selectSelectedConstraintConfiguration(state, formId as string),
  );
  const constrConfs = useSelector((state: IState) =>
    makeSelectConstraintConfigurationsForForm()(state, formId as string),
  );

  const [scheduleQuality, setScheduleQuality] = useState(4);

  const constrConfsValues: TConstraintConfiguration[] =
    Object.values(constrConfs);

  const selectConstraintConfigurationOptions = constrConfsValues.map(
    (constraint) => ({
      label: constraint.name,
      value: constraint._id as string,
    }),
  );

  const onSelectConstraintConfiguration = (configId: string) => {
    dispatch(selectConstraintConfiguration(formId, configId));
  };

  const onScheduleActivities = () => {
    scheduleSelectedActivities(selectedKeys, selectedConstraitConfiguration!._id, scheduleQuality);
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
        disabled: !selectedKeys.length || !selectedConstraitConfiguration,
      }}
    >
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        <Space direction='vertical'>
          <Typography.Text strong>Scheduling info</Typography.Text>
          <Typography.Text>
            {`Number of activities in selection: ${getSelectedActivityIds().length}`}
          </Typography.Text>
        </Space>

        <Space direction="vertical" style={{ width: '100%' }}>
          <Typography.Text strong>Constraint profile</Typography.Text>
          <Select
            options={selectConstraintConfigurationOptions}
            value={selectedConstraitConfiguration?._id}
            onSelect={onSelectConstraintConfiguration}
            style={{ width: '100%' }}
          />
        </Space>

        <Space direction="vertical" style={{ width: '100%' }}>
        <Typography.Text strong>
          Performance vs quality
        </Typography.Text>
        <Row gutter={16} align="middle">
          <Col>
            <Typography.Text>Fast</Typography.Text>
          </Col>
          <Col flex='auto'>
            <Slider
              min={1}
              max={10}
              step={1}
              value={scheduleQuality}
              onChange={(newValue) => setScheduleQuality(newValue)}
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
