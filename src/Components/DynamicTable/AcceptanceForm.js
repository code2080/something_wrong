import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Select, Form } from 'antd';

const ACCEPTANCE_STATUS_ACCEPT = 'ACCEPTED';
const ACCEPTANCE_STATUS_REJECT = 'REJECTED';

const AcceptanceForm = ({ defaultStatus, defaultComment, onSubmit }) => {
  const [status, setStatus] = useState(defaultStatus);
  const [comment, setComment] = useState(defaultComment);

  const handleSubmit = () => {
    onSubmit(status, comment);
  };

  return (
    <Form key='acceptanceForm' onSubmit={handleSubmit}>
      <Form.Item>
        <Input placeholder='Comment' value={comment} onChange={e => setComment(e.target.value)}/>
      </Form.Item>
      <Form.Item>
        <Select
          getPopupContainer={() => document.getElementById('te-prefs-lib')}
          value={status}
          onChange={val => setStatus(val)}
        >
          <Select.Option key={ACCEPTANCE_STATUS_ACCEPT} value={ACCEPTANCE_STATUS_ACCEPT}>Mark submission as accepted</Select.Option>
          <Select.Option key={ACCEPTANCE_STATUS_REJECT} value={ACCEPTANCE_STATUS_REJECT}>Mark submission as rejected</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type='primary' style={{ float: 'right' }} onClick={handleSubmit}>
          Done
        </Button>
      </Form.Item>
    </Form>
  );
};

AcceptanceForm.propTypes = {
  defaultStatus: PropTypes.string.isRequired,
  defaultComment: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};

export default AcceptanceForm;
