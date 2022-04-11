import { useParams } from "react-router-dom";

// COMPONENTS
import GroupManagementToolbar from "Components/Toolbars/GroupManagement";
import SSPResourceWrapper from "Components/SSP/Components/Wrapper";
import GroupManagementTable from "Components/Tables/GroupManagement";

// REDUX
import { selectSSPState } from "Components/SSP/Utils/selectors";
import { fetchGroupsForForm, initializeSSPStateProps } from "Redux/Groups";

// TYPES
import { ISSPQueryObject } from "Types/SSP.type";

const GroupManagementPage = () => {
  const { formId } = useParams<{ formId: string }>();

  return (
    <SSPResourceWrapper
      name={`${formId}__FORM_DETAIL_GROUPS`}
      selectorFn={selectSSPState('groups')}
      fetchFn={(partialQuery?: Partial<ISSPQueryObject>) =>
        fetchGroupsForForm(formId as string, partialQuery)
      }
      initSSPStateFn={(partialQuery?: Partial<ISSPQueryObject>) =>
        initializeSSPStateProps(partialQuery)
      }
    >
      <GroupManagementToolbar />
      <GroupManagementTable />
    </SSPResourceWrapper>
  );
};

export default GroupManagementPage;