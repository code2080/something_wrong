import PropTypes from 'prop-types';

// STYLES
import './ExpandedPane.scss';

const ExpandedPane = ({ columns, row }) => (
  <div className='dynamic-table--expanded__wrapper'>
    {(columns || [])
      .filter((col) => !col.hideInList && col.title && col.title !== '')
      .map((col) => {
        return (
          <div
            className='dynamic-table--expanded--item'
            key={col.key || col.dataIndex}
          >
            <div className='title'>{col.title}:</div>
            <div className='value'>
              {col.render(col.dataIndex ? row[col.dataIndex] : row)}
            </div>
          </div>
        );
      })}
  </div>
);

ExpandedPane.propTypes = {
  columns: PropTypes.array.isRequired,
  row: PropTypes.object.isRequired,
};

export default ExpandedPane;
