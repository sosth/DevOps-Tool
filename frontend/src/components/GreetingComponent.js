// src/components/GreetingComponent.js

import React from 'react';

const GreetingComponent = ({ name }) => {
  return (
    <div>
      <h1>Hello, {name}!</h1>
    </div>
  );
};

export default GreetingComponent;
