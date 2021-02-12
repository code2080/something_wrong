import React from 'react';
import { Spin, Icon } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// SELECTORS
import { createLoadingSelector } from '../../Redux/APIStatus/apiStatus.selectors';

// CONSTANTS
import { themeColors } from '../../Constants/themeColors.constants';

const mapStateToProps = state => ({
  isSaving: createLoadingSelector(['UPDATE_MAPPING_FOR_FORM'])(state)
});

const SavingStatus = ({ isSaving }) => {
  return (
    <div style={{ color: themeColors.deepSeaGreen }}>
      {isSaving && (
        <React.Fragment>
          <Spin size='small' spinning={isSaving} />
          &nbsp;Saving
        </React.Fragment>
      )}
      {!isSaving && (
        <React.Fragment>
          <Icon type='check-circle' theme='filled' />
          &nbsp;Saved
        </React.Fragment>
      )}
    </div>
  );
};

SavingStatus.propTypes = {
  isSaving: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, null)(SavingStatus);
