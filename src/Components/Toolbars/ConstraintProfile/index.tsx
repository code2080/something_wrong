import { Dropdown, Menu, Modal, Tag, Typography } from 'antd';
import { useSelector } from 'react-redux';

// REDUX
import { constraintProfilesSelector } from 'Redux/ConstraintProfiles';

// STYLES
import './index.scss';

// TYPES
type Props = {
  constraintProfileName: string | undefined;
  onUpdateName: (name: string) => void;
  onDelete: () => void;
  onSave: () => void;
  hasChanges: boolean;
};

const ConstraintProfileToolbar = ({
  constraintProfileName,
  onUpdateName,
  onDelete,
  onSave,
  hasChanges,
}: Props) => {
  /**
   * SELECTORS
   */
  const constraintProfiles = useSelector(constraintProfilesSelector);

  /**
   * EVENT HANDLERS
   */
  const onDropdownButtonClick = ({ key }) => {
    switch (key) {
      case 'DELETE_CONSTRAINT_PROFILE':
        Modal.confirm({
          getContainer: () =>
            document.getElementById('te-prefs-lib') as HTMLElement,
          title: 'Confirm delete',
          content: 'Are you sure you want to delete this constraint profile?',
          onOk: () => onDelete(),
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className='constraint-profile-toolbar--wrapper detail-toolbar--wrapper'>
      <Typography.Text
        strong
        editable={{
          onChange: onUpdateName,
          icon: <>Edit name</>,
          autoSize: true,
        }}
      >
        {constraintProfileName || 'Unnamed profile'}
      </Typography.Text>
      <div>
        {hasChanges && <Tag>Unsaved changes</Tag>}
        <Dropdown.Button
          size='small'
          overlay={
            <Menu onClick={onDropdownButtonClick}>
              <Menu.Item
                key='DELETE_CONSTRAINT_PROFILE'
                disabled={constraintProfiles.length < 2}
              >
                Delete constraint profile
              </Menu.Item>
            </Menu>
          }
          onClick={onSave}
          type='primary'
        >
          Save changes
        </Dropdown.Button>
      </div>
    </div>
  );
};

export default ConstraintProfileToolbar;
