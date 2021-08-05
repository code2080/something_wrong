import React from 'react';

import { Row, Col, Form, Radio } from 'antd';

const CRITERIAS = [
  {
    label: 'Match all',
    value: 'ALL',
  },
  {
    label: 'Match one',
    value: 'SOME',
  },
];
const MODES = [
  {
    label: 'Single activity',
    value: 'SINGLE',
  },
  {
    label: 'All in submission',
    value: 'ALL',
  },
];
const FilterSettings = () => {
  return (
    <div>
      <div>
        <b>Filter settings</b>
      </div>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label='Match criteria' name='matchCriteria'>
            <Radio.Group>
              {CRITERIAS.map((criteria) => (
                <Radio key={criteria.value} value={criteria.value}>
                  {criteria.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item
            label='Include full submission for matching activity'
            name='includeSubmission'
          >
            <Radio.Group>
              {MODES.map((criteria) => (
                <Radio key={criteria.value} value={criteria.value}>
                  {criteria.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default FilterSettings;
