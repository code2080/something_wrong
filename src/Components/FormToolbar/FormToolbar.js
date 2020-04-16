import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'antd';

// COMPONENTS
import UserAvatar from '../Avatars/UserAvatar';
import ReservationTemplateMapping from './ReservationTemplateMapping';

// STYLES
import '../../Styles/Toolbar.scss';

// CONSTANTS
const mapStateToProps = (state, ownProps) => ({
  form: state.forms[ownProps.formId],
});

const FormToolbar = ({ form }) => {
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

  return (
    <React.Fragment>
      <div className="toolbar--wrapper">
        <div className="toolbar--section-flex">
          <span className="label">By:</span>
          <UserAvatar ownerId={form.ownerId} />
        </div>
        <div className="form-toolbar--section-flex">
          <span className="label">Name:</span>
          <span className="value">{form.name}</span>
        </div>
        <div className="form-toolbar--section-flex form-description">
          <span className="label">Description:</span>
          <span className="value">{form.description}</span>
        </div>
        {form.description && form.description.length > 30 && (
          <Button type="link" onClick={() => setIsDescriptionVisible(!isDescriptionVisible)}>
            {isDescriptionVisible ? 'Hide' : 'Show all'}
          </Button>
        )}
        <div className="toolbar--section-flex adjust-right">
          <ReservationTemplateMapping formId={form._id} />
        </div>
      </div>
      {isDescriptionVisible && (
        <div className="toolbar--foldout">
          <div className="toolbar__foldout--header">Description</div>
          {form.description}
        </div>
      )}
    </React.Fragment>
  );
};

FormToolbar.propTypes = {
  form: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, null)(FormToolbar);
