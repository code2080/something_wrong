import React from 'react';
import {
  Col,
  Modal,
  ModalProps,
  Row,
  Select,
  Slider,
  Space,
  Typography,
} from 'antd';
import useSSP from 'Components/SSP/Utils/hooks';
import { useSelector } from 'react-redux';
import { InfoCircleTwoTone } from '@ant-design/icons';
import {
  makeSelectConstraintConfigurationsForForm,
  selectSelectedConstraintConfiguration,
} from 'Redux/ConstraintConfigurations/constraintConfigurations.selectors';
import { useParams } from 'react-router-dom';
import { IState } from 'Types/State.type';
import { TConstraintConfiguration } from 'Types/ConstraintConfiguration.type';
import { useAppDispatch } from 'Hooks/useAppHooks';
import { selectConstraintConfiguration } from 'Redux/ConstraintConfigurations/constraintConfigurations.actions';
import { useScheduling } from 'Hooks/useScheduling';

interface WantedAntdModalProps
  extends Pick<ModalProps, 'title' | 'visible' | 'onCancel'> {}

interface Props extends WantedAntdModalProps {}

const StartJobModal = ({ title, visible, onCancel }: Props) => {
  const { formId } = useParams<{ formId: string }>();

  const { selectedKeys } = useSSP();
  const { scheduleSelectedActivities } = useScheduling();

  const dispatch = useAppDispatch();

  const selectedConstraitConfiguration = useSelector((state) =>
    selectSelectedConstraintConfiguration(state, formId),
  );

  const constrConfs = useSelector((state: IState) =>
    makeSelectConstraintConfigurationsForForm()(state, formId),
  );

  const numberOfSelectedKeys = selectedKeys.length;
  const hasActivities = numberOfSelectedKeys > 0;

  const constrConfsValues: TConstraintConfiguration[] =
    Object.values(constrConfs);

  const selectConstraintConfigurationOptions = constrConfsValues.map(
    (constraint) => ({
      label: constraint.name,
      value: constraint._id!,
    }),
  );

  const onSelectConstraintConfiguration = (configId: string) => {
    dispatch(selectConstraintConfiguration(formId, configId));
  };

  const onScheduleActivities = () => {
    scheduleSelectedActivities(selectedKeys);
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onCancel}
      closable={false}
      okText='Schedule'
      onOk={onScheduleActivities}
      okButtonProps={{ disabled: !hasActivities }}
    >
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        <Typography.Paragraph strong>{'Scheduling info'}</Typography.Paragraph>
        <Typography.Paragraph>
          {`Number of activities in selection: ${numberOfSelectedKeys}`}
        </Typography.Paragraph>

        <div />

        <Typography.Paragraph strong copyable={{ icon: <InfoCircleTwoTone /> }}>
          {'Constraint profile'}
        </Typography.Paragraph>
        <Select
          options={selectConstraintConfigurationOptions}
          value={selectedConstraitConfiguration?._id}
          onSelect={onSelectConstraintConfiguration}
          style={{ width: '100%' }}
        />

        <div />

        <Typography.Paragraph strong copyable={{ icon: <InfoCircleTwoTone /> }}>
          {'Performance vs quality'}
        </Typography.Paragraph>

        <Row style={{ width: '100%' }} wrap={false} align='middle'>
          <Col>
            <Typography.Text>{'Fast'}</Typography.Text>
          </Col>
          <Col flex='auto'>
            <Slider min={1} max={10} step={1} defaultValue={4} />
          </Col>
          <Col>
            <Typography.Text>{'Optimized'}</Typography.Text>
          </Col>
        </Row>
      </Space>
    </Modal>
  );
};

export default StartJobModal;
