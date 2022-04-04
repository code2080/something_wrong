import { Modal, Select, Button } from 'antd';
import { useSelector } from 'react-redux';

// HOOKS
import { useAppDispatch, } from 'Hooks/useAppHooks';

// REDUX
import { constraintProfilesLoading, constraintProfilesSelector, createConstraintProfile } from 'Redux/ConstraintProfiles';

// STYLES
import './index.scss';

// TYPES
import { TConstraintProfile } from 'Types/ConstraintProfile.type';
import { PlusOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

type Props = {
  selectedConstraintProfileId: string | undefined;
  onSelectConstraintProfile: (id: string) => void;
  hasChanges: boolean;
};

const unsavedChangesConfirmation = (hasChanges: boolean, onOkFn: () => void) => {
  if (!hasChanges) {
    onOkFn();
  } else {
    Modal.confirm({
      getContainer: () => document.getElementById('te-prefs-lib') as HTMLElement,
      title: 'Unsaved changes',
      content: 'You have unsaved changes on your constraint profile, are you sure you want to discard them?',
      onOk: () => onOkFn(),
    });
  }
}

const ConstraintManagerTopBar = ({
  selectedConstraintProfileId,
  onSelectConstraintProfile,
  hasChanges,
}: Props) => {
  const { formId } = useParams<{ formId: string }>();
  const dispatch = useAppDispatch();

  /**
   * SELECTORS
   */
  const constraintProfiles = useSelector(constraintProfilesSelector);
  const isLoading = useSelector(constraintProfilesLoading);

  /**
   * STATE
   */
  // Trick to get auto selection of a new constraint profile after it returns
  const [isCreating, setIsCreating] = useState<boolean>(false);

  /**
   * EFFECTS
   */
  useEffect(() => {
    /**
     * If isCreating is true, and we're getting new constraint profiles,
     * we should select the last one in the list, since this is a new one from the BE
     */
    if (
      isCreating
      && constraintProfiles
      && constraintProfiles.length 
      && constraintProfiles[constraintProfiles.length - 1]._id !== selectedConstraintProfileId
    ) {
      setIsCreating(false);
      onSelectConstraintProfile(constraintProfiles[constraintProfiles.length - 1]._id)
    }
  }, [isCreating, constraintProfiles, setIsCreating, selectedConstraintProfileId, onSelectConstraintProfile]);

  /**
   * EVENT HANDLERS
   */
  const onChange = (id: string) => unsavedChangesConfirmation(hasChanges, () => onSelectConstraintProfile(id));

  const onCreateConstraintProfile = () =>
    unsavedChangesConfirmation(hasChanges, () => {
      setIsCreating(true);
      dispatch(createConstraintProfile(formId, { name: 'New constraint profile' }));
    });

  return (
    <div className="constraint-profile-selector--wrapper">
      Select constraint profile:&nbsp;
      <Select
        onChange={onChange}
        value={selectedConstraintProfileId}
        getPopupContainer={() => document.getElementById('te-prefs-lib') as HTMLElement}
        size='small'
        placeholder='No constraint profile selected'
        style={{ width: '280px' }}
        loading={isLoading}
      >
        {constraintProfiles.map((o: TConstraintProfile) => (
          <Select.Option key={o._id} value={o._id}>
            {o.name}
          </Select.Option>
        ))}
      </Select>
      <Button
        size="small"
        type='primary' 
        icon={<PlusOutlined />}
        onClick={onCreateConstraintProfile}
        loading={isLoading}
        style={{ marginLeft: '8px' }}
      >
        Create constraint profile
      </Button>
    </div>
  );
};

export default ConstraintManagerTopBar;
