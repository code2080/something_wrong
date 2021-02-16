import React from 'react';
import '!style-loader!css-loader!sass-loader!../dist/dist/te-prefs-lib.css';

export const decorators = [(Story) => <div className='te-prefs-lib' id='te-prefs-lib' ><Story /></div>];
