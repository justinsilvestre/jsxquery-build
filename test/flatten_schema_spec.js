const path = require('path');
const expect = require('expect')
const requireJsxQuery = require('../lib/requireJsxQuery').default;
const flattenSchema = require('../lib/flattenSchema').default;

describe('flattenSchema', () => {
  const schemaLocation = path.join(__dirname, 'schema.jsx');
  const options = { presets: ['es2015'] };
  const schema = requireJsxQuery(schemaLocation, options);

  it('flattens schema', () => {
    const flattenedSchema = flattenSchema(schema);

    expect(flattenedSchema).toContain({
      'page1': schema.page1,
      'folder1/page2': schema.folder1.page2,
      'folder1/subfolder1/page3': schema.folder1.subfolder1.page3
    });
  });
});
