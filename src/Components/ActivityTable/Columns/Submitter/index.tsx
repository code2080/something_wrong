import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';

// REDUX
import { setFormDetailTab } from '../../../../Redux/GlobalUI/globalUI.actions';
import { makeSelectFormInstance } from '../../../../Redux/FormSubmissions/formSubmissions.selectors';
import { selectExtIdLabel } from '../../../../Redux/TE/te.selectors';
import { selectFormObjectRequest } from '../../../../Redux/ObjectRequests/ObjectRequestsNew.selectors';

// COMPONENTS
import ObjectRequestValue from '../../../Elements/ObjectRequestValue';

// STYLES
import './index.scss';

// TYPES
import { TFormInstance } from 'Types/FormInstance.type';
import { TActivity } from "Types/Activity.type";
import { EFormDetailTabs } from "Types/FormDetailTabs.enum";

// TYPES
type Props = {
  activity: TActivity,
};

const Submitter = ({ activity }: Props) => {
  const dispatch = useDispatch();
  const selectFormInstance = useMemo(() => makeSelectFormInstance(), []);
  const formInstance = useSelector((state) =>
    selectFormInstance(state, {
      formId: activity.formId,
      formInstanceId: activity.formInstanceId,
    }),
  ) as TFormInstance;

  const { scopedObject, firstName, lastName } = formInstance;
  const objectRequests = useSelector(selectFormObjectRequest(activity.formId));
  const primaryObject = useSelector(selectExtIdLabel)(
    'objects',
    scopedObject as string,
  );

  if (isEmpty(formInstance)) return null;

  /**
   * EVENT HANDLERS
   */
  const onClick = () => {
    dispatch(setFormDetailTab(EFormDetailTabs.SUBMISSIONS, activity.formInstanceId));
  };

  const request = objectRequests.find((req) => req._id === primaryObject);

  return (
    <div className='submission-column--wrapper' onClick={onClick}>
      <div className='submitter--row'>{`${firstName} ${lastName}`}</div>
      <div className='primary-object--row'>
        <span>Primary object:&nbsp;</span>
        {request ? <ObjectRequestValue request={request} /> : primaryObject}
      </div>
    </div>
  );
};

export default Submitter;
