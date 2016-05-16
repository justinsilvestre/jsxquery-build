const path = require('path');
const expect = require('expect')
const build = require('../lib/index');
const print = require('../lib/print');
const stamps = require('../lib/autogenerationStamps');
const fs = require('fs');
const mkdirp = require('mkdirp');
const rmrf = require('rimraf');
const ioUtils = require('../lib/ioUtils')
require('mocha-sinon');

const schemaPath = path.join(__dirname, 'schema.jsx')
const tmpDirectory = path.join(__dirname, '..', 'tmp')
const scriptsOutputDirectory = path.join(__dirname, '..', 'tmp', 'scripts');
const markupOutputDirectory = path.join(__dirname, '..', 'tmp', 'markup');

const sysAgnosticPath = relativePath => path.join(markupOutputDirectory, ...relativePath.split('/'))
const existingMarkupFilePaths = [
  'existingPage1.jsp',
  'existingFolder1/existingPage2.jsp',
  'existingFolder1/existingSubfolder1/existingPage3.jsp',
].map(sysAgnosticPath);
const absentMarkupFilePaths = [
  'page1.jsp',
  'folder1/page2.jsp',
  'folder1/subfolder1/page3.jsp',
].map(sysAgnosticPath);

function expectToBePrinted(args, callback) {
  try {
    expect(print.default.calledWith.apply(print.default, args)).toBe(true)
  } catch(err) {
    callback(err)
  }
}

describe('jsxQueryBuild', () => {

  // delete folders if they exist
  beforeEach(done => rmrf(tmpDirectory, done))

  // create folders
  beforeEach(done => mkdirp(scriptsOutputDirectory, done));
  beforeEach(done => mkdirp(path.join(markupOutputDirectory, 'existingFolder1', 'existingSubfolder1'), done));

  // create files
  existingMarkupFilePaths.forEach((fullPath, i) => {
    const contents = 'This content should be preserved.\n' + stamps.jsp('elementOrComponentName') + 'This content should get overwritten.';
    beforeEach(done =>
      fs.writeFile(fullPath, contents, done)
    )
  });

  // stub console.log
  beforeEach(function() {
    /* swap these lines to see console output when you run tests */
    this.sinon.stub(print, 'default');   /*
    this.sinon.spy(print, 'default');    /*
    */ 
  })

  it('tells when existing file is overwritten', function(done) {
    build(schemaPath, { scriptsOutputDirectory, markupOutputDirectory,
      success: () => {
        existingMarkupFilePaths.forEach((existingMarkupFile) => {
          expectToBePrinted(['Overwriting file', existingMarkupFile], done);       
        })
        done();
      }
    });
  });

  it('tells when new file is created', done => {
    build(schemaPath, { scriptsOutputDirectory, markupOutputDirectory,
      success: () => {
        absentMarkupFilePaths.forEach((absentMarkupFile) => {
          expectToBePrinted(['Creating file', absentMarkupFile], done);       
        })
        done();
      }
    });
  });

  it('preserves code up until stamp', done => {
    build(schemaPath, { scriptsOutputDirectory, markupOutputDirectory,
      success: () => {
        Promise.all(existingMarkupFilePaths.map(existingMarkupFile =>
          ioUtils.getCurrentContents(existingMarkupFile)
        )).then(fileContentsArray => {
            fileContentsArray.map(obj => obj.currentContents).forEach(code => expect(code).toContain('This content should be preserved'))
            done();
        }).catch(done);
      }
    })
  })

  it('changes code after stamp', (done) => {
    build(schemaPath, { scriptsOutputDirectory, markupOutputDirectory,
      success: () => {
        Promise.all(existingMarkupFilePaths.map(existingMarkupFile =>
          ioUtils.getCurrentContents(existingMarkupFile)
        )).then(fileContentsArray => {
            fileContentsArray.map(obj => obj.currentContents).forEach(code => expect(code).toNotContain('This content should get overwritten'))
            done();
        }).catch(done);
      }
    })
  });

  describe('on attempt to overwrite existing file not containing stamp', () => {
    beforeEach(done => {
      ioUtils.writeFile(existingMarkupFilePaths[0], 'This file contains no stamps')
      .then(() => done())
    })

    it('aborts build if forceOverwrite option is not true', (done) => {
      build(schemaPath, { scriptsOutputDirectory, markupOutputDirectory,
        forceOverwrite: false,
        error: () => done(),
        success: () => done(new Error('This should not have completed!')),
      });
    });

    it('executes build if forceOverwrite option is true', (done) => {
      build(schemaPath, { scriptsOutputDirectory, markupOutputDirectory,
        forceOverwrite: true,
        error: done,
        success: () => done(),
      });
    });
  });

  it('creates JS files for components with mutable props', (done) => {
    build(schemaPath, { scriptsOutputDirectory, markupOutputDirectory,
      success: () => {
        fs.stat(path.join(scriptsOutputDirectory, 'mutableProps.js'), (err, stats) => {
          expect(stats && stats.isFile()).toBe(true);
          done();
        });
      },
    });
  });

  it('creates JS files for components with prop functions', (done) => {
    build(schemaPath, { scriptsOutputDirectory, markupOutputDirectory,
      success: () => {
        fs.stat(path.join(scriptsOutputDirectory, 'propFunction.js'), (err, stats) => {
          expect(stats && stats.isFile()).toBe(true);
          done();
        });
      },
    });
  });

  it('creates no JS files for components without mutable props or prop functions', (done) => {
    build(schemaPath, { scriptsOutputDirectory, markupOutputDirectory,
      success: () => {
        fs.stat(path.join(scriptsOutputDirectory, 'noScripts.js'), (err, stats) => {
          expect(err.code).toEqual('ENOENT');
          done();
        });
      },
    });
  });

  it('creates a non-JSP file when a different file extension is given', (done) => {
    build(schemaPath, { scriptsOutputDirectory, markupOutputDirectory,
      success: () => {
        fs.stat(path.join(markupOutputDirectory, 'notAJsp.html'), (err, stats) => {
          if (err)
            throw err;
          
          done();
        });
      },
    });
  })
});
