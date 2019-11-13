import {
  SECTION_VERTICAL,
  SECTION_TABLE,
  SECTION_CONNECTED
} from '../Constants/sectionTypes.constants';

export const determineSectionType = section => {
  if (section.isConnected) return SECTION_CONNECTED;
  if (section.settings && section.settings.hasMultipleValues)
    return SECTION_TABLE;
  return SECTION_VERTICAL;
};
