import { useMemo, useState, useEffect, useCallback } from 'react';

import _ from 'lodash';
import isEqual from 'lodash/isEqual';
import last from 'lodash/last';
import { Collapse, Table } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

// COMPONENTS
import ConstraintManagerTopBar from '../../../Components/ConstraintManagerTopBar/ConstraintManagerTopBar';

// ACTIONS
import {
  updateConstraintConfiguration,
  createConstraintConfigurations,
  deleteConstraintConfiguration,
} from '../../../Redux/ConstraintConfigurations/constraintConfigurations.actions';

// SELECTORS
import { selectConstraints } from '../../../Redux/Constraints/constraints.selectors';
import { makeSelectConstraintConfigurationsForForm } from '../../../Redux/ConstraintConfigurations/constraintConfigurations.selectors';
import {
  ConstraintConfiguration,
  ConstraintInstance,
  TConstraintConfiguration,
  TConstraintInstance,
} from '../../../Types/ConstraintConfiguration.type';
import { makeSelectForm } from '../../../Redux/Forms/forms.selectors';

import { EConstraintType, TConstraint } from '../../../Types/Constraint.type';
import { getElementsForMapping } from '../../../Redux/ActivityDesigner/activityDesigner.helpers';

// CONSTANTS
import constraintManagerTableColumns from '../../../Components/ConstraintManagerTable/ConstraintManagerTableColumns';
import { useTECoreAPI } from '../../../Hooks/TECoreApiHooks';
import { selectDesignForForm } from '../../../Redux/ActivityDesigner/activityDesigner.selectors';
import { AEBETA_PERMISSION } from '../../../Constants/permissions.constants';
import { hasPermission } from '../../../Redux/Auth/auth.selectors';
import { getFieldIdsReturn } from '../../../Types/TECoreAPI';

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
  const dispatch = useDispatch();
  const selectConstraintConfigurationsForForm = useMemo(
    () => makeSelectConstraintConfigurationsForForm(),
    [],
  );
  const constrConfs: TConstraintConfiguration[] = Object.values(
    useSelector((state) =>
      selectConstraintConfigurationsForForm(state, formId),
    ),
  );
  const selectForm = useMemo(() => makeSelectForm(), []);
  const form = useSelector((state) => selectForm(state, formId));

  const activityDesign = useSelector(selectDesignForForm)(formId);
  const hasAEBetaPermission = useSelector(hasPermission(AEBETA_PERMISSION));
  const tecoreAPI = useTECoreAPI();
  /**
   * STATE
   */
  const [localConstrConf, setConstrConf] =
    useState<TConstraintConfiguration | null>(null);
  const [fields, setFields] = useState<getFieldIdsReturn>({});

  const elements = getElementsForMapping({
    formSections: form.sections,
    mapping: activityDesign,
    settings: {
      primaryObject: form.objectScope,
    },
  });
  useEffect(() => {
    const typeExtIds = Object.keys(activityDesign.objects);

    tecoreAPI.getFieldIds({
      typeExtIds,
      callback: (result) => {
        setFields(result);
      },
    });
  }, [activityDesign, activityDesign.objects, form.sections, tecoreAPI]);

  const [isUnsaved, setIsUnsaved] = useState(false);

  useEffect(
    () => {
      setConstrConf(last(constrConfs) || null);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [constrConfs.length],
  );

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
    const constrConf = constrConfs.find(
      (constraintConfig) => constraintConfig._id === cid,
    );
    if (constrConf) setConstrConf(constrConf);
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
    const newConstrConf = ConstraintConfiguration.create({
      formId,
      name: 'New constraint configuration',
      constraints: (allConstraints || [])
        .filter(
          (constraint: TConstraint) =>
            constraint.type === EConstraintType.DEFAULT ||
            constraint.type === EConstraintType.OTHER,
        )
        .map((constraint: TConstraint) =>
          ConstraintInstance.createFromConstraint(constraint),
        ),
    });

    dispatch(createConstraintConfigurations(newConstrConf));

    if (localConstrConf) setConstrConf(localConstrConf[0]);
  }, [allConstraints, localConstrConf, dispatch, formId]);

  const handleSaveConstrConf = () => {
    if (!localConstrConf) return;
    dispatch(updateConstraintConfiguration(localConstrConf)).then(
      setIsUnsaved(false),
    );
  };

  const handleDeleteConstrconf = () => {
    if (!localConstrConf || constrConfs.length === 1) return;
    setConstrConf(localConstrConf[0]);
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

  useEffect(() => {
    if (_.isEmpty(constrConfs) && !localConstrConf) handleCreateConstrConf();
    if (localConstrConf) setConstrConf(localConstrConf);
  }, [constrConfs, localConstrConf, handleCreateConstrConf]);

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
          {hasAEBetaPermission && (
            <Collapse.Panel key='CUSTOM' header='Custom constraints'>
              <Table
                columns={constraintManagercolumns}
                dataSource={customConstraints}
                rowKey='constraintId'
                pagination={false}
              />
            </Collapse.Panel>
          )}
        </Collapse>
      )}
    </div>
  );
};

export default ConstraintManagerPage;
