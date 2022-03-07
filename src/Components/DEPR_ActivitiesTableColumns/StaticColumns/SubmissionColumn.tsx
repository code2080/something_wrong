import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// ACTIONS
import { setFormDetailTab } from '../../../Redux/GlobalUI/globalUI.actions';

// SELECTORS
import { makeSelectFormInstance } from '../../../Redux/FormSubmissions/formSubmissions.selectors';
import { EFormDetailTabs } from '../../../Types/FormDetailTabs.enum';

// STYLES
import './SubmissionColumn.scss';
import { selectExtIdLabel } from '../../../Redux/TE/te.selectors';
import { selectFormObjectRequest } from '../../../Redux/ObjectRequests/ObjectRequestsNew.selectors';
import ObjectRequestValue from '../../Elements/ObjectRequestValue';
import { isEmpty } from 'lodash';
import { TFormInstance } from 'Types/FormInstance.type';

// TYPES
type Props = {
  formInstanceId: string;
};

const SubmissionColumn = ({ formInstanceId }: Props) => {
  const { formId } = useParams<{ formId: string }>();
  const dispatch = useDispatch();
  const selectFormInstance = useMemo(() => makeSelectFormInstance(), []);
  const formInstance = useSelector((state) =>
    selectFormInstance(state, {
      formId,
      formInstanceId,
    }),
  ) as TFormInstance;

  const { scopedObject, firstName, lastName } = formInstance;
  const objectRequests = useSelector(selectFormObjectRequest(formId));
  const primaryObject = useSelector(selectExtIdLabel)(
    'objects',
    scopedObject as string,
  );

  if (isEmpty(formInstance)) return null;

  /**
   * EVENT HANDLERS
   */
  const onClick = () => {
    dispatch(setFormDetailTab(EFormDetailTabs.SUBMISSIONS, formInstanceId));
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

export default SubmissionColumn;
