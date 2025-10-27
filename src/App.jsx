import { useState, useEffect } from 'react'

export default function App() {

  const [tasks, setTasks] = useState([])
  const [name, setName] = useState('')

  // backend url 
  const API_URL = "http://localhost:2009/tasks";

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Failed to fetch tasks:", err));
  }, [])

  async function addTask(e) {
    e.preventDefault()
    if (!name) return

    const newTask = { title: name };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      })

      const savedTask = await res.json();
      setTasks([...tasks, savedTask]); // update UI
      setName('');
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  }


  async function DeleteTask(id) {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });
      setTasks(tasks.filter(task => task._id !== id)); // remove from UI
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  }


  return (
    <div className="bg-gray-300 min-h-screen w-full flex flex-col justify-center items-center">
      {/* to do list goes here */}
      <div className='rounded-2xl bg-[#ececec] flex flex-col items-center justify-center p-2  '>
        {/* display  */}
        <form className='flex flex-col items-center justify-center gap-3' onSubmit={addTask} >
          <input value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-400 text-xl font-semibold text-white rounded-xl p-4 w-100 focus:outline-white focus:outline-2" type="text" name="" id="" />
          <button type='submit' disabled={!name} className="bg-gray-400 hover:bg-gray-500 text-xl font-semibold text-white rounded-xl cursor-pointer transition-all duration-300 hover:scale-102 p-4 w-100">Add Task</button>
        </form>
        {/* Tasks go here*/}
        <ul className="mt-5 flex flex-col gap-1 h-60 w-full overflow-y-scroll">
          ({tasks.length})
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center text-lg mt-4">No tasks</p>
          ) : (
            tasks.map((task) => (
              <li
                key={task.id}
                className="bg-gray-400 text-xl font-semibold text-white rounded-xl flex items-center justify-between p-4 w-100"
              >
                {/* task name */}
                <span>{task.title}</span>

                {/* delete button */}
                <span onClick={() => DeleteTask(task.id)} className="cursor-pointer">
                  <svg
                    className="text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                  </svg>
                </span>
              </li>
            ))
          )}
        </ul>

      </div>
    </div>
  )
}