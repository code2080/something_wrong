import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Icon } from 'antd';

// HELPERS
import {
  getSchedulingAlgorithmForReservationValue,
  getSchedulingPayloadForReservationValue
} from '../../Redux/Reservations/reservations.helpers';

// CONSTANTS
import { mappingTypeProps } from '../../Constants/mappingTypes.constants';

const BaseReservationColQuickview = ({
  reservationValue,
  mappingProps,
  reservation,
  formatFn,
}) => {
  const mappingType = useMemo(() => mappingTypeProps[mappingProps.type] || null, [mappingProps]);
  const schedulingPayload = useMemo(
    () => getSchedulingPayloadForReservationValue(reservationValue, reservation, formatFn, true, mappingProps.type),
    [reservationValue, reservation, formatFn, mappingProps]);
  const schedulingAlgorithm = useMemo(
    () => getSchedulingAlgorithmForReservationValue(reservationValue, mappingProps.type),
    [reservationValue, mappingProps]
  );

  return (
    <div className="base-reservation-col--quickview">
      {mappingType && (
        <Tooltip
          title={mappingType.tooltip}
          getPopupContainer={() => document.getElementById('te-prefs-lib')}
        >
          <div className="base-reservation-col__quickview--icon">
            <Icon type={mappingType.icon} />
          </div>
        </Tooltip>
      )}
      <Tooltip
        title={schedulingPayload.tooltip}
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
      >
        <div className="base-reservation-col__quickview--icon">
          <Icon type={schedulingPayload.icon} />
        </div>
      </Tooltip>
      <Tooltip
        title={schedulingAlgorithm.tooltip}
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
      >
        <div className="base-reservation-col__quickview--icon">
          <Icon type={schedulingAlgorithm.icon} />
        </div>
      </Tooltip>
    </div>
  );
};

BaseReservationColQuickview.propTypes = {
  reservationValue: PropTypes.object.isRequired,
  mappingProps: PropTypes.object.isRequired,
  reservation: PropTypes.object.isRequired,
  formatFn: PropTypes.func.isRequired,
};

export default BaseReservationColQuickview;
