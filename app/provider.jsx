"use client"
import React, { useState } from 'react';

import {
  ConvexProvider,
  ConvexReactClient,
} from 'convex/react';

function Provider({ children }) {
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  const [fileSave, setFileSave] = useState(0);

  return (
    <div>
      <ConvexProvider client={convex}>
        
          {children}
        
      </ConvexProvider>
    </div>
  );
}

export default Provider;
