import * as React from "react";

export interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create context
export const SidebarContext = React.createContext<SidebarContextType | null>(
  null
);
