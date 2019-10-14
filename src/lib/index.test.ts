import 'jest';
import Joi from '@hapi/joi';
import * as ArthurReact from './index';

test('should export all the types under "analytics"', () => {
  // @ts-ignore
  var object: ArthurReact.analytics.AnalyticsTypes.AnalyticsHookOptions = {};
  // @ts-ignore
  var object: ArthurReact.analytics.AnalyticsTypes.AnalyticsHookResult = {};
});

test('should export all the analytics functions under "analytics"', () => {
  // Here we've imported Joi instead of yup because it supports additionalProperties: false
  // out of the box, which yup doesn't. Plus it supports functions, which yup also doesn't.
  // The reason why Joi is not used in the package is due to its size in comparison to yup ¯\_(ツ)_/¯
  const ANALYTICS_EXPORTS_SCHEMA = Joi.object({
    useAnalytics: Joi.function().required(),
  });

  const validated = ANALYTICS_EXPORTS_SCHEMA.validate(ArthurReact.analytics);

  expect(validated.error).toBe(undefined);
})