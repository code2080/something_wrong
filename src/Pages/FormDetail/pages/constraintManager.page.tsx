import { useMemo, useState, useEffect, useCallback } from 'react';

import _ from 'lodash';
import { Button, Collapse, Table } from 'antd';
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
import { EConstraintType, TConstraint } from '../../../Types/Constraint.type';

// CONSTANTS
import constraintManagerTableColumns from '../../../Components/ConstraintManagerTable/ConstraintManagerTableColumns';
import { useTECoreAPI } from '../../../Hooks/TECoreApiHooks';
import { selectDesignForForm } from '../../../Redux/ActivityDesigner/activityDesigner.selectors';
import { AEBETA_PERMISSION } from '../../../Constants/permissions.constants';
import { hasPermission } from '../../../Redux/Auth/auth.selectors';
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
  const activityDesign = useSelector(selectDesignForForm)(formId);
  const hasAEBetaPermission = useSelector(hasPermission(AEBETA_PERMISSION));
  const tecoreAPI = useTECoreAPI();
  /**
   * STATE
   */
  const [constrConf, setConstrConf] = useState<TConstraintConfiguration | null>(
    null,
  );
  const [fields, setFields] = useState<any>();

  useEffect(() => {
    const typeExtIds = Object.keys(activityDesign.objects);
    tecoreAPI.getFieldIds({
      typeExtIds,
      callback: (result) => {
        return setFields(result);
      },
    });
  }, [activityDesign?.objects, tecoreAPI]);

  useEffect(
    () => {
      setConstrConf(constrConfs.slice(-1)[0]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [constrConfs.length],
  );

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
    if (!constrConf) return;
    setConstrConf({
      ...constrConf,
      name: value,
    });
  };

  const handleUpdConstrConf = (
    constraintId: string,
    prop: string,
    value: any,
  ): void => {
    if (!constrConf) return;
    const { constraints } = constrConf;

    setConstrConf({
      ...constrConf,
      constraints: constraints.map((constraintInstance) =>
        constraintInstance.constraintId === constraintId
          ? {
              ...constraintInstance,
              [prop]: value,
            }
          : constraintInstance,
      ),
    });
  };

  const handleAddCustomConstraint = (e) => {
    e.stopPropagation();
  };

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

    if (constrConf) setConstrConf(constrConf[0]);
  }, [allConstraints, constrConf, dispatch, formId]);

  const handleSaveConstrConf = () => {
    if (!constrConf) return;
    dispatch(updateConstraintConfiguration(constrConf));
  };

  const handleDeleteConstrconf = () => {
    if (!constrConf || constrConfs.length === 1) return;
    setConstrConf(constrConf[0]);
    dispatch(deleteConstraintConfiguration(constrConf));
  };

  const defaultConstraints = useMemo(
    () => getConstrOfType('DEFAULT', constrConf, allConstraints),
    [constrConf, allConstraints],
  );
  const customConstraints = useMemo(
    () => getConstrOfType('OTHER', constrConf, allConstraints),
    [constrConf, allConstraints],
  );

  useEffect(() => {
    if (_.isEmpty(constrConfs) && !constrConf) handleCreateConstrConf();
    if (constrConf) setConstrConf(constrConf);
  }, [constrConfs, constrConf, handleCreateConstrConf]);

  return (
    <div className='constraint-manager--wrapper'>
      <ConstraintManagerTopBar
        constraintConfigurations={constrConfs}
        selectedCID={constrConf ? constrConf._id : null}
        selConstrName={constrConf ? constrConf.name : null}
        onSelect={handleSelectConstrConf}
        onCreateNew={handleCreateConstrConf}
        onSaveConstraintConfiguration={handleSaveConstrConf}
        onUpdConstrConfName={handleUpdConstrConfName}
        onDeleteConstraintConfiguration={handleDeleteConstrconf}
      />
      {constrConf && (
        <Collapse defaultActiveKey={['DEFAULT', 'CUSTOM']} bordered={false}>
          <Collapse.Panel key='DEFAULT' header='Default constraints'>
            <Table
              columns={constraintManagerTableColumns(
                handleUpdConstrConf,
                allConstraints,
                fields,
                activityDesign.objects,
              )}
              dataSource={defaultConstraints}
              rowKey='constraintId'
              pagination={false}
            />
          </Collapse.Panel>
          {hasAEBetaPermission && (
            <Collapse.Panel
              key='CUSTOM'
              header='Custom constraints'
              extra={
                <Button onClick={handleAddCustomConstraint} size='small'>
                  Add new custom constraint
                </Button>
              }
            >
              <Table
                columns={constraintManagerTableColumns(
                  handleUpdConstrConf,
                  allConstraints,
                  fields,
                  activityDesign.objects,
                )}
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
