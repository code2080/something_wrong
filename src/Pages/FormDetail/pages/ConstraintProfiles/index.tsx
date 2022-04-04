import { useMemo, useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import isEqual from 'lodash/isEqual';
import { Collapse, Empty, List } from 'antd';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// COMPONENTS
import ConstraintProfileSelectorToolbar from '../../../../Components/ConstraintProfileSelectorToolbar';
import ConstraintProfileToolbar from 'Components/ConstraintProfileToolbar';
import ConstraintInstanceListItem from 'Components/ConstraintInstanceListItem';

// HOOKS
import { useTECoreAPI } from '../../../../Hooks/TECoreApiHooks';
import { useAppDispatch } from 'Hooks/useAppHooks';

// REDUX
import { getElementsForMapping } from '../../../../Redux/ActivityDesigner/activityDesigner.helpers';
import { selectActivityDesignForForm } from '../../../../Redux/ActivityDesigner/activityDesigner.selectors';
import { formSelector } from 'Redux/Forms';
import { constraintProfilesSelector, deleteConstraintProfileForForm, updateConstraintProfile } from 'Redux/ConstraintProfiles';
import { constraintsSelector } from 'Redux/Constraints';

// STYLES
import './index.scss';

// TYPES
import { TConstraint } from '../../../../Types/Constraint.type';
import { TConstraintInstance, TConstraintProfile } from 'Types/ConstraintProfile.type';
import { getFieldIdsReturn } from '../../../../Types/TECoreAPI';

const getConstraintsOfType = (
  type: string,
  constraintProfile: TConstraintProfile | undefined,
  allConstraints: TConstraint[],
): TConstraintInstance[] => {
  if (!constraintProfile?.constraints || isEmpty(allConstraints)) return [];
  return constraintProfile.constraints.filter(
    (el) => el.weight && !!allConstraints.find((c) => el.constraintId === c.constraintId && c.type === type));
};

const ConstraintProfilesPage = () => {
  const { formId }: { formId: string } = useParams();
  const dispatch = useAppDispatch();
  const tecoreAPI = useTECoreAPI();

  /**
   * SELECTORS
   */
  const form = useSelector(formSelector(formId));
  const activityDesign = useSelector(selectActivityDesignForForm(formId));
  const allConstraints: TConstraint[] = useSelector(constraintsSelector);
  const constraintProfiles: TConstraintProfile[] = useSelector(constraintProfilesSelector);

  /**
   * STATE
   */
  const [selectedConstraintProfileId, setSelectedConstraintProfileId] = useState<string | undefined>(undefined);
  const [selectedConstraintProfile, setSelectedConstraintProfile] = useState<TConstraintProfile | undefined>(undefined);
  const [fields, setFields] = useState<getFieldIdsReturn>({});

  /**
   * EFFECTS
   */
  // Update the local state copy whenever selectedConstraintProfileId updates
  useEffect(() => {
    const constraintProfile = constraintProfiles.find((c) => c._id === selectedConstraintProfileId);
    setSelectedConstraintProfile(constraintProfile);
  }, [selectedConstraintProfileId, constraintProfiles]);

  const elements = getElementsForMapping({
    formSections: form?.sections || [],
    mapping: activityDesign,
    settings: {
      primaryObject: form?.objectScope,
    },
  });

  useEffect(() => {
    tecoreAPI.getFieldIds({
      typeExtIds: Object.keys(activityDesign.objects),
      integerFieldsOnly: true,
      callback: (result) => {
        setFields(result);
      },
    });
  }, [ activityDesign, tecoreAPI]);

  /**
   * EVENT HANDLERS
   */
  const onSave = () => {
    if (!selectedConstraintProfile) return;
    dispatch(updateConstraintProfile(formId, selectedConstraintProfile));
  }

  const onDelete = () => {
    if (!selectedConstraintProfileId) return;
    dispatch(deleteConstraintProfileForForm(formId, selectedConstraintProfileId));
    setSelectedConstraintProfileId(undefined);
  };

  const onUpdate = (prop: keyof TConstraintProfile, value: any) => {
    if (!selectedConstraintProfile) return;
    setSelectedConstraintProfile({ ...selectedConstraintProfile, [prop]: value });
  };

  const onUpdateConstraintInstance = (constraintId: string, updateBody: TConstraintInstance) => {
    if (!selectedConstraintProfile) return;
    const updatedConstraints = selectedConstraintProfile.constraints.map((instance) => {
      if (instance.constraintId !== constraintId) return instance;
      return updateBody; 
    })
    setSelectedConstraintProfile({ ...selectedConstraintProfile, constraints: updatedConstraints });
  };

  /**
   * MEMOIZED PROPS
   */
  const hasChanges = useMemo(() => {
    const reduxStateCopy = constraintProfiles.find((el) => el._id === selectedConstraintProfileId);
    return !isEqual(reduxStateCopy, selectedConstraintProfile);
  }, [constraintProfiles, selectedConstraintProfile, selectedConstraintProfileId]);

  const defaultConstraintInstances = getConstraintsOfType('DEFAULT', selectedConstraintProfile, allConstraints);
  return (
    <div className='constraint-profiles--page'>
      <ConstraintProfileSelectorToolbar
        selectedConstraintProfileId={selectedConstraintProfileId}
        onSelectConstraintProfile={setSelectedConstraintProfileId}
        hasChanges={hasChanges}
      />
      {selectedConstraintProfile ? (
        <>
          <ConstraintProfileToolbar
            constraintProfileName={selectedConstraintProfile?.name}
            onSave={onSave}
            onDelete={onDelete}
            onUpdateName={(name) => onUpdate('name', name)}
            hasChanges={hasChanges}
          />
          <Collapse defaultActiveKey={['DEFAULT', 'CUSTOM']}>
            <Collapse.Panel key='DEFAULT' header='Default constraints'>
              <List
                dataSource={defaultConstraintInstances}
                pagination={false}
                renderItem={(item: TConstraintInstance) => (
                  <ConstraintInstanceListItem
                    instance={item}
                    onChange={(updateBody) => onUpdateConstraintInstance(item.constraintId, updateBody)}
                    fields={fields}
                    elements={elements}
                    activityDesign={activityDesign}
                  />
                )}
              />
            </Collapse.Panel>
            <Collapse.Panel key='CUSTOM' header='Custom constraints'>
              <List
                dataSource={getConstraintsOfType('OTHER', selectedConstraintProfile, allConstraints)}
                pagination={false}
                renderItem={(item: TConstraintInstance) => (
                  <ConstraintInstanceListItem
                    instance={item}
                    onChange={(updateBody) => onUpdateConstraintInstance(item.constraintId, updateBody)}
                    fields={fields}
                    elements={elements}
                    activityDesign={activityDesign}
                  />
                )}
              />
            </Collapse.Panel>
          </Collapse>
        </>
      ) : (
        <Empty description="Select a constraint profile to get started" />
      )}
    </div>
  );
};

export default ConstraintProfilesPage;
