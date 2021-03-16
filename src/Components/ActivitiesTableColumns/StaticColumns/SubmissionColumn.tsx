import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// ACTIONS
import { setFormDetailTab } from '../../../Redux/GlobalUI/globalUI.actions';
import { setActivityFilterOptions } from '../../../Redux/Filters/filters.actions';

// SELECTORS
import { selectFormInstance } from '../../../Redux/FormSubmissions/formSubmissions.selectors';
import { EFormDetailTabs } from '../../../Types/FormDetailTabs.enum';
import { TFormInstance } from '../../../Types/FormInstance.type';

// STYLES
import './SubmissionColumn.scss';

// TYPES
import { EActivityFilterType } from '../../../Types/ActivityFilter.interface';

type Props = {
  formInstanceId: string,
  activityId: string,
};

const SubmissionColumn = ({ formInstanceId, activityId }: Props) => {
  const { formId }: { formId: string } = useParams();
  const dispatch = useDispatch();

  const formInstance: TFormInstance = useSelector(selectFormInstance)(formId, formInstanceId);

  useEffect(() => {
    // Set two filter options; one for submitter and one for primary object
    const name = `${formInstance.firstName} ${formInstance.lastName}`;
    dispatch(setActivityFilterOptions({
      filterId: `${formId}_ACTIVITIES`,
      optionType: EActivityFilterType.TIMING,
      optionPayload: { extId: 'submitter', values: [{ value: `submitter/${name}`, label: name }] },
      activityId
    }));
    const primaryObject = formInstance.scopedObject || 'N/A';
    dispatch(setActivityFilterOptions({
      filterId: `${formId}_ACTIVITIES`,
      optionType: EActivityFilterType.TIMING,
      optionPayload: { extId: 'primaryObject', values: [{ value: `primaryObject/${primaryObject}`, label: primaryObject }] },
      activityId
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
