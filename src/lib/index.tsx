import React, { useState } from 'react';

function TestComponent(): React.ReactElement<any> {
  return (<div></div>);
}

function useTestHook(): [any, React.Dispatch<any>]  {
  const [state, setState] = useState(null)
  return [state, setState];
}

export {
  TestComponent,
  useTestHook,
};