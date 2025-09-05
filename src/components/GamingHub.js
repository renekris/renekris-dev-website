import React from 'react';
import StatusOverview from './StatusOverview';

const GamingHub = () => {
  return (
    <div className="col-span-full mb-16">
      
      {/* Main gaming content - full width unified panel */}
      <div className="w-full">
        <StatusOverview />
      </div>
    </div>
  );
};

export default GamingHub;