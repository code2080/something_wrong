import { Spin } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CheckCircleFilled } from '@ant-design/icons';

// SELECTORS
import { createLoadingSelector } from '../../Redux/APIStatus/apiStatus.selectors';

// CONSTANTS
import { themeColors } from '../../Constants/themeColors.constants';

const mapStateToProps = (state) => ({
  isSaving: createLoadingSelector(['UPDATE_MAPPING_FOR_FORM'])(state),
});

const SavingStatus = ({ isSaving }) => {
  return (
    <div style={{ color: themeColors.deepSeaGreen }}>
      {isSaving && (
        <>
          <Spin size='small' spinning={isSaving} />
          &nbsp;Saving
        </>
      )}
      {!isSaving && (
        <>
          <CheckCircleFilled />
          &nbsp;Saved
        </>
      )}
    </div>
  );
};

SavingStatus.propTypes = {
  isSaving: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, null)(SavingStatus);
