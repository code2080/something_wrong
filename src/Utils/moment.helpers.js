export const minToHourMinDisplay = totalMin => {
  const minutes = totalMin % 60;
  const totalHours = (totalMin - minutes) / 60;
  const days = Math.max(Math.ceil(totalHours / 24) - 1, 0);
  const hours = totalHours - days * 24;
  return {
    minutes: minutes < 10 ? `0${minutes}` : minutes,
    hours,
    days,
  };
};
