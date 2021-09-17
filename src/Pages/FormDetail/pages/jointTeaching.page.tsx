import { Button, Radio } from 'antd';

// SELETORS
import { makeSelectActivitiesForForm } from 'Redux/Activities/activities.selectors';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';
import { makeSelectSortParamsForJointTeaching } from 'Redux/GlobalUI/globalUI.selectors';
import { makeSelectSelectedFilterValues } from 'Redux/Filters/filters.selectors';
import { setUnmatchedActivities } from 'Redux/GlobalUI/globalUI.actions';
import { fetchActivitiesForForm } from '../../../Redux/Activities/activities.actions';

import UnmatchedActivities from './JointTeaching/UnmatchedActivities';
import MatchedActivities from './JointTeaching/MatchedActivities';

// ACTIONS

import './jointTeaching.page.scss';

const JointTeachingPage = () => {
  const dispatch = useDispatch();
  const { formId } = useParams<{ formId: string }>();
  const [activeTab, setActiveTab] = useState('unmatchedTab');

  const selectSelectedFilterValues = useMemo(
    () => makeSelectSelectedFilterValues(),
    [],
  );
  const selectedFilterValues = useSelector((state) =>
    selectSelectedFilterValues(state, formId),
  );

  const selectActivitiesForForm = useMemo(
    () => makeSelectActivitiesForForm(),
    [],
  );

  const selectJointTeachingParamSorting = useMemo(
    () => makeSelectSortParamsForJointTeaching(),
    [],
  );

  const selectedSortingParams = useSelector((state) =>
    selectJointTeachingParamSorting(state, formId),
  );

  const activities = useSelector((state) =>
    selectActivitiesForForm(state, formId),
  );

  const unmatchedActivities = Object.values(activities)
    .map((activity) =>
      activity.filter(
        (act) =>
          true ||
          (act?.jointTeaching?.object && !act?.originJointTeachingGroup),
      ),
    )
    .flat();

  useEffect(
    () =>
      dispatch(
        fetchActivitiesForForm(
          formId,
          selectedFilterValues,
          selectedSortingParams,
        ),
      ),
    [
      dispatch,
      formId,
      selectActivitiesForForm,
      selectedFilterValues,
      selectedSortingParams,
    ],
  );

  useEffect(() => {
    dispatch(setUnmatchedActivities(formId, unmatchedActivities));
  }, [dispatch, formId, unmatchedActivities]);

  const renderTab = () => {
    switch (activeTab) {
      case 'matchedTab':
        return <MatchedActivities />;
      default:
        return <UnmatchedActivities formId={formId} />;
    }
  };

  const renderButtons = () => {
    switch (activeTab) {
      case 'matchedTab':
        return (
          <Button style={{ color: 'black' }}>
            Generate joint teaching group
          </Button>
        );
      default:
        return (
          <Button style={{ color: 'black' }}>
            Run joint teaching matching
          </Button>
        );
    }
  };

  return (
    <>
      <div className='jointTeaching-buttons--wrapper'>
        <div className='jointTeaching-tabs'>
          <Radio.Group
            buttonStyle='outline'
            defaultValue='unmatchedTab'
            style={{ color: 'black' }}
            size={'small'}
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <Radio.Button value='unmatchedTab'>
              Unmatched activities
            </Radio.Button>
            <Radio.Button value='matchedTab'>Matched activities</Radio.Button>
          </Radio.Group>
        </div>
        {renderButtons()}
      </div>
      {renderTab()}
    </>
  );
};
export default JointTeachingPage;
