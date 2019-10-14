import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useArthurClient } from '../ArthurContext';
import { ArthurClient } from '@goarthur/arthur-js';

const REGEX_UUID_V4 = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
const UUID_V4_SCHEMA = yup.string().matches(REGEX_UUID_V4);

const USE_ANALYTICS_HOOK_OPTIONS_SCHEMA = yup.object().shape({
  fields: yup.array().of(yup.string()).default(undefined),
});

type Primitive = number | boolean | string | null | object;
type Parameters = Record<string, Primitive[] | Primitive>;

export type AnalyticsHookOptions = {
  fields?: string[];
};

export type AnalyticsHookResult = {
  data: any;
  isLoading: boolean;
  error: Error | null;
  query: Parameters;
  client: ArthurClient;
};

export function useAnalytics(analyticUUID: string, query: Parameters, options?: AnalyticsHookOptions): AnalyticsHookResult;
export function useAnalytics(analyticUUID: string, visualizationUUID: string, query: Parameters, options?: AnalyticsHookOptions): AnalyticsHookResult;
export function useAnalytics(analyticUUID: string, arg2: string | Parameters, arg3: Parameters | AnalyticsHookOptions, arg4?: AnalyticsHookOptions): AnalyticsHookResult {
  const visualizationUUID: string | undefined = typeof arg2 === 'string' ? arg2 : undefined;
  const rawQuery: Parameters = typeof arg2 === 'string' ? arg3 : arg2;
  const rawOptions: AnalyticsHookOptions | undefined = typeof arg2 === 'string' ? arg4 : arg3;
  let options: AnalyticsHookOptions;

  // validation
  if (arguments.length < 2) {
    throw new Error('useAnalytics takes at least two arguments');
  }
  if (!UUID_V4_SCHEMA.isValidSync(analyticUUID)) {
    throw new Error('analyticUUID must be a valid uuid v4');
  }
  if (visualizationUUID && !UUID_V4_SCHEMA.isValidSync(visualizationUUID)) {
    throw new Error('visualizationUUID must be a valid uuid v4');
  }
  if (typeof rawQuery !== 'object' || rawQuery === null) {
    throw new Error('query must be an object');
  }
  if (!rawOptions || USE_ANALYTICS_HOOK_OPTIONS_SCHEMA.validateSync(rawOptions)) {
    options = rawOptions || {};
  }

  // set variables
  const { fields } = options;
  const client: ArthurClient = useArthurClient();
  const [result, setResult] = useState({
    data: null,
    isLoading: true,
    error: null,
    query: rawQuery,
    client,
  });
  const clientContext = client.getContext();
  // @ts-ignore
  const baseUrl = process && process.env.NODE_ENV === 'production'
    ? `https://api.goarthur.ai/api`
    // @ts-ignore
    : (process && process.env.REACT_APP_ARTHUR_API_BASE_URL) || `https://api.goarthur.ai/api`;
  const urlWithLocation =
    `${baseUrl}/analytics/${analyticUUID}${visualizationUUID ? `/visualization/${visualizationUUID}` : ''}`;
  // filter undefined values
  const params = Object.entries({ fields })
    .reduce((acc, [k, v]) => (v !== undefined ? { ...acc, [k]: v } : acc), {});

  // call the api
  useEffect(() => {
    async function asyncEffect() {
      try {
        const result = await client.query({
          query: rawQuery,
          context: {
            ...(clientContext),
            uri: urlWithLocation,
            params,
          },
        });
        setResult({
          data: result,
          isLoading: false,
          error: null,
          query: rawQuery,
          client,
        });
      } catch (error) {
        setResult({
          data: null,
          isLoading: false,
          error,
          query: rawQuery,
          client,
        });
      }
    }
    asyncEffect();
  }, [clientContext, urlWithLocation, params]);

  return result;
}



