import React, { useState, useContext, useEffect } from "react";
import AddTask from "./AddTask/AddTask";
import Task from "./Task/Task";
import DeleteModal from "./deleteModal/deleteModal";
import Styles from "./styles.module.css";
import { idGeneretor } from "../helpers/idGeneretor";
import Button from "react-bootstrap/Button";
import {
  createTaskRequest,
  getTaskRequest,
  deleteTaskRequest,
} from "../service/requests";
// import { ContextProvider } from "../App";

const ToDo = () => {
  // const { loading } = useContext(ContextProvider);
  // console.log(num, "num");

  let [tasks, setTasks] = useState([]);
  let [inputValue, setInputValue] = useState({});
  let [checkedTasks, setCheckedTasks] = useState(new Set());
  let [isOpenAddModal, setIsOpenAddModal] = useState(false);
  let [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  let [editTask, setEditTask] = useState({});
  console.log(checkedTasks, "checkedTasks==========");
  const inputOnChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (!value) {
      delete inputValue[name];
      setInputValue(inputValue);
    } else {
      setInputValue({
        ...inputValue,
        [name]: value,
      });
    }
  };

  const submit = async (editTask) => {
    if (editTask) {
      tasks.forEach((task) => {
        if (task._id === editTask._id) {
          task.title = editTask.title;
          task.description = editTask.description;
        }
      });
      setTasks(tasks);
      setIsOpenAddModal(false);
      setEditTask({});
    } else {
      if (Object.keys(inputValue).length !== 3) return;
      const obj = {};
      Object.keys(inputValue).forEach((name) => {
        console.log(inputValue[name]);
        obj[name] = inputValue[name];
      });

      // const isTitleDescription = Object.keys(obj).find(   Eroi hamar
      //   (i) => i === "title" || i === "description"
      // );
      if (!obj.title && !obj.description) return;
      const newTask = await createTaskRequest(obj);
      setInputValue({});
      tasks.push(newTask);
      setTasks(tasks);
      setIsOpenAddModal(false);
    }
  };

  const handleDeleteTask = (_id) => {
    // let tasks = this.state.tasks;
    // tasks = tasks.filter((task) => task.id !== id);
    const checkedTasks = new Set();
    checkedTasks.add(_id);
    setCheckedTasks(checkedTasks);
    setIsOpenDeleteModal(true);
  };

  const handleOnChange = (_id) => {
    if (checkedTasks.has(_id)) {
      checkedTasks.delete(_id);
    } else {
      checkedTasks.add(_id);
    }
    setCheckedTasks(new Set(checkedTasks));
  };
  const handleDeleteAllTasks = () => {
    console.log(checkedTasks, "checkedTasks");
    // tasks = tasks.filter((task) => task.id !== checkedTasks.has(task.id));
    // checkedTasks = Array.from(checkedTasks);
    const arr = Array.from(checkedTasks);
    console.log(arr, "arr");
    tasks = arr.reduce(
      (acc, checkedTask) => acc.filter((task) => task._id !== checkedTask),
      tasks
    );
    deleteTaskRequest(arr);
    setTasks(tasks);
    setCheckedTasks(new Set());
    setIsOpenDeleteModal(false);
  };

  const handleCheckAllTasks = () => {
    if (checkedTasks.size === tasks.length) {
      checkedTasks.clear();
    } else {
      checkedTasks = tasks.map((item) => item._id);
    }
    setCheckedTasks(new Set(checkedTasks));
  };

  const handleOpenModal = (modalName) => {
    if (modalName === "isOpenAddModal") {
      setIsOpenAddModal(true);
    } else {
      setIsOpenDeleteModal(true);
    }
  };
  const onHide = (modalName) => {
    if (modalName === "isOpenAddModal") {
      setIsOpenAddModal(false);
    } else {
      setIsOpenDeleteModal(false);
    }
    setCheckedTasks(new Set());
    setEditTask({});
  };

  const handleEditTask = (task) => {
    setEditTask(task);
    setIsOpenAddModal(true);
  };

  const resetEditTask = () => {
    setEditTask({});
  };

  // useEffect(() => {
  //   const post = { title: "hello", userId: 1, body: "body" };
  //   fetch("https://jsonplaceholder.typicode.com/users")
  //     .then((res) => res.json())
  //     .then((data) => console.log(data, "userData"));
  //   fetch("https://jsonplaceholder.typicode.com/posts", {
  //     method: "POST",
  //     "content-type": "application-json",
  //     body: JSON.stringify(post),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data, "data");
  //     });
  // },[]);

  useEffect(() => {
    getTaskRequest(setTasks);
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center", color: "green", marginBottom: "50px" }}>
        ToDo Project
      </h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={() => handleOpenModal("isOpenAddModal")}>
          Add Task
        </Button>
      </div>
      {isOpenAddModal && (
        <AddTask
          onHide={onHide}
          inputOnChange={inputOnChange}
          submit={submit}
          inputValue={inputValue}
          isOpenAddModal={isOpenAddModal}
          editableTask={editTask}
          resetEditTask={resetEditTask}
        />
      )}
      <DeleteModal
        isOpenDeleteModal={isOpenDeleteModal}
        onHide={onHide}
        handleDeleteAllTasks={handleDeleteAllTasks}
        checkedTasks={checkedTasks}
        tasks={tasks}
      />
      <div className={Styles.TasksContainer}>
        {tasks.map((item, index) => {
          return (
            <Task
              key={index}
              task={item}
              handleDeleteTask={handleDeleteTask}
              handleOnChange={handleOnChange}
              checkedTasks={checkedTasks}
              handleEditTask={handleEditTask}
            />
          );
        })}
        {tasks.length === 0 && <p>There are not tasks!</p>}
      </div>
      {tasks.length === 0 || (
        <div className={Styles.deleteAll}>
          <button
            onClick={() => handleOpenModal("isOpenDeleteModal")}
            disabled={checkedTasks.size === 0}
          >
            Delete Cheked tasks
          </button>
          <button onClick={handleCheckAllTasks} style={{ background: "green" }}>
            {checkedTasks.size === tasks.length ? "Uncheck All" : "Check All"}
          </button>
          {/* <button onClick={() => setNum(num + 1)}>for context</button> */}
        </div>
      )}
    </div>
  );
};

export default ToDo;
