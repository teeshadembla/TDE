import { createContext, useState } from 'react';

export const HeaderCollapseContext = createContext();

export const HeaderCollapseProvider = ({ children }) => {
  const [headerCollapsed, setHeaderCollapsed] = useState(false);

  return (
    <HeaderCollapseContext.Provider value={{ headerCollapsed, setHeaderCollapsed }}>
      {children}
    </HeaderCollapseContext.Provider>
  );
};
