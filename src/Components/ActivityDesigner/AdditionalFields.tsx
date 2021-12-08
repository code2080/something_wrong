import React, { useMemo } from 'react';
import { Cascader } from 'antd';

// CONSTANTS
import { ActivityDesign } from 'Models/ActivityDesign.model';
import { elementTypes } from 'Constants/elementTypes.constants';
import { isEmpty } from 'lodash';

interface Props {
  mapping: ActivityDesign;
  mappingOptions: any;
  onChange: (elementId: string[]) => void;
  disabled?: boolean;
}
const AdditionalFields = (props: Props) => {
  const { mapping, mappingOptions, onChange, disabled } = props;
  const options = useMemo(() => mappingOptions
    .map(opt => {
      return {
        ...opt,
        // Only support DATASOURCE element
        children: (opt.children || []).filter(elm => elm.elementType === elementTypes.ELEMENT_TYPE_DATASOURCE)
      }
    })
    .filter(opt => !isEmpty(opt.children))
  ,[mappingOptions])

  return (
    <div className="timing-mapping__row--wrapper">
      <div className="label">Activity type</div>
      <Cascader
        options={options}
        onChange={val => onChange(val as string[])}
        placeholder="Please select"
        disabled={disabled}
        value={mapping.additionalFields?.activityType}
        size="small"
      />
    </div>
  );
};

export default AdditionalFields;
