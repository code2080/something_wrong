import { Button, Radio } from 'antd';

// SELETORS
import { makeSelectActivitiesForForm } from 'Redux/Activities/activities.selectors';
import { createLoadingSelector } from 'Redux/APIStatus/apiStatus.selectors';
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
import {
  fetchJointTeachingGroupsForForm,
  generateJointTeachingGroup,
} from 'Redux/JointTeaching/jointTeaching.actions';
import { GENERATE_JOINT_TEACHING_GROUP } from 'Redux/JointTeaching/jointTeaching.actionTypes';

const JointTeachingPage = () => {
  const dispatch = useDispatch();
  const { formId } = useParams<{ formId: string }>();
  const [activeTab, setActiveTab] = useState('unmatchedTab');
  const generating = useSelector(
    createLoadingSelector([GENERATE_JOINT_TEACHING_GROUP]),
  );

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

  const onGenerate = async () => {
    await dispatch(generateJointTeachingGroup({ formId }));
    dispatch(fetchJointTeachingGroupsForForm({ formId }));
  };

  // useEffect(
  //   () =>
  //     dispatch(
  //       fetchActivitiesForForm(
  //         formId,
  //         selectedFilterValues,
  //         selectedSortingParams,
  //       ),
  //     ),
  //   [
  //     dispatch,
  //     formId,
  //     selectActivitiesForForm,
  //     selectedFilterValues,
  //     selectedSortingParams,
  //   ],
  // );

  // useEffect(() => {
  //   dispatch(setUnmatchedActivities(formId, unmatchedActivities));
  // }, [dispatch, formId, unmatchedActivities]);

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
          <Button
            onClick={onGenerate}
            style={{ color: 'black' }}
            loading={!!generating}
          >
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
