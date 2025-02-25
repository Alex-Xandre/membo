import React, { ReactNode } from 'react';
import { useSidebar } from './ui/sidebar';

const Container = ({ children }: { children: ReactNode }) => {
  const { open } = useSidebar();
  return <main className={`  ${!open ? 'ml-16' : 'ml-72'}  flex flex-wrap mt-16 pr-5 relative`}>{children}</main>;
};

export default Container;