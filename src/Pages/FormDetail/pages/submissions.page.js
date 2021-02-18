import React, { useState } from 'react';

// COMPONENTS
import SubmissionsOverviewPage from './submissions.overview.page';
import SubmissionsDetailPage from './submissions.detail.page';

const SubmissionsPage = () => {
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);

  if (!selectedSubmissionId)
    return <SubmissionsOverviewPage onSelectSubmission={setSelectedSubmissionId} />;
  return <SubmissionsDetailPage formInstanceId={selectedSubmissionId} />
};

export default SubmissionsPage;
