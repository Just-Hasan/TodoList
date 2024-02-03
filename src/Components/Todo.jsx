import { FaCheck } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { HiPencil } from "react-icons/hi2";
import { useTodo } from "../App";
import PropTypes from "prop-types";
export default function Todo({ todo }) {
  const { dispatch, REDUCER_STATE, state } = useTodo();

  /* 
  /////////////////////////////////////[LOGIC EDIT]
  1. if the todo.edit is true, then the checkbox and the text will be turn to input field
     with a button besides it
  2. If the user click the button, and type some text and confirm it, the text will be replaced
     with the edit text, the edit value will become false.
  3. But if the text is empty / "", then don't change anything
  */
  return (
    <div
      className="bg-white text-xl p-4  rounded-lg grid grid-cols-[80fr,20fr] items-center"
      key={todo.id}
    >
      <div
        className="flex items-center gap-4"
        onClick={() =>
          dispatch({
            type: REDUCER_STATE.CHECK,
            payload: todo.id,
          })
        }
      >
        {todo.edit ? (
          <div className="flex gap-4 w-[90%]">
            <input
              placeholder="Edit Todo"
              className="w-full p-4 border rounded-md"
              onChange={(e) =>
                dispatch({
                  type: REDUCER_STATE.EDIT_TODO_VALUE,
                  payload: e.target.value,
                })
              }
              value={state.editTodo}
            />
            <button
              className="bg-[#6270f0ff] text-white font-black px-4 rounded-md"
              onClick={() =>
                dispatch({ type: REDUCER_STATE.EDIT_TODO, payload: todo.id })
              }
            >
              Edit
            </button>
          </div>
        ) : (
          <>
            <button>
              {todo.check ? (
                <div className="w-[25px] h-[25px] bg-[#ebecf5ff] rounded-md overflow-hidden">
                  <FaCheck className="w-full h-full p-1 text-white bg-[#6270f0ff]"></FaCheck>
                </div>
              ) : (
                <div className="w-[25px] h-[25px] bg-[#ebecf5ff] rounded-md"></div>
              )}
            </button>
            <p
              className={`${
                todo.check && "line-through "
              } text-xl font-semibold`}
            >
              {todo.text}
            </p>
          </>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <button
          className="bg-[#ebecf5ff] rounded-md w-max p-4"
          onClick={() =>
            dispatch({ type: REDUCER_STATE.DELETE, payload: todo.id })
          }
        >
          <FaTrash className="text-[18px]"></FaTrash>
        </button>
        <button
          className="bg-[#ebecf5ff] rounded-md w-max p-4"
          onClick={() =>
            dispatch({ type: REDUCER_STATE.TOGGLE_EDIT, payload: todo.id })
          }
        >
          <HiPencil className="text-[18px]"></HiPencil>
        </button>
      </div>
    </div>
  );
}

Todo.propTypes = {
  todo: PropTypes.object.isRequired,
};
