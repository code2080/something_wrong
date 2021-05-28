import { useEffect, useRef, useState } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { Button, Input } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

const propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const EditableText = ({
  value,
  placeholder,
  onChange,
}: InferProps<typeof propTypes>) => {
  const [editableStr, setEditableStr] = useState(value);
  const [editing, setEditing] = useState(false);
  const inputElem = useRef<Input | null>(null);

  useEffect(() => {
    if (editing) {
      inputElem?.current?.focus();
    }
  }, [editing, inputElem]);

  return (
    <div>
      {editing ? (
        <Input
          suffix={
            <CheckOutlined
              onClick={() => {
                onChange(editableStr);
                setEditing(false);
              }}
            />
          }
          ref={inputElem}
          value={editableStr ?? ''}
          onChange={(e) => setEditableStr(e.target.value)}
          onPressEnter={() => {
            onChange(editableStr);
            setEditing(false);
          }}
        />
      ) : (
        <span>
          {value || placeholder}
          <Button type='link' onClick={() => setEditing(true)}>
            Edit
          </Button>
        </span>
      )}
    </div>
  );
};

EditableText.propTypes = propTypes;

export default EditableText;
