import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// COMPONENTS

import { makeSelectSubmissions } from 'Redux/FormSubmissions/formSubmissions.selectors';
import GroupManagementTable from 'Components/GroupManagement/GroupManagementTable';
import { makeSelectForm } from 'Redux/Forms/forms.selectors';
import { selectDesignForForm } from 'Redux/ActivityDesigner/activityDesigner.selectors';

const GroupManagementPage = () => {
  const { formId } = useParams<{ formId: string }>();
  const selectForm = useMemo(() => makeSelectForm(), []);

  const form = useSelector((state) => selectForm(state, formId));
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
