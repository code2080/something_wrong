import { useDispatch } from 'react-redux';

// REDUX
import { setFormDetailTab } from '../../../../Redux/GlobalUI/globalUI.actions';

// STYLES
import './index.scss';

// TYPES
import { TActivity } from 'Types/Activity/Activity.type';
import { EFormDetailTabs } from 'Types/FormDetailTabs.enum';

// TYPES
type Props = {
  activity: TActivity;
};

const Submitter = ({ activity }: Props) => {
  const dispatch = useDispatch();

  // /**
  //  * EVENT HANDLERS
  //  */
  const onClick = () => {
    dispatch(
      setFormDetailTab(EFormDetailTabs.SUBMISSIONS, activity.formInstanceId),
    );
  };

  return (
    <div className='submission-column--wrapper' onClick={onClick}>
      <div className='submitter--row'>{activity.metadata?.submitterName || 'N/A'}</div>
      <div className='primary-object--row'>
        <span>Primary object:&nbsp;</span>
        {activity.metadata?.primaryObject || 'N/A'}
      </div>
    </div>
  );
};

export default Submitter;

/**
 *   // const selectFormInstance = useMemo(() => makeSelectFormInstance(), []);
  // const formInstance = useSelector((state) =>
  //   selectFormInstance(state, {
  //     formId: activity.formId,
  //     formInstanceId: activity.formInstanceId,
  //   }),
  // ) as TFormInstance;

  // const { scopedObject, firstName, lastName } = formInstance;
  // const objectRequests = useSelector(selectFormObjectRequest(activity.formId));
  // const primaryObject = useSelector(selectExtIdLabel)(
  //   'objects',
  //   scopedObject as string,
  // );

  // if (isEmpty(formInstance)) return null;
    // const request = objectRequests.find((req) => req._id === primaryObject);

 */
