import { memo, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// HELPERS
import { renderComponent } from '../Helpers/rendering';

// CONSTANTS
import { activityValueStatuses } from '../../../../Constants/activityStatuses.constants';

// SELECTORS
import { selectDesignForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';

const BaseActivityColValue = ({ activityValue, activity }) => {
  const { formId } = useParams();
  const activityDesign = useSelector(selectDesignForForm)(formId);
  const component = useMemo(
    () => renderComponent(activityValue, activity, activityDesign),
    [activityValue, activity],
  );
  if (
    component.status === activityValueStatuses.READY_FOR_SCHEDULING &&
    component.renderedComponent
  )
    return component.renderedComponent;
  return <span>Missing data</span>;
};

BaseActivityColValue.propTypes = {
  activityValue: PropTypes.object.isRequired,
  activity: PropTypes.object,
};

BaseActivityColValue.defaultProps = {
  formatFn: (val) => val,
};

export default memo(BaseActivityColValue);
