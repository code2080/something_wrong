import React, { ReactChild, useMemo, useCallback } from 'react';
import { DATE_FORMAT } from 'Constants/common.constants';
import moment from 'moment';
import { Divider } from 'antd';
import { capitalize, isEmpty, keyBy, pick, startCase } from 'lodash';

interface Props {
  values: any;
  filterOptions: any;
};

const ValueDisplay = ({ label, content }: {label: string, content: string | ReactChild}) => {
  return (
    <div className="filter-modal__value-display">
      <b>{capitalize(startCase(label))}:</b>
      <div>
        {content}
      </div>
    </div>
  );
};

const FilterSummary = ({ values, filterOptions }: Props) => {
  const dateDisplay = useMemo(() => {
    const { startDate, endDate } = values;
    if (!startDate && !endDate) return null;
    const dateDisplay = `${startDate ? moment(startDate).format(DATE_FORMAT) : '---'} ~ ${endDate ? moment(endDate).format(DATE_FORMAT) : '---'}`;
    return <ValueDisplay label="Date" content={dateDisplay} />
  }, [values]);

  const timeDisplay = useMemo(() => {
    const {startTime, endTime} = values;
    if (!startTime && !endTime) return null;
    const timeDisplay = `${startTime ? moment(startTime).format('HH:mm') : '---'} ~ ${endTime ? moment(endTime).format('HH:mm') : '---'}`;
    return <ValueDisplay label="Time" content={timeDisplay} />
  }, [values]);

  const otherFieldsDisplays = useMemo(() => {
    const fields = ['submitter', 'tag', 'primaryObject'];
    return fields
      .filter(key => values[key])
      .map(key => {
        const indexedOptions = keyBy((filterOptions[key] || {}), 'value');
        return (
          <ValueDisplay
            key={key}
            label={key}
            content={(
              <ul>
                {values[key].map(item => (<li key={item}>{indexedOptions[item]?.label || item}</li>))}
              </ul>
            )}
          />
        );
      });
  }, [values, filterOptions]);

  const generateObjectsDisplay = useCallback((field) => {
    const fieldValues = pick(values, Object.keys(values).filter(key => key.startsWith(`${field}.`)));
    if (isEmpty(fieldValues)) return null;
    return (
      <>
        <Divider />
        <ValueDisplay label={capitalize(field)} content={(
          <div>
            {Object.keys(fieldValues).map(key => (
              <ul key={key}>
                <li>
                  {key}
                  <ul>
                    {values[key]?.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </li>
              </ul>
            ))}
          </div>
        )} />
      </>
    )
  }, [values]);
  
  return (
    <div className="filter-modal__column">
      <div>
        <b>Selected filters</b>
      </div>
      <div className="filter-modal__box">
        {dateDisplay}
        {timeDisplay}
        {otherFieldsDisplays}
        {generateObjectsDisplay('objects')}
        {generateObjectsDisplay('fields')}
      </div>
    </div>
  )
};

export default FilterSummary;
