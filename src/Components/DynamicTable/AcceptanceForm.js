import React from 'react';
import PropTypes from 'prop-types';

import { Form, Button, Input, Select } from 'antd';

const ACCEPTANCE_STATUS_ACCEPT = 'ACCEPTED';
const ACCEPTANCE_STATUS_REJECT = 'REJECTED';

const AcceptanceForm = ({ defaultStatus, defaultComment, onSubmit, form }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        onSubmit(values.status, values.comment);
      }
    });
  }
  return (
    <Form key="acceptanceForm" onSubmit={handleSubmit}>
      <Form.Item>
        {form.getFieldDecorator('comment', {
          initialValue: defaultComment
        })(
          <Input placeholder="Comment" />
        )}
      </Form.Item>
      <Form.Item>
        {form.getFieldDecorator('status', {
          initialValue: defaultStatus
        })(
          <Select
            getPopupContainer={() => document.getElementById('te-prefs-lib')}
          >
            <Select.Option key={ACCEPTANCE_STATUS_ACCEPT} value={ACCEPTANCE_STATUS_ACCEPT}>Mark submission as accepted</Select.Option>
            <Select.Option key={ACCEPTANCE_STATUS_REJECT} value={ACCEPTANCE_STATUS_REJECT}>Mark submission as rejected</Select.Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" style={{float: 'right'}} htmlType="submit">
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
  form: PropTypes.object.isRequired,
};

export default Form.create({ name: 'acceptance-form' })(AcceptanceForm);
