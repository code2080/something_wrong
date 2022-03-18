import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// COMPONENTS

import { makeSelectSubmissions } from 'Redux/FormSubmissions/formSubmissions.selectors';
import GroupManagementTable from 'Components/GroupManagement/GroupManagementTable';
import { selectDesignForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';
import { formSelector } from 'Redux/Forms';

const GroupManagementPage = () => {
  const { formId } = useParams<{ formId: string }>();

  const form = useSelector(formSelector(formId));
  const design = useSelector(selectDesignForForm)(formId);

  const submissions = useSelector((state) =>
    makeSelectSubmissions()(state, formId),
  );

  /**
   * STATE VARS
   */

  return (
    <GroupManagementTable
      form={form}
      submissions={submissions}
      design={design}
    />
  );
};
export default GroupManagementPage;
