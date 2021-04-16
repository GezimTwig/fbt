/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @emails oncall+internationalization
 * @flow
 */
/*eslint max-len: ["error", 100]*/
/* eslint-disable brace-style */ // Needed due to Flow types inlined in comments

'use strict';

/*::
import type {SVArgsList} from './FbtArguments';
import type {ValidPronounUsagesKey} from '../FbtConstants';
import type {GenderConstEnum} from '../Gender';
import type {FromBabelNodeFunctionArgs} from './FbtNodeUtil';

type Options = {|
  // If true, capitalize the pronoun text
  capitalize?: ?boolean,
  // BabelNode representing the value of the `gender`
  gender: BabelNode,
  // If true, exclude non-human-related pronouns from the generated string variations
  human?: ?boolean,
  // Type of pronoun
  type: ValidPronounUsagesKey,
|};
*/

const {
  ValidPronounOptions,
  ValidPronounUsages,
  ValidPronounUsagesKeys,
} = require('../FbtConstants');
const {
  collectOptionsFromFbtConstruct,
  enforceBabelNode,
  enforceBoolean,
  enforceStringEnum,
  errorAt,
  varDump,
} = require('../FbtUtil');
const Gender = require('../Gender');
const {GENDER_CONST} = Gender;
const {GENDER_ANY} = require('../translate/IntlVariations');
const {GenderStringVariationArg} = require('./FbtArguments');
const FbtNode = require('./FbtNode');
const {createInstanceFromFbtConstructCallsite} = require('./FbtNodeUtil');
const {
  isStringLiteral,
} = require('@babel/types');
const invariant = require('invariant');
const nullthrows = require('nullthrows');

const candidatePronounGenders: $ReadOnlyArray<GenderConstEnum> = (
  (Object.values(GENDER_CONST): $FlowExpectedError): Array<$Values<typeof GENDER_CONST>>
);

/**
 * Represents an <fbt:pronoun> or fbt.pronoun() construct.
 * @see docs/pronouns.md
 */
class FbtPronounNode extends FbtNode/*:: <
  GenderStringVariationArg,
  BabelNodeCallExpression,
  > */ {

  /*::
  static +type: 'pronoun';
  +options: Options;
  */

  /**
   * Create a new class instance given a BabelNode root node.
   * If that node is incompatible, we'll just return `null`.
   */
  static fromBabelNode({
    moduleName,
    node,
  } /*: FromBabelNodeFunctionArgs */) /*: ?FbtPronounNode */ {
    return createInstanceFromFbtConstructCallsite(moduleName, node, this);
  }

  getOptions() /*: Options */ {
    const {moduleName} = this;
    const rawOptions = collectOptionsFromFbtConstruct(
      moduleName,
      this.node,
      ValidPronounOptions,
    );

    try {
      const args = this.getCallNodeArguments() || [];
      const [usageArg, genderArg] = args;
      invariant(isStringLiteral(usageArg),
        '`usage`, the first argument of %s.pronoun() must be a `StringLiteral` but we got `%s`',
        moduleName,
        usageArg?.type || 'unknown',
      );
      const type = enforceStringEnum(
        usageArg.value,
        ValidPronounUsages,
        `\`usage\`, the first argument of ${moduleName}.pronoun()`,
      );
      const gender = enforceBabelNode(genderArg, '`gender`, the second argument');
      const mergedOptions = nullthrows(rawOptions);
      return {
        capitalize: enforceBoolean.orNull(mergedOptions.capitalize),
        gender,
        human: enforceBoolean.orNull(mergedOptions.human),
        type,
      };
    } catch (error) {
      throw errorAt(this.node, error);
    }
  }

  initCheck() /*: void */ {
    const args = this.getCallNodeArguments();
    invariant(args && (args.length === 2 || args.length === 3) || !args,
      "Expected '(usage, gender [, options])' arguments to %s.pronoun()",
      this.moduleName,
    );
  }

  getText(argsList: SVArgsList): string {
    try {
      const svArg = GenderStringVariationArg.assert(argsList.consumeOne());
      const svArgValue = nullthrows(svArg.value);
      const {options} = this;

      const word = Gender.getData(
        svArgValue === GENDER_ANY
          ? GENDER_CONST.UNKNOWN_PLURAL
          // $FlowExpectedError(incompatible-cast) We type-checked for `GENDER_ANY` just above
          : (svArgValue: GenderConstEnum),
        options.type,
      );
      invariant(typeof word === 'string',
        'Expected pronoun word to be a string but we got %s', varDump(word));

      return options.capitalize
        ? word.charAt(0).toUpperCase() + word.substr(1)
        : word;
    } catch (error) {
      throw errorAt(this.node, error);
    }
  }

  getArgsForStringVariationCalc() /*: $ReadOnlyArray<GenderStringVariationArg> */ {
    const {options} = this;
    const candidates = new Set();

    for (const gender of candidatePronounGenders) {
      if (options.human === true && gender === GENDER_CONST.NOT_A_PERSON) {
        continue;
      }
      const resolvedGender = this._getPronounGenderKey(
        options.type,
        gender,
      );
      candidates.add(
        resolvedGender === GENDER_CONST.UNKNOWN_PLURAL
          ? GENDER_ANY
          : resolvedGender
      );
    }

    return [new GenderStringVariationArg(this, options.gender, Array.from(candidates))];
  }

  /**
   * Must match implementation from fbt.js
    * @see (FB) https://fburl.com/diffusion/3gbcj3aq
    * @see (OSS) https://github.com/facebook/fbt/blob/19531133625dab1d38995dcf578dcfdfa0b09048/runtime/shared/fbt.js#L316-L348
   */
  _getPronounGenderKey(
    usage: ValidPronounUsagesKey,
    gender: GenderConstEnum,
  ): GenderConstEnum {
    switch (gender) {
      case GENDER_CONST.NOT_A_PERSON:
        return usage === ValidPronounUsagesKeys.object ||
          usage === ValidPronounUsagesKeys.reflexive
          ? GENDER_CONST.NOT_A_PERSON
          : GENDER_CONST.UNKNOWN_PLURAL;

      case GENDER_CONST.FEMALE_SINGULAR:
      case GENDER_CONST.FEMALE_SINGULAR_GUESS:
        return GENDER_CONST.FEMALE_SINGULAR;

      case GENDER_CONST.MALE_SINGULAR:
      case GENDER_CONST.MALE_SINGULAR_GUESS:
        return GENDER_CONST.MALE_SINGULAR;

      case GENDER_CONST.MIXED_UNKNOWN:
      case GENDER_CONST.FEMALE_PLURAL:
      case GENDER_CONST.MALE_PLURAL:
      case GENDER_CONST.NEUTER_PLURAL:
      case GENDER_CONST.UNKNOWN_PLURAL:
        return GENDER_CONST.UNKNOWN_PLURAL;

      case GENDER_CONST.NEUTER_SINGULAR:
      case GENDER_CONST.UNKNOWN_SINGULAR:
        return usage === ValidPronounUsagesKeys.reflexive
          ? GENDER_CONST.NOT_A_PERSON
          : GENDER_CONST.UNKNOWN_PLURAL;
    }

    invariant(false, 'Unknown GENDER_CONST value: %s', varDump(gender));
  }
}
// $FlowFixMe[cannot-write] Needed because node.js v10 does not support static constants on classes
FbtPronounNode.type = 'pronoun';

module.exports = FbtPronounNode;