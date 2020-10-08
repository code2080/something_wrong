import React from 'react';
import { useSelector } from 'react-redux';
import { Collapse } from 'antd';

import './SectionExtra.scss'

// SELECTORS
import { selectForm } from '../../Redux/Forms/forms.selectors';

const FormInfo = ({formId}) => {
  const formInfo = useSelector(selectForm(formId));

  return (
    <div className="selection-settings--wrapper">
      {Object.entries(formInfo).map(([key, value]) => `***${key}: ${value}***`)}
    </div>)
}


const FormInfoCollapse = ({ formId }) => {

  return (
    <div className="form_info--wrapper">
      <Collapse bordered={false}>
        <Collapse.Panel
          header={'Form information'}
          key={'FORM_INFO'}
        >
          <FormInfo formId={formId} />
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default FormInfoCollapse;