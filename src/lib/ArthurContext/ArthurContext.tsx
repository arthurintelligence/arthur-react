import React from 'react';
import PropTypes from 'prop-types';
import { ArthurClient } from '@goarthur/arthur-js';

const ArthurClientInstanceContext = React.createContext<ArthurClient>(null);

type ArthurProviderProps = {
  client: ArthurClient;
  children: React.ReactNode;
};

function ArthurProvider({ client, children }: ArthurProviderProps): React.ReactElement {
  return (
    <ArthurClientInstanceContext.Provider value={client} >
      {children}
    </ArthurClientInstanceContext.Provider>
  );
}

ArthurProvider.propTypes = {
  client: PropTypes.instanceOf(ArthurClient),
};

ArthurProvider.defaultProps = {};



function useArthurClient(): ArthurClient {
  const context = React.useContext(ArthurClientInstanceContext);
  if (context === null) {
    throw new Error('useArthurClientInstance must be used within an ArthurProvider')
  }
  return context;
}

export { ArthurProvider, ArthurProviderProps, useArthurClient };