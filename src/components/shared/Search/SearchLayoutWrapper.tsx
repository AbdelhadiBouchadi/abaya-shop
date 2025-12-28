import React from 'react';

interface SearchLayoutWrapperProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function SearchLayoutWrapper({
  children,
  sidebar,
}: SearchLayoutWrapperProps) {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20">
      <div className="mx-auto flex max-w-360 flex-col gap-8 px-6 lg:flex-row lg:items-start">
        {/* Sidebar Area */}
        <aside className="h-fit space-y-5 lg:sticky lg:top-[18vh] lg:w-64">
          {sidebar}
        </aside>

        {/* Main Content Area */}
        <div className="order-last min-h-screen w-full flex-1">{children}</div>
      </div>
    </div>
  );
}
