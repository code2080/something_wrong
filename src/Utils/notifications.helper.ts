import { notification } from 'antd';

export const generateJointTeachingMatchNotifications = (
  type,
  numberJoinTeaching,
) => {
  notification[type]({
    getContainer: () => document.getElementById('te-prefs-lib'),
    getPopupContainer: () => document.getElementById('te-prefs-lib'),
    message:
      type === 'success'
        ? `${numberJoinTeaching} joint teaching matches were created`
        : 'No joint teaching matches were created',
  });
};
