import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Icon } from 'antd';

// HELPERS
import {
  getSchedulingAlgorithmForActivityValue,
  getRenderPayloadForActivityValue
} from '../../../Utils/activityValues.rendering';

// CONSTANTS
import { mappingTypeProps } from '../../../Constants/mappingTypes.constants';

const BaseActivityColQuickview = ({
  activityValue,
  mappingProps,
  activity,
  formatFn,
}) => {
  const mappingType = useMemo(() => mappingTypeProps[mappingProps.type] || null, [mappingProps]);
  const schedulingPayload = useMemo(
    () => getRenderPayloadForActivityValue(activityValue, activity, formatFn, true, mappingProps.type),
    [activityValue, activity, formatFn, mappingProps]);
  const schedulingAlgorithm = useMemo(
    () => getSchedulingAlgorithmForActivityValue(activityValue, activity),
    [activityValue, activity]
  );

  return (
    <div className="base-activity-col--quickview">
      {mappingType && (
        <Tooltip
          title={mappingType.tooltip}
          getPopupContainer={() => document.getElementById('te-prefs-lib')}
        >
          <div className="base-activity-col__quickview--icon">
            <Icon type={mappingType.icon} />
          </div>
        </Tooltip>
      )}
      <Tooltip
        title={schedulingPayload.tooltip}
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
      >
        <div className="base-activity-col__quickview--icon">
          <Icon type={schedulingPayload.icon} />
        </div>
      </Tooltip>
      <Tooltip
        title={schedulingAlgorithm.tooltip}
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
      >
        <div className="base-activity-col__quickview--icon">
          <Icon type={schedulingAlgorithm.icon} />
        </div>
      </Tooltip>
    </div>
  );
};

BaseActivityColQuickview.propTypes = {
  activityValue: PropTypes.object.isRequired,
  mappingProps: PropTypes.object.isRequired,
  activity: PropTypes.object.isRequired,
  formatFn: PropTypes.func.isRequired,
};

export default BaseActivityColQuickview;
