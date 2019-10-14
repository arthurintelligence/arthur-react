import { ArthurClient } from '@goarthur/arthur-js';

export const useArthurClient = jest.fn(() => new ArthurClient({
  tenant: 'a6edc906-2f9f-5fb2-a373-efac406f0ef2',
  headers: {}
}));