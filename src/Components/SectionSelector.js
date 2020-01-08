import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Dropdown, Menu, Button, Icon, Checkbox } from 'antd';

// CONSTANTS
const mapStateToProps = (state, ownProps) => {
  const { match: { params: { formId } } } = ownProps;
  return {
    sections: state.forms[formId].sections,
  };
};

const SectionSelector = ({ sections, selectedSection, onSectionChange }) => {
  const handleMenuClick = ({ key }) => onSectionChange(key);

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="ALL_SECTIONS">
        <span>Select all</span>
      </Menu.Item>
      <Menu.Item key="SELECT_NONE">
        <span>Deselect all</span>
      </Menu.Item>
      <Menu.Divider />
      {sections.map(el => (
        <Menu.Item key={el._id} value={el._id}>
          <Checkbox
            checked={selectedSection === el._id || selectedSection === 'ALL_SECTIONS'}
          >
            {el.name}
          </Checkbox>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className="section-selector--wrapper">
      <Dropdown
        overlay={menu}
        trigger={['click']}
        getPopupContainer={() => document.getElementById('te-prefs-lib')}
      >
        <Button type="link">
          View sections <Icon type="down" />
        </Button>
      </Dropdown>,
    </div>
  );
};

SectionSelector.propTypes = {
  sections: PropTypes.array.isRequired,
  selectedSection: PropTypes.string.isRequired,
  onSectionChange: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, null)(SectionSelector));

/**
 * <span style={{ marginRight: '0.4rem', color: 'rgb(128, 128, 128)' }}>View sections:</span>
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
 */
