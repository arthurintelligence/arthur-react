import { ArthurClientInterface, ArthurClientContext } from '@goarthur/arthur-js';

export class ArthurClient implements ArthurClientInterface {
  private context: ArthurClientContext;

  constructor(context: ArthurClientContext) {
    this.context = context;
  }

  getContext = jest.fn(() => this.context);
  setContext = jest.fn((newContext) => this.context = newContext);
  query = jest.fn((value: any) => Promise.resolve({}));
};