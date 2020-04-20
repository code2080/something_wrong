import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Alert } from 'antd';

// HELPERS
import {
  getSchedulingPayloadForActivityValue,
  getSchedulingAlgorithmForActivityValue,
  formatSubmissionValue,
} from '../../../Redux/Activities/activities.helpers';

// STYLES
import '../ModalEdit.scss';

// CONSTANTS
import { mappingTypeProps } from '../../../Constants/mappingTypes.constants';
import { activityValueStatuses, activityValueStatusProps } from '../../../Constants/activityStatuses.constants';

const ShowInfo = ({
  activityValue,
  activity,
  formatFn,
  prop,
  mappingProps,
}) => {
  const mappingType = useMemo(() => mappingTypeProps[mappingProps.type] || null, [mappingProps]);
  const schedulingPayload = useMemo(
    () => getSchedulingPayloadForActivityValue(activityValue, activity, formatFn, true, mappingProps.type),
    [activityValue, activity, formatFn, mappingProps]);
  const schedulingAlgorithm = useMemo(
    () => getSchedulingAlgorithmForActivityValue(activityValue, mappingProps.type),
    [activityValue, mappingProps]
  );
  const formattedSubmissionValue = useMemo(
    () => formatSubmissionValue(activityValue.submissionValue || [], activityValue.submissionValueType),
    [activityValue]
  );

  return (
    <React.Fragment>
      {schedulingPayload.status === activityValueStatuses.MISSING_DATA && (!mappingProps.settings || mappingProps.settings.mandatory) && (
        <Alert
          type="error"
          message={activityValueStatusProps[activityValueStatuses.MISSING_DATA].label}
          description={activityValueStatusProps[activityValueStatuses.MISSING_DATA].tooltip}
        />
      )}
      {schedulingPayload.status === activityValueStatuses.MISSING_DATA && (mappingProps.settings && !mappingProps.settings.mandatory) && (
        <Alert
          type="warning"
          message={activityValueStatusProps[activityValueStatuses.MISSING_DATA].label}
          description={activityValueStatusProps[activityValueStatuses.MISSING_DATA].tooltip}
        />
      )}
      <Form labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
        <Form.Item label="Mapped to:">
          <div className="ant-form-text">
            <div className="base-activity-col__modal--icon">
              <Icon type={mappingType.icon} />
            </div>
            <span className="prop-name">{prop}</span>
            {mappingProps.settings && mappingProps.settings.mandatory && (<span className="required-prop">&nbsp;(required)</span>)}
          </div>
        </Form.Item>
        <Form.Item label="Value used in scheduling:">
          <div className="ant-form-text">
            <div className="base-activity-col__modal--icon">
              <Icon type={schedulingPayload.icon} />
            </div>
            {schedulingPayload.formattedValue}
          </div>
        </Form.Item>
        <Form.Item label="Scheduling algorithm">
          <div className="ant-form-text">
            <div className="base-activity-col__modal--icon">
              <Icon type={schedulingAlgorithm.icon} />
            </div>
            {schedulingAlgorithm.label}
          </div>
        </Form.Item>
        <Form.Item label="Value(s) in submission:">
          <div className="ant-form-text">
            {formattedSubmissionValue.map((el, idx) => (
              <div key={`el-${idx}`} className="base-activity-col__modal--submission-value">
                {el}
              </div>
            ))}
          </div>
        </Form.Item>
      </Form>
    </React.Fragment>
  );
};

ShowInfo.propTypes = {
  activityValue: PropTypes.object.isRequired,
  activity: PropTypes.object.isRequired,
  formatFn: PropTypes.func,
  mappingProps: PropTypes.object.isRequired,
  prop: PropTypes.string.isRequired,
};

ShowInfo.defaultProps = {
  formatFn: val => val,
  propTitle: null,
  visible: false,
};

export default ShowInfo;
