import { notification } from 'antd';

export const generateJointTeachingMatchNotifications = (type, numberJoinTeaching) => {
  switch (type) {
    case 'success':
      notification[type]({
        message: `${numberJoinTeaching} joint teaching matches were created`,
      });
      break;
    case 'warning':
      notification[type]({
        message: 'No joint teaching matches were created',
      });
      break;
  }
};

