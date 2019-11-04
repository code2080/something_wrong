import React from 'react'
// import PropTypes from 'prop-types'
import { Button } from 'antd'

// import styles from './styles.css'
import 'antd/dist/antd.css'

const TEPrefsLib = () => (
  <Button onClick={() => console.log('Clicked with antd')}>Should log Clicked with antd to console</Button>
);

export default TEPrefsLib

/*
export default class ExampleComponent extends Component {
  static propTypes = {
    text: PropTypes.string
  }

  render() {
    const {
      text
    } = this.props

    return (
      <React.Fragment>
        <Button onClick={() => console.log('test')}>Click me</Button>
        <div className={styles.test}>
          Example Component: {text}
        </div>
      </React.Fragment>
    )
  }
}
*/
