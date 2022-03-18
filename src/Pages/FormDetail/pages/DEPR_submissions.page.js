import { useSelector } from 'react-redux';

// SELECTORS
import { selectFormDetailSubmission } from '../../../Redux/GlobalUI/globalUI.selectors';

// COMPONENTS
import SubmissionsOverviewPage from './SubmissionOverview';
import SubmissionsDetailPage from './SubmissionDetail';

const SubmissionsPage = () => {
  const selectedSubmissionId = useSelector(selectFormDetailSubmission);

  if (!selectedSubmissionId) return <SubmissionsOverviewPage />;
  return <SubmissionsDetailPage formInstanceId={selectedSubmissionId} />;
};

export default SubmissionsPage;
