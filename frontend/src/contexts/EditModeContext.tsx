import { createContext, useContext } from 'react';

// false = not inside the Provider = public site. There is exactly one place
// in the whole app that renders <EditModeProvider> (the CMS visual editor),
// so the public site can never accidentally end up in edit mode.
const EditModeContext = createContext(false);

export const EditModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <EditModeContext.Provider value={true}>{children}</EditModeContext.Provider>
);

export function useIsEditMode(): boolean {
  return useContext(EditModeContext);
}
