import { createContext, useContext } from "react";

const CommentsContext = createContext();

export function useCommentsContext() {
  const context = useContext(CommentsContext);

  if (context === undefined) {
    throw new Error("useCommentsContext must be used within CommentsProvidor!");
  }

  return context;
}

export default CommentsContext;
