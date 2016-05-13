const path = require('path');
const expect = require('expect')
const requireJsxQuery = require('../lib/requireJsxQuery').default;

describe('requireJsxQuery', () => {
  const schemaLocation = path.join(__dirname, 'schema.jsx');
  const options = { presets: ['es2015'] };

  beforeEach(() => {
    require.cache = {};
  });

  it('gets jsxQuery', () => {
    const schema = requireJsxQuery(schemaLocation, options);

    expect('page1' in schema).toBe(true);
  });

  it('deactivates transform hook after getting schema', () => {
    const schema = requireJsxQuery(schemaLocation, options);

    expect(() => require('./jsxTest.jsx')).toThrow(SyntaxError);
  });
});
