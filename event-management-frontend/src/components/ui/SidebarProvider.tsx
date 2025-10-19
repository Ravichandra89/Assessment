import * as React from "react";
import { SidebarContext, type SidebarContextType } from "./SidebarContext";

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const value: SidebarContextType = { isOpen, setIsOpen };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};
