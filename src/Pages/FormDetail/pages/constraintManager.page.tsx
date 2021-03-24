/* eslint-disable no-extra-boolean-cast */
import React, { useMemo, useState, useEffect } from 'react';
import _ from 'lodash';
import { Button, Empty, Collapse, Table } from 'antd';
import { useSelector, useDispatch} from 'react-redux';
import { useParams } from 'react-router-dom';

// COMPONENTS
import ConstraintManagerTopBar from '../../../Components/ConstraintManagerTopBar/ConstraintManagerTopBar';

// ACTIONS
import { updateConstraintConfiguration, createConstraintConfigurations, deleteConstraintConfiguration } from '../../../Redux/ConstraintConfigurations/constraintConfigurations.actions';


// SELECTORS
import { selectConstraints } from '../../../Redux/Constraints/constraints.selectors';
import { selectConstraintConfigurationsForForm } from '../../../Redux/ConstraintConfigurations/constraintConfigurations.selectors';
import {
  ConstraintConfiguration,
  ConstraintInstance,
  TConstraintConfiguration,
  TConstraintInstance,
} from '../../../Types/ConstraintConfiguration.type';
import { EConstraintType, TConstraint } from '../../../Types/Constraint.type';

// CONSTANTS
import constraintManagerTableColumns from '../../../Components/ConstraintManagerTable/ConstraintManagerTableColumns';

const getConstrOfType = (
  type: string = 'DEFAULT',
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
  const constrConfs: TConstraintConfiguration[] = Object.values(
    useSelector(selectConstraintConfigurationsForForm(formId))
  );
  
  /**
   * STATE
   */
  const [
    constrConf,
    setConstrConf,
  ] = useState<TConstraintConfiguration | null>(null);


  useEffect(
    () => {
      setConstrConf(constrConfs.slice(-1)[0])
    },
    [constrConfs.length]
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
      name: value
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

  const handleCreateConstrConf = () => {
    const newConstrConf = ConstraintConfiguration.create({
      formId,
      name: 'New constraint configuration',
      constraints: (allConstraints || [])
        .filter(
          (constraint: TConstraint) =>
            constraint.type === EConstraintType.DEFAULT,
        )
        .map((constraint: TConstraint) =>
          ConstraintInstance.createFromConstraint(constraint),
        ),
    });
    dispatch(createConstraintConfigurations(newConstrConf))
  };

  const handleSaveConstrConf = () => {
    if(!constrConf) return;
    dispatch(updateConstraintConfiguration(constrConf));
  };

  const handleDeleteConstrconf = () => {
    if(!constrConf) return
    setConstrConf(constrConf[0])
    dispatch(deleteConstraintConfiguration(constrConf))
  };

  const defaultConstraints = useMemo(
    () =>
      getConstrOfType('DEFAULT', constrConf, allConstraints),
    [constrConf, allConstraints],
  );
  const customConstraints = useMemo(
    () =>
      getConstrOfType('OTHER', constrConf, allConstraints),
    [constrConf, allConstraints],
  );
  return (
    <div className='constraint-manager--wrapper'>
      <ConstraintManagerTopBar
        constraintConfigurations={constrConfs}
        selectedCID={
          constrConf ? constrConf._id : null
        }
        selConstrName={
          constrConf ? constrConf.name : null
        }
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
              )}
              dataSource={defaultConstraints}
              rowKey='constraintId'
              pagination={false}
            />
          </Collapse.Panel>
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
              )}
              dataSource={customConstraints}
              rowKey='constraintId'
              pagination={false}
            />
          </Collapse.Panel>
        </Collapse>
      )}
      {_.isEmpty(constrConfs) && !constrConf && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description='No constraint configurations exist for this form'
        >
          <Button
            size='small'
            type='primary'
            onClick={handleCreateConstrConf}
          >
            Create now
          </Button>
        </Empty>
      )}
      {!constrConf && !_.isEmpty(constrConfs) && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description='No constraint configurations selected'
        />
      )}
    </div>
  );
};

export default ConstraintManagerPage;
