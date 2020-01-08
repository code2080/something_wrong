import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Icon, Alert } from 'antd';

// HELPERS
import {
  getSchedulingPayloadForReservationValue,
  getSchedulingAlgorithmForReservationValue,
  formatSubmissionValue,
} from '../../Redux/Reservations/reservations.helpers';

// STYLES
import './BaseReservationColModal.scss';

// CONSTANTS
import { mappingTypeProps } from '../../Constants/mappingTypes.constants';
import { reservationValueStatuses, reservationValueStatusProps } from '../../Constants/reservationStatuses.constants';

const BaseReservationColModal = ({
  reservationValue,
  reservation,
  formatFn,
  prop,
  propTitle,
  mappingProps,
  visible,
  onClose
}) => {
  const mappingType = useMemo(() => mappingTypeProps[mappingProps.type] || null, [mappingProps]);
  const schedulingPayload = useMemo(
    () => getSchedulingPayloadForReservationValue(reservationValue, reservation, formatFn, true, mappingProps.type),
    [reservationValue, reservation, formatFn, mappingProps]);
  const schedulingAlgorithm = useMemo(
    () => getSchedulingAlgorithmForReservationValue(reservationValue, mappingProps.type),
    [reservationValue, mappingProps]
  );
  const formattedSubmissionValue = useMemo(
    () => formatSubmissionValue(reservationValue.submissionValue || [], reservationValue.submissionValueType),
    [reservationValue]
  );

  return (
    <Modal
      title={`Details for property '${propTitle || prop}'`}
      visible={visible}
      getContainer={() => document.getElementById('te-prefs-lib')}
      closable={true}
      footer={null}
      maskClosable={true}
      onCancel={onClose}
      onOk={onClose}
    >
      <div className="base-reservation-col--modal">
        {schedulingPayload.status === reservationValueStatuses.MISSING_DATA && (!mappingProps.settings || mappingProps.settings.mandatory) && (
          <Alert
            type="error"
            message={reservationValueStatusProps[reservationValueStatuses.MISSING_DATA].label}
            description={reservationValueStatusProps[reservationValueStatuses.MISSING_DATA].tooltip}
          />
        )}
        {schedulingPayload.status === reservationValueStatuses.MISSING_DATA && (mappingProps.settings && !mappingProps.settings.mandatory) && (
          <Alert
            type="warning"
            message={reservationValueStatusProps[reservationValueStatuses.MISSING_DATA].label}
            description={reservationValueStatusProps[reservationValueStatuses.MISSING_DATA].tooltip}
          />
        )}
        <Form labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
          <Form.Item label="Mapped to:">
            <div className="ant-form-text">
              <div className="base-reservation-col__modal--icon">
                <Icon type={mappingType.icon} />
              </div>
              <span className="prop-name">{prop}</span>
              {mappingProps.settings && mappingProps.settings.mandatory && (<span className="required-prop">&nbsp;(required)</span>)}
            </div>
          </Form.Item>
          <Form.Item label="Value used in scheduling:">
            <div className="ant-form-text">
              <div className="base-reservation-col__modal--icon">
                <Icon type={schedulingPayload.icon} />
              </div>
              {schedulingPayload.formattedValue}
            </div>
          </Form.Item>
          <Form.Item label="Scheduling algorithm">
            <div className="ant-form-text">
              <div className="base-reservation-col__modal--icon">
                <Icon type={schedulingAlgorithm.icon} />
              </div>
              {schedulingAlgorithm.label}
            </div>
          </Form.Item>
          <Form.Item label="Value(s) in submission:">
            <div className="ant-form-text">
              {formattedSubmissionValue.map((el, idx) => (
                <div key={`el-${idx}`} className="base-reservation-col__modal--submission-value">
                  {el}
                </div>
              ))}
            </div>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

BaseReservationColModal.propTypes = {
  reservationValue: PropTypes.object.isRequired,
  reservation: PropTypes.object.isRequired,
  formatFn: PropTypes.func,
  mappingProps: PropTypes.object.isRequired,
  prop: PropTypes.string.isRequired,
  propTitle: PropTypes.string,
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

BaseReservationColModal.defaultProps = {
  formatFn: val => val,
  propTitle: null,
  visible: false,
};

export default BaseReservationColModal;
