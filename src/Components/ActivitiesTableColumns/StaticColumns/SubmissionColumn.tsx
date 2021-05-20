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
import { useMemo } from 'react';
import { selectFormObjectRequest } from '../../../Redux/ObjectRequests/ObjectRequestsNew.selectors';
import ObjectRequestDropdown from '../../Elements/DatasourceInner/ObjectRequestDropdown';

// TYPES
type Props = {
  formInstanceId: string;
};

const SubmissionColumn = ({ formInstanceId }: Props) => {
  const { formId }: { formId: string } = useParams();
  const dispatch = useDispatch();
  const selectFormInstance = useMemo(() => makeSelectFormInstance(), []);
  const { firstName, lastName, scopedObject } = useSelector((state) =>
    selectFormInstance(state, {
      formId,
      formInstanceId,
    }),
  );

  const objectRequests = useSelector(selectFormObjectRequest(formId));
  const primaryObject = useSelector(selectExtIdLabel)(
    'objects',
    scopedObject as string,
  );

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
        {request ? <ObjectRequestDropdown request={request} /> : primaryObject}
      </div>
    </div>
  );
};

export default SubmissionColumn;
