import { notification } from 'antd';

const message = (type: string, numberJointTeaching?: number) => {
  const options = {
    success: `${numberJointTeaching ?? 0} joint teaching matches were created`,
    warning: 'No joint teaching matches were created',
  };
  return (
    options[type] ?? 'An error occured while generating joint teaching matches'
  );
};

export const generateJointTeachingMatchNotifications = (
  type: string,
  numberJointTeaching?: number,
) => {
  notification[type]({
    getContainer: () => document.getElementById('te-prefs-lib'),
    getPopupContainer: () => document.getElementById('te-prefs-lib'),
    message: message(type, numberJointTeaching),
  });
};
