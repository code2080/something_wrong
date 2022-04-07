import { Alert } from 'antd';

const HasActivityInWorkerProgress = () => (
  <Alert
    style={{ margin: '8px' }}
    className='activity-designer--alert'
    type='warning'
    message='Activities are in the process of initialization'
    description={
      <>
        <div>
          Initialization of operations may take a few minutes because of the
          large amount of activities
        </div>
      </>
    }
  />
);

export default HasActivityInWorkerProgress;
