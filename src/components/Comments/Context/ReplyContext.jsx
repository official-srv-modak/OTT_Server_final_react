import React, { createContext, useState } from 'react';

// Create the context
export const ReplyContext = createContext();

// Create a provider component
export const ReplyProvider = ({ children }) => {
  const [isReplyVisible, setIsReplyVisible] = useState(false);

  const toggleReplyVisibility = () => {
    setIsReplyVisible((prev) => !prev);
  };

  return (
    <ReplyContext.Provider value={{ isReplyVisible, toggleReplyVisibility }}>
      {children}
    </ReplyContext.Provider>
  );
};
