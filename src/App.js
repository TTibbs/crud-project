import React, { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import "./App.css";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [notTodos, setNotTodos] = useState(() => {
    const savedNotTodos = localStorage.getItem("notTodos");
    return savedNotTodos ? JSON.parse(savedNotTodos) : [];
  });
  const [todoInput, setTodoInput] = useState("");
  const [notTodoInput, setNotTodoInput] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingList, setEditingList] = useState(null); // New state to track the currently edited list

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("notTodos", JSON.stringify(notTodos));
  }, [notTodos]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const addTodo = (list, setList, input, setInput) => {
    if (input.trim() !== "") {
      setList([...list, { text: input, completed: false }]);
      setInput("");
    }
  };

  const handleKeyPress = (event, list, setList, input, setInput) => {
    if (event.key === "Enter") {
      addTodo(list, setList, input, setInput);
    }
  };

  const deleteTodo = (list, setList, index) => {
    const newList = list.filter((_, i) => i !== index);
    setList(newList);
  };

  const toggleComplete = (list, setList, index) => {
    const newList = list.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item
    );
    setList(newList);
  };

  const transferTodo = (fromList, setFromList, toList, setToList, index) => {
    const itemToMove = fromList[index];
    setFromList(fromList.filter((_, i) => i !== index));
    setToList([...toList, itemToMove]);
  };

  const startEditing = (listName, index, text) => {
    setEditingIndex(index);
    setEditingText(text);
    setEditingList(listName);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditingText("");
    setEditingList(null);
  };

  const saveEdit = (list, setList, index) => {
    if (editingText.trim() !== "") {
      const newList = list.map((item, i) =>
        i === index ? { ...item, text: editingText } : item
      );
      setList(newList);
      setEditingIndex(null);
      setEditingText("");
      setEditingList(null);
    }
  };

  const handleEditKeyDown = (e, list, setList, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEdit(list, setList, index);
    }
  };

  const renderTodoList = (
    list,
    setList,
    otherList,
    setOtherList,
    listName,
    isNotTodoList = false
  ) => (
    <ul className="mt-4 flex-col items-center justify-center">
      {list.map((item, index) => (
        <li
          key={index}
          className="flex items-center justify-between text-zinc-950 dark:text-slate-200 bg-slate-300 dark:bg-gray-700 p-2 rounded mb-2"
        >
          {editingIndex === index && editingList === listName ? (
            <input
              type="text"
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              onKeyDown={(e) => handleEditKeyDown(e, list, setList, index)}
              className="mr-2 p-1 text-black"
              autoFocus
            />
          ) : (
            <span className={item.completed ? "line-through" : ""}>
              {item.text}
            </span>
          )}
          <div className="flex items-center justify-between">
            {editingIndex === index && editingList === listName ? (
              <>
                <button
                  onClick={() => saveEdit(list, setList, index)}
                  className="mr-2 bg-green-500 text-white p-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={cancelEditing}
                  className="mr-2 bg-gray-500 text-white p-1 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => startEditing(listName, index, item.text)}
                  className="mr-2"
                >
                  <img
                    src="https://img.icons8.com/color/48/000000/edit.png"
                    alt="Edit"
                    className="w-6 h-6"
                  />
                </button>
                <button
                  onClick={() => toggleComplete(list, setList, index)}
                  className="mr-2"
                >
                  <img
                    src={`https://img.icons8.com/color/48/000000/${
                      item.completed ? "checked-checkbox" : "unchecked-checkbox"
                    }.png`}
                    alt="Complete"
                    className="w-6 h-6"
                  />
                </button>
                <button
                  onClick={() => deleteTodo(list, setList, index)}
                  className="mr-2"
                >
                  <img
                    src="https://img.icons8.com/color/48/000000/trash.png"
                    alt="Delete"
                    className="w-6 h-6"
                  />
                </button>
                <button
                  onClick={() =>
                    transferTodo(list, setList, otherList, setOtherList, index)
                  }
                >
                  <img
                    src={`https://img.icons8.com/color/48/000000/${
                      isNotTodoList ? "ok" : "do-not-disturb"
                    }.png`}
                    alt="Transfer"
                    className="w-6 h-6"
                  />
                </button>
              </>
            )}
          </div>
        </li>
      ))}
      <button
        onClick={() => sortTodos(list, setList)}
        className={`p-2 ${
          isNotTodoList
            ? "bg-red-400 hover:bg-red-500"
            : "bg-blue-500 hover:bg-blue-600"
        } rounded-lg border-slate-100 border-2`}
      >
        Sort {isNotTodoList ? "Not To Do" : "To Do"}
      </button>
    </ul>
  );

  const sortTodos = (todoList, setTodoList) => {
    const sortedList = [...todoList].sort((a, b) =>
      a.text.localeCompare(b.text)
    );
    setTodoList(sortedList);
  };

  return (
    <div
      className={`App ${
        isDarkMode ? "dark" : ""
      } transition-colors duration-200`}
    >
      <main className="min-h-screen max-h-fit bg-slate-200 dark:bg-zinc-800 text-zinc-800 dark:text-slate-200">
        <section className="flex items-center justify-center py-6 px-4 sm:px-10">
          <button
            onClick={toggleDarkMode}
            className="absolute right-10 text-2xl"
          >
            {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
          </button>
          <h1 className="text-xl md:text-2xl lg:text-3xl text-center">
            To Do or Not To Do?
          </h1>
        </section>
        <section className="px-10 py-8">
          <div className="flex flex-col md:flex-row justify-between gap-8 relative">
            <div className="w-full text-slate-200 h-fit md:w-1/2 bg-blue-700 dark:bg-blue-900 p-4 rounded-t md:rounded-lg">
              <h2 className="mb-2 text-lg md:text-xl text-center font-bold">
                Got something to do?
              </h2>
              <hr className="w-1/2 md:w-2/3 mb-4 border-2 border-blue-500 mx-auto" />
              <div className="flex flex-col items-center">
                <label
                  htmlFor="toDo"
                  className="mb-2 font-semibold text-base md:text-lg"
                >
                  To Do
                </label>
                <div className="relative w-full max-w-xs md:max-w-lg">
                  <input
                    type="text"
                    id="toDo"
                    value={todoInput}
                    onChange={(e) => setTodoInput(e.target.value)}
                    onKeyPress={(e) =>
                      handleKeyPress(
                        e,
                        todos,
                        setTodos,
                        todoInput,
                        setTodoInput
                      )
                    }
                    className="p-2 pl-10 text-zinc-950 border rounded bg-white w-full"
                  />
                  <img
                    src="https://img.icons8.com/color/48/000000/task--v1.png"
                    alt="To-Do Icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6"
                  />
                </div>
                <button
                  onClick={() =>
                    addTodo(todos, setTodos, todoInput, setTodoInput)
                  }
                  className="mt-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 border-slate-100 border-2"
                >
                  Add To-Do
                </button>
              </div>
              {renderTodoList(todos, setTodos, notTodos, setNotTodos, "todos")}
            </div>
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
            <div className="w-full h-fit md:w-1/2 text-slate-200 bg-red-600 dark:bg-red-900 p-4 rounded-b md:rounded-lg">
              <h2 className="mb-2 text-lg md:text-xl text-center font-bold">
                Got something not to do?
              </h2>
              <hr className="w-1/2 mb-4 border-2 border-red-400 mx-auto" />
              <div className="flex flex-col items-center">
                <label
                  htmlFor="notToDo"
                  className="mb-2 font-semibold text-base md:text-lg"
                >
                  Not To Do
                </label>
                <div className="relative w-full max-w-xs md:max-w-lg">
                  <input
                    type="text"
                    id="notToDo"
                    value={notTodoInput}
                    onChange={(e) => setNotTodoInput(e.target.value)}
                    onKeyPress={(e) =>
                      handleKeyPress(
                        e,
                        notTodos,
                        setNotTodos,
                        notTodoInput,
                        setNotTodoInput
                      )
                    }
                    className="p-2 pl-10 border rounded text-zinc-950 bg-white w-full"
                  />
                  <img
                    src="https://img.icons8.com/color/48/000000/do-not-disturb.png"
                    alt="Not To-Do Icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6"
                  />
                </div>
                <button
                  onClick={() =>
                    addTodo(
                      notTodos,
                      setNotTodos,
                      notTodoInput,
                      setNotTodoInput
                    )
                  }
                  className="mt-2 bg-red-400 text-white p-2 rounded-lg hover:bg-red-500 border-slate-100 border-2"
                >
                  Add Not To-Do
                </button>
              </div>
              {renderTodoList(
                notTodos,
                setNotTodos,
                todos,
                setTodos,
                "notTodos",
                true
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
