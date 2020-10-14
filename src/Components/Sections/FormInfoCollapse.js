import React from 'react';
import { Collapse } from 'antd';

import './SectionExtra.scss'

import FormInfo from './FormInfo';

const FormInfoCollapse = ({ formId }) => (
  <div className="form_info--wrapper">
    <Collapse>
      <Collapse.Panel
        header={'Form information'}
        key={'FORM_INFO'}
      >
        <FormInfo formId={formId} />
      </Collapse.Panel>
    </Collapse>
  </div>
);

export default FormInfoCollapse;