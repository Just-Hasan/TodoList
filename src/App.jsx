import React, { useEffect, useReducer } from "react";
import Swal from "sweetalert2";
import { v4 as RandomID } from "uuid";
import "./App.css";
import Todo from "./Components/Todo";

const REDUCER_STATE = {
  CHECK: "check",
  NEW_TODO_VALUE: "new_todo_value",
  NEW_TODO: "new_todo",
  DELETE: "delete",
  TOGGLE_EDIT: "toggle_edit",
  EDIT_TODO: "edit_todo",
  EDIT_TODO_VALUE: "edit_todo_value",
  SORT: "sort",
  CLEAR: "clear",
};

export const TodoContext = React.createContext();

function reducer(state, action) {
  let updateState, sortComplete, sortIncomplete, currentTodo;
  switch (action.type) {
    case REDUCER_STATE.CHECK:
      updateState = state.todos.map((todo) =>
        todo.id === action.payload ? { ...todo, check: !todo.check } : todo
      );
      return { ...state, todos: [...updateState] };
    //
    case REDUCER_STATE.NEW_TODO:
      if (action.payload.text === "") return state;
      return { ...state, todos: [action.payload, ...state.todos], newTodo: "" };
    //
    case REDUCER_STATE.NEW_TODO_VALUE:
      return { ...state, newTodo: action.payload };
    //
    case REDUCER_STATE.TOGGLE_EDIT:
      currentTodo = state.todos.find((todo) => todo.id === action.payload);
      console.log(currentTodo);
      updateState = state.todos.map((todo) => {
        return todo.id === action.payload
          ? { ...todo, edit: !todo.edit }
          : { ...todo, edit: false };
      });
      return { ...state, todos: [...updateState], editTodo: currentTodo.text };
    //
    case REDUCER_STATE.EDIT_TODO_VALUE:
      return { ...state, editTodo: action.payload };
    //
    case REDUCER_STATE.EDIT_TODO:
      updateState = state.todos.map((todo) =>
        todo.id === action.payload
          ? {
              ...todo,
              edit: false,
              text: state.editTodo === "" ? todo.text : state.editTodo,
            }
          : todo
      );
      return { ...state, todos: [...updateState] };
    //
    case REDUCER_STATE.DELETE:
      updateState = state.todos.filter((todo) => todo.id !== action.payload);
      return { ...state, todos: [...updateState] };
    //
    case REDUCER_STATE.SORT:
      sortComplete = state.todos.slice().filter((todo) => todo.check === true);
      sortIncomplete = state.todos
        .slice()
        .filter((todo) => todo.check === false);
      if (action.payload === "completed") {
        updateState = [...sortComplete, ...sortIncomplete];
      } else if (action.payload === "incomplete") {
        updateState = [...sortIncomplete, ...sortComplete];
      } else if (action.payload === "all") {
        updateState = state.todos
          .slice()
          .sort(
            (todo1, todo2) =>
              new Date(todo2.dateAdded) - new Date(todo1.dateAdded)
          );
      }

      return { ...state, todos: [...updateState], sortBy: action.payload };
    case REDUCER_STATE.CLEAR:
      return {
        newTodo: "",
        editTodo: "",
        sortBy: "all",
        todos: [],
      };
    default:
      return state;
  }
}

const initialState = {
  newTodo: "",
  editTodo: "",
  sortBy: "all",
  todos: [],
};

export default function App() {
  const [state, dispatch] = useReducer(
    reducer,
    JSON.parse(localStorage.getItem("todo")) || initialState
  );
  const { todos, sortBy } = state;

  useEffect(() => {
    localStorage.setItem("todo", JSON.stringify(state));
  }, [state]);

  const todoValue = {
    dispatch,
    state,
    REDUCER_STATE,
  };

  /////////////////////////////////////[Handler Function]

  /*
  LOGIC : 
  1. When i click the add task, the value in the input field, is added to the todos array
  */

  function handleAdd(e) {
    e.preventDefault();
    dispatch({
      type: REDUCER_STATE.NEW_TODO,
      payload: {
        text: state.newTodo,
        check: false,
        id: RandomID(),
        edit: false,
        dateAdded: new Date(),
      },
    });
  }

  function handleDeleteAll() {
    if (todos.length === 0) return;
    Swal.fire({
      title: "Clear todo list?",
      text: "This will delete all the todo in the list",
      icon: "warning",
      confirmButtonText: "Delete",
      confirmButtonColor: "#228be6",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch({ type: REDUCER_STATE.CLEAR });
        console.log("You delete the list");
      }
    });
  }

  return (
    <div className="grid place-content-center mb-[42px]">
      <div className="laptop:w-[70vw] tablet:w-[80vw] flex flex-col justify-center p-4 items-center">
        <h1 className="text-[32px] font-black text-[#61667dff] mb-[24px]">
          TODO LIST
        </h1>
        <div className="w-[100%]">
          <form
            onSubmit={(e) => handleAdd(e)}
            className="grid grid-cols-[60fr,auto,auto] gap-x-4 mb-8"
          >
            <input
              placeholder="New Todo"
              className="p-4 mobile:w-[100%] tablet:w-[90%] mobile:mb-[16px] border-[2px] rounded-xl text-xl mobile:col-span-2 tablet:col-span-1"
              value={state.newTodo}
              onChange={(e) =>
                dispatch({
                  type: REDUCER_STATE.NEW_TODO_VALUE,
                  payload: e.target.value,
                })
              }
            />
            <button className="text-[#f4f4f4] bg-[#6270f0ff] text-xl font-black rounded-xl p-4 mr-0 mobile:col-start-3 tablet:col-start-2 h-max w-max">
              Add Task
            </button>
            <select
              className="p-4 text-left bg-[#caccdeff] rounded-xl font-black text-xl h-max mobile:col-start-1 w-max tablet:col-start-3"
              onChange={(e) =>
                dispatch({ type: REDUCER_STATE.SORT, payload: e.target.value })
              }
              value={state.sortBy}
            >
              <option value={"all"}>All</option>
              <option value={"completed"}>Completed</option>
              <option value={"incomplete"}>Incomplete</option>
            </select>
            <button
              onClick={handleDeleteAll}
              className="text-xl font-black bg-[#caccdeff] p-4 w-max rounded-xl hover:bg-red-400 hover:text-[#f4f4f4] mobile:col-start-3  mobile:justify-self-end tablet:col-start-1 tablet:justify-self-start transition-all duration-300 ease-in-out"
            >
              Clear
            </button>
          </form>
          <div className="bg-[#ebecf5ff] rounded-xl p-8 flex flex-col gap-y-4">
            <TodoContext.Provider value={todoValue}>
              {todos.length > 0
                ? todos.map((todo) => {
                    return <Todo key={todo.id} todo={todo} sortBy={sortBy} />;
                  })
                : todos.length === 0 && (
                    <p className="text-2xl font-black text-center">Empty</p>
                  )}
            </TodoContext.Provider>
          </div>
        </div>
      </div>
    </div>
  );
}
