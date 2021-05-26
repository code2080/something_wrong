import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

const EditableText = ({ value, placeholder, onChange }) => {
  const [editableStr, setEditableStr] = useState(value);
  const [editing, setEditing] = useState(false);
  const inputElem = useRef();

  useEffect(() => {
    if (editing && inputElem && inputElem.current) {
      inputElem.current.focus();
    }
  }, [editing, inputElem])

  return (
    <div>
      {editing ? (
        <Input
          suffix={(
            <CheckOutlined onClick={() => { onChange(editableStr); setEditing(false) }} />
          )}
          ref={inputElem}
          value={editableStr}
          onChange={e => setEditableStr(e.target.value)}
          onPressEnter={() => {
            onChange(editableStr);
            setEditing(false);
          }}
        />
      ) : (
        <span>
          {value || placeholder}
          <Button type="link" onClick={() => setEditing(true)}>
            Edit
          </Button>
        </span>
      )}
    </div>
  );
};

EditableText.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

export default EditableText;
