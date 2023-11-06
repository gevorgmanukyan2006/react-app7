const API_HOST = "http://localhost:3001";

export const createTaskRequest = async (task) => {
  const response = await fetch(`${API_HOST}/task`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ title: task.title, description: task.description }),
  });
  const newTask = await response.json();
  return newTask;
};

export const getTaskRequest = async (setTasks) => {
  const response = await fetch(`${API_HOST}/task`);
  const tasks = await response.json();
  setTasks(tasks);
  console.log(tasks, "tasks");
};

export const deleteTaskRequest = async (array) => {
  console.log(array, "array");
  const response = await fetch(`${API_HOST}/task`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ tasks: array }),
  });
  console.log(response);
};
