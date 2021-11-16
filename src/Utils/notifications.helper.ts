import { notification } from 'antd';

export const generateJointTeachingMatchNotifications = (
  type: string,
  numberJoinTeaching?: number,
) => {
  notification[type]({
    getContainer: () => document.getElementById('te-prefs-lib'),
    getPopupContainer: () => document.getElementById('te-prefs-lib'),
    message:
      type === 'success'
        ? `${numberJoinTeaching} joint teaching matches were created`
        : type === 'warning'
        ? 'No joint teaching matches were created'
        : 'There is an error occured when generating joint teaching',
  });
};
