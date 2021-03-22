import { useSelector } from 'react-redux';

// SELECTORS
import { selectFormDetailSubmission } from '../../../Redux/GlobalUI/globalUI.selectors';

// COMPONENTS
import SubmissionsOverviewPage from './submissions.overview.page';
import SubmissionsDetailPage from './submissions.detail.page';

const SubmissionsPage = () => {
  const selectedSubmissionId = useSelector(selectFormDetailSubmission);

  if (!selectedSubmissionId) return <SubmissionsOverviewPage />;
  return <SubmissionsDetailPage formInstanceId={selectedSubmissionId} />;
};

export default SubmissionsPage;
