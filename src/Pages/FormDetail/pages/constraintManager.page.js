import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import ConstraintManagerTopBar from '../../../Components/ConstraintManagerTopBar/ConstraintManagerTopBar';
import ConstraintManagerTable from '../../../Components/ConstraintManagerTable/ConstraintManagerTable';
import { selectConstraintConfigurations } from '../../../Redux/Constraints/constraints.selectors';
import PropTypes from 'prop-types';
import {
  fetchConstraintConfigurations,
  updateConstraintConfiguration
} from '../../../Redux/Constraints/constraints.actions';

import { useParams } from 'react-router-dom';

const ConstraintManagerPage = ({ constraintConfigurationId }) => {
  /* Unneeded? :/
  const constraintConfigs = useSelector(
    selectConstraintConfigurations(constraintConfigurationId)
  );
*/

  const [availableConstraintConfigs, setAvailableConstraintConfigs] = useState(
    []
  );
  const [
    selectedConstraintConfiguration,
    setSelectedConstraintConfiguration
  ] = useState({});

  const handleSelect = (constraintConfigId) => {
    availableConstraintConfigs.forEach((config) => {
      if (config._id === constraintConfigId) {
        setSelectedConstraintConfiguration(config);
      }
    });
  };

  const onAddCustomConstraintConf = (e) => {
    e.stopPropagation();
  };

  const handleCreateNew = () => {
    console.log(availableConstraintConfigs);
    return {};
  };
  const handleSaveConstraintConfiguration = () => {
    console.log(selectedConstraintConfiguration);
    // dispatch(updateConstraintConfiguration(selectedConstraintConfiguration));
  };

  const dispatch = useDispatch();
  const { formId } = useParams();
  useEffect(() => {
    dispatch(fetchConstraintConfigurations(formId)).then((payload) => {
      setAvailableConstraintConfigs(payload);
    });
  }, [formId]);
  return (
    <React.Fragment>
      <div className="constraint-manager--wrapper">
        <ConstraintManagerTopBar
          constraintConfigurations={availableConstraintConfigs}
          onSelect={handleSelect}
          onCreateNew={handleCreateNew}
          onSaveConstraintConfiguration={handleSaveConstraintConfiguration}
        />
        <ConstraintManagerTable
          renderSectionHeader={
            <div className="SectionHeader">
              <span>{'Default Constraints'}</span>
            </div>
          }
          constraints={selectedConstraintConfiguration.constraints}
        />
        <ConstraintManagerTable
          renderSectionHeader={
            <div className="SectionHeader">
              <span>{'Other Constraints'}</span>{' '}
              <Button onClick={onAddCustomConstraintConf}>
                Add new custom constraint
              </Button>
            </div>
          }
          constraints={selectedConstraintConfiguration.constraints}
        />
      </div>
    </React.Fragment>
  );
};

ConstraintManagerPage.propTypes = {
  constraintConfigurationId: PropTypes.string
};
export default ConstraintManagerPage;
