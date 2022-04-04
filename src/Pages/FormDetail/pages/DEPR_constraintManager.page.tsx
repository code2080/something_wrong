import { useMemo, useState, useEffect, useCallback } from 'react';

import _ from 'lodash';
import isEqual from 'lodash/isEqual';
import { Collapse, Table, Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

// COMPONENTS
import ConstraintManagerTopBar from '../../../Components/ConstraintProfileSelectorToolbar';

// ACTIONS
import {
  updateConstraintConfiguration,
  createConstraintConfigurations,
  deleteConstraintConfiguration,
  selectConstraintConfiguration,
} from '../../../Redux/ConstraintProfiles/DEPR_constraintConfigurations.actions';

// SELECTORS
import { selectConstraints } from '../../../Redux/DEPR_Constraints/constraints.selectors';
import {
  makeSelectConstraintConfigurationsForForm,
  selectSelectedConstraintConfiguration,
} from '../../../Redux/ConstraintProfiles/DEPR_constraintConfigurations.selectors';
import {
  TConstraintConfiguration,
  TConstraintInstance,
} from '../../../Types/DEPR_ConstraintConfiguration.type';

import { TConstraint } from '../../../Types/Constraint.type';
import { getElementsForMapping } from '../../../Redux/ActivityDesigner/activityDesigner.helpers';

// CONSTANTS
import constraintManagerTableColumns from '../../../Components/DEPR_ConstraintManagerTable/ConstraintManagerTableColumns';
import { useTECoreAPI } from '../../../Hooks/TECoreApiHooks';
import { selectDesignForForm } from '../../../Redux/ActivityDesigner/activityDesigner.selectors';
import { getFieldIdsReturn } from '../../../Types/TECoreAPI';
import { formSelector } from 'Redux/Forms';

const getConstrOfType = (
  type: string,
  config: TConstraintConfiguration | null,
  allConstraints: TConstraint[],
): TConstraintInstance[] => {
  if (!config?.constraints || _.isEmpty(allConstraints)) return [];
  return config.constraints.filter(
    (constraintInstance: TConstraintInstance) => {
      const c = allConstraints.find(
        (constraint) =>
          constraintInstance.constraintId === constraint.constraintId,
      );
      return c?.type === type;
    },
  );
};

const ConstraintManagerPage = () => {
  const { formId }: { formId: string } = useParams();
  const allConstraints: TConstraint[] = useSelector(selectConstraints);

  const dispatch = useDispatch() as any;
  const selectedConstraitConfiguration = useSelector((state) =>
    selectSelectedConstraintConfiguration(state, formId),
  );
  const selectConstraintConfigurationsForForm = useMemo(
    () => makeSelectConstraintConfigurationsForForm(),
    [],
  );
  const constrConfs: TConstraintConfiguration[] = Object.values(
    useSelector((state) =>
      selectConstraintConfigurationsForForm(state, formId),
    ),
  );
  const form = useSelector(formSelector(formId));

  const activityDesign = useSelector(selectDesignForForm)(formId);
  const tecoreAPI = useTECoreAPI();
  /**
   * STATE
   */
  const [localConstrConf, setConstrConf] =
    useState<TConstraintConfiguration | null>(null);
  const [fields, setFields] = useState<getFieldIdsReturn>({});

  const elements = getElementsForMapping({
    formSections: form?.sections || [],
    mapping: activityDesign,
    settings: {
      primaryObject: form?.objectScope,
    },
  });

  useEffect(() => {
    const typeExtIds = Object.keys(activityDesign.objects);

    tecoreAPI.getFieldIds({
      typeExtIds,
      integerFieldsOnly: true,
      callback: (result) => {
        setFields(result);
      },
    });
  }, [activityDesign, activityDesign.objects, form, tecoreAPI]);

  const [isUnsaved, setIsUnsaved] = useState(false);

  useEffect(() => {
    setConstrConf(selectedConstraitConfiguration);
  }, [selectedConstraitConfiguration]);

  useEffect(() => {
    const currentConstrConf = constrConfs.find(
      (c) => c._id === localConstrConf?._id,
    );
    const configIsChanged = !isEqual(currentConstrConf, localConstrConf);
    setIsUnsaved(configIsChanged);
  }, [
    localConstrConf,
    localConstrConf?.constraints,
    localConstrConf?.name,
    constrConfs,
  ]);

  /**
   * EVENT HANDLERS
   */
  const handleSelectConstrConf = (cid: string): void => {
    if (isUnsaved) {
      Modal.confirm({
        getContainer: () =>
          document.getElementById('te-prefs-lib') as HTMLElement,
        title: 'Changing constraint configuration',
        content:
          'You have unsaved configuration, do you want to discard those changes?',
        onOk: () => {
          dispatch(selectConstraintConfiguration(formId, cid));
        },
      });
    } else {
      dispatch(selectConstraintConfiguration(formId, cid));
    }
  };

  const handleUpdConstrConfName = (value: string) => {
    if (!localConstrConf) return;
    setConstrConf({
      ...localConstrConf,
      name: value,
    });
  };

  const handleUpdConstrConf = useCallback(
    (constraintId: string, prop: string, value: any): void => {
      if (!localConstrConf) return;
      const { constraints } = localConstrConf;

      setConstrConf({
        ...localConstrConf,
        constraints: constraints.map((constraintInstance) =>
          constraintInstance.constraintId === constraintId
            ? { ...constraintInstance, [prop]: value }
            : constraintInstance,
        ),
      });
    },
    [localConstrConf],
  );

  const constraintManagercolumns = useMemo(
    () =>
      constraintManagerTableColumns(
        handleUpdConstrConf,
        allConstraints,
        fields,
        elements,
        activityDesign.objects,
      ),
    [
      handleUpdConstrConf,
      allConstraints,
      fields,
      elements,
      activityDesign.objects,
    ],
  );

  const handleCreateConstrConf = useCallback(() => {
    const doCreate = async () => {
      const res = await dispatch(createConstraintConfigurations(formId));
      if (res?._id) handleSelectConstrConf(res?._id);
    };
    doCreate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allConstraints, localConstrConf, dispatch, formId]);

  const handleSaveConstrConf = () => {
    if (!localConstrConf) return;
    dispatch(updateConstraintConfiguration(localConstrConf)).then(
      setIsUnsaved(false),
    );
  };

  const handleDeleteConstrconf = () => {
    if (!localConstrConf || constrConfs.length === 1) return;
    dispatch(deleteConstraintConfiguration(localConstrConf));
  };

  const defaultConstraints = useMemo(
    () => getConstrOfType('DEFAULT', localConstrConf, allConstraints),
    [localConstrConf, allConstraints],
  );
  const customConstraints = useMemo(
    () => getConstrOfType('OTHER', localConstrConf, allConstraints),
    [localConstrConf, allConstraints],
  );

  return (
    <div className='constraint-manager--wrapper'>
      <ConstraintManagerTopBar
        constraintConfigurations={constrConfs}
        selectedCID={localConstrConf ? localConstrConf._id : null}
        selConstrName={localConstrConf ? localConstrConf.name : null}
        onSelect={handleSelectConstrConf}
        onCreateNew={handleCreateConstrConf}
        onSaveConstraintConfiguration={handleSaveConstrConf}
        onUpdConstrConfName={handleUpdConstrConfName}
        onDeleteConstraintConfiguration={handleDeleteConstrconf}
        isSaved={!isUnsaved}
      />
      {localConstrConf && (
        <Collapse defaultActiveKey={['DEFAULT', 'CUSTOM']} bordered={false}>
          <Collapse.Panel key='DEFAULT' header='Default constraints'>
            <Table
              columns={constraintManagercolumns}
              dataSource={defaultConstraints}
              rowKey='constraintId'
              pagination={false}
            />
          </Collapse.Panel>
          <Collapse.Panel key='CUSTOM' header='Custom constraints'>
            <Table
              columns={constraintManagercolumns}
              dataSource={customConstraints}
              rowKey='constraintId'
              pagination={false}
            />
          </Collapse.Panel>
        </Collapse>
      )}
    </div>
  );
};

export default ConstraintManagerPage;
