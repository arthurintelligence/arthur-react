import 'jest';
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { ArthurClient } from '@goarthur/arthur-js';
import { ValidationError } from 'yup';
import { ArthurProvider } from '../ArthurContext';
import { useAnalytics } from './useAnalytics';

const client = new ArthurClient({
  tenant: '61678ef7-af9d-4346-8bba-6fa925e2d0cc',
  headers: {},
});

function ArthurContextWrapper({ children }) {
  return (
    <ArthurProvider client={client}>
      {children}
    </ArthurProvider>
  );
}

beforeEach(() => {
  jest.resetAllMocks();
});

test('given invalid options, should return validation errors.', async () => {
  const analyticsUUID = '946c6d0f-517b-46a3-91af-310ef7ef195a';
  const visualizationUUID = 'eb7087fd-78dc-498d-abe9-5a4004c25290';

  // @ts-ignore
  const noArgsRender = renderHook(() => useAnalytics(), { wrapper: ArthurContextWrapper });
  expect(noArgsRender.result.error).toEqual(new Error('useAnalytics takes at least two arguments'));

  // @ts-ignore
  const oneArgsRender = renderHook(() => useAnalytics(analyticsUUID), { wrapper: ArthurContextWrapper });
  expect(oneArgsRender.result.error).toEqual(new Error('useAnalytics takes at least two arguments'));

  // @ts-ignore
  const twoArgsRender = renderHook(() => useAnalytics(analyticsUUID, visualizationUUID), { wrapper: ArthurContextWrapper });
  expect(twoArgsRender.result.error).toBeInstanceOf(Error);

  const invalidAnalyticsUUIDRender = renderHook(() => useAnalytics('hello!', visualizationUUID, {}), { wrapper: ArthurContextWrapper });
  expect(invalidAnalyticsUUIDRender.result.error).toEqual(new Error('analyticUUID must be a valid uuid v4'));

  const invalidVisualizationUUIDRender = renderHook(() => useAnalytics(analyticsUUID, 'goodbye!', {}), { wrapper: ArthurContextWrapper });
  expect(invalidVisualizationUUIDRender.result.error).toEqual(new Error('visualizationUUID must be a valid uuid v4'));

  // @ts-ignore
  const invalidQueryRender = renderHook(() => useAnalytics(analyticsUUID, undefined), { wrapper: ArthurContextWrapper });
  expect(invalidQueryRender.result.error).toBeInstanceOf(Error);
  
  // const invalidIncludeAnalyticsRender = renderHook(
  //   // @ts-ignore
  //   () => useAnalytics(analyticsUUID, {}, { includeAnalytics: 'hi' }), 
  //   { wrapper: ArthurContextWrapper }
  // );
  // expect(invalidIncludeAnalyticsRender.result.error).toEqual(
  //   // @ts-ignore
  //   new ValidationError('includeAnalytics must be a `boolean` type, but the final value was: `"hi"`.')
  // );

  const invalidFieldsRender = renderHook(
    // @ts-ignore
    () => useAnalytics(analyticsUUID, {}, { fields: {} }),
    { wrapper: ArthurContextWrapper }
  );
  expect(invalidFieldsRender.result.error).toEqual(
    // @ts-ignore
    new ValidationError('fields must be a `array` type, but the final value was: `null` (cast from the value `{}`).\n If "null" is intended as an empty value be sure to mark the schema as `.nullable()`')
  );
});