import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tooltip } from 'antd';

// HELPERS
import { determineContentOfValue } from '../../../Utils/activityValues.helpers';
import { getRenderPayloadForActivityValue } from '../../../Utils/activityValues.rendering';

// CONSTANTS
import { activityValueTypes } from '../../../Constants/activityValueTypes.constants';
import { submissionValueTypes } from '../../../Constants/submissionValueTypes.constants';

// COMPONENTS
import ArrayIterator from '../../TableColumns/Components/ArrayIterator';

// CONSTANTS
const mapStateToProps = state => ({
  extIdProps: state.te.extIdProps
});

const BaseActivityColValue = ({
  activityValue,
  activity,
  formatFn,
  extIdProps
}) => {
  const schedulingPayload = useMemo(() => {
    switch (activityValue.type) {
      case activityValueTypes.OBJECT: {
        const valueType = determineContentOfValue(activityValue);
        if (valueType === submissionValueTypes.OBJECT)
          return getRenderPayloadForActivityValue(
            activityValue,
            activity,
            extId =>
              extIdProps.objects[extId]
                ? [extIdProps.objects[extId].label]
                : extId
          );
        return getRenderPayloadForActivityValue(
          activityValue,
          activity,
          formatFn
        );
      }
      case activityValueTypes.FIELD:
      case activityValueTypes.TIMING:
      default:
        return getRenderPayloadForActivityValue(
          activityValue,
          activity,
          formatFn
        );
    }
  }, [activityValue, activity, formatFn, extIdProps]);

  if (schedulingPayload.tooltip)
    return (
      <Tooltip
        title={schedulingPayload.tooltip}
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
      >
        <span>{schedulingPayload.formattedValue}</span>
      </Tooltip>
    );

    return (
      <span style={{ overflow: 'hidden' }}>
        {Array.isArray(schedulingPayload.formattedValue) && schedulingPayload.formattedValue.length > 1 
        ? (<ArrayIterator arr={schedulingPayload.formattedValue} />)
          : (schedulingPayload.formattedValue)
        }
      </span>
    );
  };

BaseActivityColValue.propTypes = {
  activityValue: PropTypes.object.isRequired,
  activity: PropTypes.object,
  formatFn: PropTypes.func,
  extIdProps: PropTypes.object.isRequired
};

BaseActivityColValue.defaultProps = {
  formatFn: val => val
};

export default connect(mapStateToProps, null)(BaseActivityColValue);
