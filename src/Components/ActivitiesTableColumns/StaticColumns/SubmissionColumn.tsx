import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// ACTIONS
import { setFormDetailTab } from '../../../Redux/GlobalUI/globalUI.actions';

// SELECTORS
import { selectFormInstance } from '../../../Redux/FormSubmissions/formSubmissions.selectors';
import { EFormDetailTabs } from '../../../Types/FormDetailTabs.enum';
import { TFormInstance } from '../../../Types/FormInstance.type';

// STYLES
import './SubmissionColumn.scss';

// TYPES
type Props = {
  formInstanceId: string,
};

const SubmissionColumn = ({ formInstanceId }: Props) => {
  const { formId }: { formId: string } = useParams();
  const dispatch = useDispatch();

  const formInstance: TFormInstance = useSelector(selectFormInstance)(formId, formInstanceId);

  /**
   * EVENT HANDLERS
   */
  const onClick = () => {
    dispatch(setFormDetailTab(EFormDetailTabs.SUBMISSIONS, formInstanceId));
  };

  return (
    <div className='submission-column--wrapper' onClick={onClick}>
      <div className='submitter--row'>
        {`${formInstance.firstName} ${formInstance.lastName}`}
      </div>
      <div className='primary-object--row'>
        <span>Primary object:&nbsp;</span>
        {formInstance.scopedObject || 'N/A'}
      </div>
    </div>
  );
};

export default SubmissionColumn;
