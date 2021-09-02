import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { SelectOutlined } from '@ant-design/icons';
import classNames from 'classnames';

// COMPONENTS
import { useTECoreAPI } from '../../../../Hooks/TECoreApiHooks';

// SELECTORS
import { makeSelectFormInstance } from '../../../../Redux/FormSubmissions/formSubmissions.selectors';
import { selectFormInstanceObjectRequests } from '../../../../Redux/ObjectRequests/ObjectRequests.selectors';
import { selectTECorePayloadForActivity } from '../../../../Redux/Activities/activities.selectors';
import { useMemo } from 'react';

// TYPES
import { TActivity } from '../../../../Types/Activity.type';

type SelectActivityButtonProps = {
  activity: TActivity;
};

const SelectActivityButton = ({ activity }: SelectActivityButtonProps) => {
  const teCoreAPI = useTECoreAPI();
  const selectFormInstance = useMemo(() => makeSelectFormInstance(), []);
  const formInstance = useSelector((state) =>
    selectFormInstance(state, {
      formId: activity.formId,
      formInstanceId: activity.formInstanceId,
    }),
  );
  const formInstanceRequests: any = useSelector(
    selectFormInstanceObjectRequests(formInstance),
  );
  const teCorePayload = useSelector(selectTECorePayloadForActivity)(
    activity.formId,
    activity.formInstanceId,
    activity._id,
    formInstanceRequests,
  );

  const onSelectAllCallback = () => {
    if (teCorePayload) teCoreAPI.populateSelection(teCorePayload);
  };

  return (
    <div
      className={classNames('scheduling-actions--button', {
        disabled: activity.isInactive(),
      })}
      onClick={!activity.isInactive() ? onSelectAllCallback : undefined}
    >
      <SelectOutlined />
    </div>
  );
};

SelectActivityButton.propTypes = {
  activity: PropTypes.object.isRequired,
};

export default SelectActivityButton;
