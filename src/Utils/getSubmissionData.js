/**
 * @function getSubmissionData
 * @description extracts data from an arbitrary number of submissions based on an arbitrary set of columns
 * @param {Array<Object>} submissions the submissions to process
 * @param {Array<Object<} cols the columns to extract values from
 */

export const getSubmissionData = (submissions, cols) => {
  /**
   * @important function assumes all values to be processed are in SECTION_VERTICALs
   */
  return submissions.reduce(
    (extractedData, submission) => {
      const { values } = submission;
      return {
        ...extractedData,
        [submission._id]: (cols || []).reduce((row, col) => {
          const { sectionId, dataIndex: elementId } = col;
          // Loop through alues to find right elementIdx
          const elementIdx = values[sectionId] ? values[sectionId].findIndex(el => el.elementId === elementId) : -1;
          if (elementIdx === -1) return row;
          return { ...row, [elementId]: values[sectionId][elementIdx].value };
        }, {}),
      };
    },
    {}
  );
};
