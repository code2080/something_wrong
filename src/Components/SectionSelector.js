import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Radio } from 'antd';

// CONSTANTS
const mapStateToProps = (state, ownProps) => {
  const { match: { params: { formId } } } = ownProps;
  return {
    sections: state.forms[formId].sections,
  };
};

const SectionSelector = ({ sections, selectedSection, onSectionChange }) => {
  return (
    <div className="section-selector--wrapper" style={{ marginBottom: '1.2rem' }}>
      <span style={{ marginRight: '0.4rem', color: 'rgb(128, 128, 128)' }}>View sections:</span>
      <Radio.Group
        onChange={e => onSectionChange(e.target.value)}
        defaultValue={selectedSection}
        size="small"
      >
        <Radio.Button value="ALL_SECTIONS">All sections</Radio.Button>
        {sections.map(el => (
          <Radio.Button key={el._id} value={el._id}>{el.name}</Radio.Button>
        ))}
      </Radio.Group>
    </div>
  );
};

SectionSelector.propTypes = {
  sections: PropTypes.array.isRequired,
  selectedSection: PropTypes.string.isRequired,
  onSectionChange: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, null)(SectionSelector));
