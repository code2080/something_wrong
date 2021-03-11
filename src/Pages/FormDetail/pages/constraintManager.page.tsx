import React, { useMemo, useState } from 'react';

import _ from 'lodash';
import { Button, Empty, Collapse, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// COMPONENTS
import ConstraintManagerTopBar from '../../../Components/ConstraintManagerTopBar/ConstraintManagerTopBar';

// ACTIONS
import { updateConstraintConfiguration } from '../../../Redux/ConstraintConfigurations/constraintConfigurations.actions';

// SELECTORS
import { selectConstraints } from '../../../Redux/Constraints/constraints.selectors';
import { selectConstraintConfigurationsForForm } from '../../../Redux/ConstraintConfigurations/constraintConfigurations.selectors';
import {
  ConstraintConfiguration,
  ConstraintInstance,
  TConstraintConfiguration,
  TConstraintInstance
} from '../../../Types/ConstraintConfiguration.type';
import { EConstraintType, TConstraint } from '../../../Types/Constraint.type';

// CONSTANTS
import constraintManagerTableColumns from '../../../Components/ConstraintManagerTable/ConstraintManagerTableColumns';

const getConstraintsOfType = (
  type: string = 'DEFAULT',
  config: TConstraintConfiguration | null,
  allConstraints: TConstraint[]
): TConstraintInstance[] => {
  if (!config?.constraints || _.isEmpty(allConstraints)) return [];
  return config.constraints.filter((constraintInstance: TConstraintInstance) => {
    const c = allConstraints.find((constraint) => constraintInstance.constraintId === constraint.constraintId);
    return c?.type === type;
  });
};

const ConstraintManagerPage = () => {
  const dispatch = useDispatch();
  const { formId }: { formId: string } = useParams();
  const allConstraints: TConstraint[] = useSelector(selectConstraints);
  const constraintConfigurations: TConstraintConfiguration[] = useSelector(selectConstraintConfigurationsForForm)(formId);

  /**
   * STATE
   */
  const [constraintConfiguration, setConstraintConfiguration] = useState<TConstraintConfiguration | null>(null);

  /**
   * EVENT HANDLERS
   */
  const handleSelectConstraintConfiguration = (cid: string): void => {
    const constraintConfig = constraintConfigurations.find(
      (constraintConfig) => constraintConfig._id === cid
    );
    if (constraintConfig) setConstraintConfiguration(constraintConfig);
  };

  const handleUpdateConstraintConfiguration = (
    constraintId: string,
    prop: string,
    value: any
  ): void => {
    if (!constraintConfiguration) return;
    const { constraints } = constraintConfiguration;

    setConstraintConfiguration({
      ...constraintConfiguration,
      constraints: constraints.map((constraintInstance) => constraintInstance.constraintId === constraintId
        ? {
          ...constraintInstance,
          [prop]: value
        }
        : constraintInstance)
    });
  };

  const handleAddCustomConstraint = (e) => {
    e.stopPropagation();
  };

  const handleCreateNewConstraintConfiguration = () => {
    const newConstraintConfig = ConstraintConfiguration.create({
      _id: 'new',
      formId,
      name: 'New constraint configuration',
      constraints: allConstraints
        .filter((constraint: TConstraint) => constraint.type === EConstraintType.DEFAULT)
        .map((constraint: TConstraint) => ConstraintInstance.createFromConstraint(constraint))
    });
    setConstraintConfiguration(newConstraintConfig);
  };

  const handleSaveConstraintConfiguration = () => {
    dispatch(updateConstraintConfiguration(constraintConfiguration));
  };

  const handleDeleteConstraintConfiguration = () => {
    console.log('should delete');
  };

  const defaultConstraints = useMemo(
    () =>
      getConstraintsOfType('DEFAULT', constraintConfiguration, allConstraints),
    [constraintConfiguration, allConstraints]
  );
  const customConstraints = useMemo(
    () =>
      getConstraintsOfType('OTHER', constraintConfiguration, allConstraints),
    [constraintConfiguration, allConstraints]
  );

  return (
    <div className='constraint-manager--wrapper'>
      <ConstraintManagerTopBar
        constraintConfigurations={constraintConfigurations}
        selectedCID={
          constraintConfiguration ? constraintConfiguration._id : null
        }
        onSelect={handleSelectConstraintConfiguration}
        onCreateNew={handleCreateNewConstraintConfiguration}
        onSaveConstraintConfiguration={handleSaveConstraintConfiguration}
        onDeleteConstraintConfiguration={handleDeleteConstraintConfiguration}
      />
      {constraintConfiguration && (
        <Collapse defaultActiveKey={['DEFAULT', 'CUSTOM']} bordered={false}>
          <Collapse.Panel key='DEFAULT' header='Default constraints'>
            <Table
              columns={constraintManagerTableColumns(
                handleUpdateConstraintConfiguration
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
                handleUpdateConstraintConfiguration
              )}
              dataSource={customConstraints}
              rowKey='constraintId'
              pagination={false}
            />
          </Collapse.Panel>
        </Collapse>
      )}
      {_.isEmpty(constraintConfigurations) && constraintConfiguration == null && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description='No constraint configurations exist for this form'
        >
          <Button
            size='small'
            type='primary'
            onClick={handleCreateNewConstraintConfiguration}
          >
              Create now
          </Button>
        </Empty>
      )}
      {!constraintConfiguration &&
          !_.isEmpty(constraintConfigurations) &&
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description='No constraint configurations selected'
            />
      }
    </div>
  );
};

export default ConstraintManagerPage;
