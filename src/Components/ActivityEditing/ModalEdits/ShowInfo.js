import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Form, Alert } from 'antd';

// HELPERS
import {
  renderComponent,
  renderSubmissionValue,
} from '../../DEPR_ActivitiesTableColumns/ActivityValueColumns/Helpers/rendering';

// STYLES
import '../ModalEdit.scss';

// CONSTANTS
import {
  activityValueStatuses,
  activityValueStatusProps,
} from '../../../Constants/activityStatuses.constants';
import { selectExtIdLabel } from '../../../Redux/TE/te.selectors';

const ShowInfo = ({ activityValue, activity, prop, mappingProps }) => {
  const propLabel = useSelector((state) =>
    selectExtIdLabel(state)('types', prop),
  );
  const component = useMemo(
    () => renderComponent(activityValue, activity),
    [activity, activityValue],
  );
  const renderedSubmissionValue = useMemo(
    () =>
      renderSubmissionValue(
        activityValue.submissionValue || [],
        activityValue.submissionValueType,
      ),
    [activityValue],
  );

  return (
    <>
      {component.status === activityValueStatuses.MISSING_DATA &&
        (!mappingProps.settings || mappingProps.settings.mandatory) && (
          <Alert
            type='error'
            message={
              activityValueStatusProps[activityValueStatuses.MISSING_DATA].label
            }
            description={
              activityValueStatusProps[activityValueStatuses.MISSING_DATA]
                .tooltip
            }
          />
        )}
      {component.status === activityValueStatuses.MISSING_DATA &&
        mappingProps.settings &&
        !mappingProps.settings.mandatory && (
          <Alert
            type='warning'
            message={
              activityValueStatusProps[activityValueStatuses.MISSING_DATA].label
            }
            description={
              activityValueStatusProps[activityValueStatuses.MISSING_DATA]
                .tooltip
            }
          />
        )}
      <Form labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
        <Form.Item label='Mapped to:'>
          <div className='ant-form-text'>
            <span className='prop-name'>{propLabel}</span>
            {mappingProps.settings && mappingProps.settings.mandatory && (
              <span className='required-prop'>&nbsp;(required)</span>
            )}
          </div>
        </Form.Item>
        <Form.Item label='Value used in scheduling:'>
          <div className='ant-form-text'>{component.renderedComponent}</div>
        </Form.Item>
        <Form.Item label='Value(s) in submission:'>
          <div className='ant-form-text'>
            <div
              key='el-0'
              className='base-activity-col__modal--submission-value'
              style={{ wordBreak: 'break-all' }}
            >
              {JSON.stringify(renderedSubmissionValue)}
            </div>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

ShowInfo.propTypes = {
  activityValue: PropTypes.object.isRequired,
  activity: PropTypes.object.isRequired,
  mappingProps: PropTypes.object.isRequired,
  prop: PropTypes.string.isRequired,
};

ShowInfo.defaultProps = {
  formatFn: (val) => val,
  propTitle: null,
  visible: false,
};

export default ShowInfo;
