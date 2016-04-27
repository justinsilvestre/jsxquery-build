const path = require('path');
const expect = require('expect')
const getSchema = require('../lib/getSchema').default;

describe('getSchema', () => {
  const schemaLocation = path.join(__dirname, 'schema.jsx');
  const options = { presets: ['es2015'] };

  beforeEach(() => {
    require.cache = {};
  });

  it('gets schema', () => {
    const schema = getSchema(schemaLocation, options);

    expect('page1' in schema).toBe(true);
  });

  it('deactivates transform hook after getting schema', () => {
    const schema = getSchema(schemaLocation, options);

    expect(() => require('./jsxTest.jsx')).toThrow(SyntaxError);
  });
});
