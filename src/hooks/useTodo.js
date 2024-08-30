import { useContext } from "react";
import { TodoContext } from "../App";

export function useTodo() {
  const context = useContext(TodoContext);
  if (!context) throw new Error("Context is used outside of its provider");
  return context;
}
