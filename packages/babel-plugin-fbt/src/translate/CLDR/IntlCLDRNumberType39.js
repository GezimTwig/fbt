/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @generated SignedSource<<91c020d681e9384c8f25fbb732c92654>>
 *
 * Generated by LanguageCLDRGenScript
 * @codegen-command: flib/intern/scripts/intl/cldr/gencode_all_plurals.sh
 *
 * @flow strict
 */

'use strict';

import type {IntlVariationsEnum} from '../IntlVariations';

const IntlCLDRNumberType39 = {
  getNumberVariations(): Array<IntlVariationsEnum> {
    // $FlowExpectedError[incompatible-return] Force cast numbers to IntlVariationsEnum
    return [24];
  },

  getFallback(): IntlVariationsEnum {
    // $FlowExpectedError[incompatible-return] Force cast number to IntlVariationsEnum
    return 24;
  }
};

module.exports = IntlCLDRNumberType39;
