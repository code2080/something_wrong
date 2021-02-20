import React from 'react';
import { PropTypes } from 'prop-types';
import { Collapse } from 'antd';

import './SectionExtra.scss';

import FormInfo from './FormInfo';

const FormInfoCollapse = ({ formId }) => (
  <div className='form_info--wrapper'>
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

FormInfoCollapse.propTypes = { formId: PropTypes.string };

export default FormInfoCollapse;
