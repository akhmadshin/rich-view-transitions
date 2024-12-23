import React from 'react';
import { ParentComponent } from '@/types/general';


export const Layout: ParentComponent = ({ children }) => {
  return (
    <>
      <main className="py-14">
        {children}
      </main>
    </>
  )
}