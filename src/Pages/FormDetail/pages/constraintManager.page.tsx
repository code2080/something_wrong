import React, { useMemo, useState } from 'react';
import { Button, Empty, Collapse, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
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
  config: any,
  allConstraints: TConstraint[]
) => {
  if (!config || !config.constraints || !allConstraints) return [];
  return config.constraints.filter((el: TConstraintInstance) => {
    const c = allConstraints.find((c) => el.constraintId === c.constraintId);
    if (!c || c.type !== type) return false;
    return true;
  });
};

const ConstraintManagerPage = () => {
  const dispatch = useDispatch();
  const { formId }: { formId: string } = useParams();
  const allConstraints: TConstraint[] = useSelector(selectConstraints);
  const constraintConfigurations = useSelector(
    selectConstraintConfigurationsForForm
  )(formId);

  /**
   * STATE
   */
  const [
    constraintConfiguration,
    setConstraintConfiguration
  ] = useState<TConstraintConfiguration | null>(null);

  /**
   * EVENT HANDLERS
   */
  const onSelectConstraintConfiguration = (cid: string) => {
    const constraintConfig = constraintConfigurations.find(
      (el) => el._id === cid
    );
    if (constraintConfig) setConstraintConfiguration(constraintConfig);
  };

  const onUpdateConstraintConfiguration = (
    constraintId: string,
    prop: string,
    value: any
  ) => {
    if (!constraintConfiguration) return;
    const constraintInstanceIdx = constraintConfiguration.constraints.findIndex(
      (el) => el.constraintId === constraintId
    );
    if (constraintInstanceIdx === -1) return;
    setConstraintConfiguration({
      ...constraintConfiguration,
      constraints: [
        ...constraintConfiguration.constraints.slice(0, constraintInstanceIdx),
        {
          ...constraintConfiguration.constraints[constraintInstanceIdx],
          [prop]: value
        },
        ...constraintConfiguration.constraints.slice(
          0,
          constraintInstanceIdx + 1
        )
      ]
    });
  };

  const onAddCustomConstraint = (e) => {
    e.stopPropagation();
  };

  const onCreateNewConstraintConfiguration = () => {
    const newConstraintConfig = ConstraintConfiguration.create({
      _id: 'new',
      formId,
      name: 'New constraint configuration',
      constraints: allConstraints
        .filter((el: TConstraint) => el.type === EConstraintType.OTHER)
        .map((el: TConstraint) => ConstraintInstance.createFromConstraint(el))
    });
    setConstraintConfiguration(newConstraintConfig);
  };

  const onSaveConstraintConfiguration = () => {
    dispatch(updateConstraintConfiguration(constraintConfiguration));
  };

  const onDeleteConstraintConfiguration = () => {
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
  console.log(constraintConfiguration);
  return (
    <React.Fragment>
      <div className='constraint-manager--wrapper'>
        <ConstraintManagerTopBar
          constraintConfigurations={constraintConfigurations}
          selectedCID={
            constraintConfiguration ? constraintConfiguration._id : null
          }
          onSelect={onSelectConstraintConfiguration}
          onCreateNew={onCreateNewConstraintConfiguration}
          onSaveConstraintConfiguration={onSaveConstraintConfiguration}
          onDeleteConstraintConfiguration={onDeleteConstraintConfiguration}
        />
        {constraintConfiguration && (
          <Collapse defaultActiveKey={['DEFAULT', 'CUSTOM']} bordered={false}>
            <Collapse.Panel key='DEFAULT' header='Default constraints'>
              <Table
                columns={constraintManagerTableColumns(
                  onUpdateConstraintConfiguration
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
                <Button onClick={onAddCustomConstraint} size='small'>
                  Add new custom constraint
                </Button>
              }
            >
              <Table
                columns={constraintManagerTableColumns(
                  onUpdateConstraintConfiguration
                )}
                dataSource={customConstraints}
                rowKey='constraintId'
                pagination={false}
              />
            </Collapse.Panel>
          </Collapse>
        )}
        {!!constraintConfigurations && constraintConfiguration == null && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description='No constraint configurations exist for this form'
          >
            <Button
              size='small'
              type='primary'
              onClick={onCreateNewConstraintConfiguration}
            >
              Create now
            </Button>
          </Empty>
        )}
        {!constraintConfiguration &&
          constraintConfigurations &&
          !!constraintConfigurations.length && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description='No constraint configurations selected'
          />
        )}
      </div>
    </React.Fragment>
  );
};

ConstraintManagerPage.propTypes = {
  constraintConfigurationId: PropTypes.string
};
export default ConstraintManagerPage;
