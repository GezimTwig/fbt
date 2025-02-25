/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @emails i18n-tests@fb.com
 * @format
 * @typechecks
 */
/* eslint "fb-www/require-flow-strict-local": "off" */

jest.disableAutomock();

const fbt = require('fbt');

// Note that running the typechecker in jst turns on fbt preprocessing so we
// have two almost identical test files: typechecked and not typechecked.
describe('mock fbt (typechecks)', function () {
  it('should handle simple declarative strings', function () {
    expect(<fbt desc="description">some text</fbt>).toEqual('some text');
  });

  it("should handle <fbt> with embedded <fbt:param>'s", function () {
    const sample = (
      <fbt desc="description">
        {'Hello '}
        <fbt:param name="name">{'bubba'}</fbt:param>
      </fbt>
    );
    expect(sample).toEqual('Hello bubba');
  });

  it('should handle trivial strings', function () {
    expect(fbt('some text', 'description')).toEqual('some text');
  });

  it('should munge together fbt.param calls', function () {
    expect(fbt('Hello ' + fbt.param('name', 'bubba'), 'description')).toEqual(
      'Hello bubba',
    );
  });
});
