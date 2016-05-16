var jsxQuery = require('jsxquery');
var ComponentWithPropFunction = require('./ComponentWithPropFunction.jsx')
var ComponentWithJustMarkup = require('./ComponentWithJustMarkup.jsx')
var ComponentWithMutableProps = require('./ComponentWithMutableProps.jsx')

module.exports = {
  existingPage1: <ComponentWithPropFunction />, // or like this?: [ComponentWithPropFunction, { prop1: someVal, ... }]
  existingFolder1: {
    existingPage2: <ComponentWithPropFunction />,
    existingSubfolder1: {
      existingPage3: <ComponentWithPropFunction />
    }
  },
  page1: <ComponentWithPropFunction />, // or like this?: [ComponentWithPropFunction, { prop1: someVal, ... }]
  folder1: {
    page2: <ComponentWithPropFunction />,
    subfolder1: {
      page3: <ComponentWithPropFunction />,
    },
  },
  noScripts: <ComponentWithJustMarkup />,
  propFunction: <ComponentWithPropFunction />,
  mutableProps: <ComponentWithMutableProps />,
  
  'notAJsp.html': <ComponentWithPropFunction />,
};
