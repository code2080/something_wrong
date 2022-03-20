import { useDispatch } from 'react-redux';

// REDUX
import { setFormDetailTab } from '../../../Redux/GlobalUI/globalUI.actions';


// TYPES
import { TActivity } from 'Types/Activity/Activity.type';
import { EFormDetailTabs } from 'Types/FormDetailTabs.enum';

// TYPES
type Props = {
  activity: TActivity;
};

const Submitter = ({ activity }: Props) => {
  const dispatch = useDispatch();

  /**
   * EVENT HANDLERS
   */
  const onClick = () => dispatch(setFormDetailTab(EFormDetailTabs.SUBMISSIONS, activity.formInstanceId));

  if (!activity.formInstanceId) return <>N/A</>;

  return (
    <div className='submission-column--wrapper' onClick={onClick}>
      {activity.metadata.submitterName}
    </div>
  );
};

export default Submitter;
