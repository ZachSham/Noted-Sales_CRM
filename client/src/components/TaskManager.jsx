import { useState, useEffect } from "react";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    clientId: "",
    text: "",
    dueDate: "",
    dueTime: "",
  });
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({
    clientId: "",
    text: "",
    dueDate: "",
    dueTime: "",
  });

  // Fetch tasks from the database
  useEffect(() => {
    async function getTasks() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          window.location.href = "/";
          return;
        }
        
        const response = await fetch(`http://localhost:5050/task/?userId=${userId}`);
        if (!response.ok) {
          const message = `An error occurred: ${response.statusText}`;
          console.error(message);
          return;
        }
        const tasks = await response.json();
        setTasks(tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
    getTasks();
  }, []);

  // Fetch clients for the dropdown
  useEffect(() => {
    async function getClients() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          window.location.href = "/";
          return;
        }
        
        const response = await fetch(`http://localhost:5050/clients/?userId=${userId}`);
        if (!response.ok) {
          const message = `An error occurred: ${response.statusText}`;
          console.error(message);
          return;
        }
        const clients = await response.json();
        setClients(clients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    }
    getClients();
  }, []);

  // Update form state
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // Handle form submission
  async function onSubmit(e) {
    e.preventDefault();
    
    if (!form.text.trim() || !form.dueDate || !form.dueTime) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // Combine date and time into a single datetime string
      const dateTimeString = `${form.dueDate}T${form.dueTime}`;
      
      const response = await fetch("http://localhost:5050/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          clientId: form.clientId || null,
          text: form.text,
          dueAt: new Date(dateTimeString),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

              // Clear form and hide it
        setForm({ clientId: "", text: "", dueDate: "", dueTime: "" })
        setShowForm(false);

      // Refresh tasks list
      const userId = localStorage.getItem("userId");
      const updatedResponse = await fetch(`http://localhost:5050/task/?userId=${userId}`);
      const updatedTasks = await updatedResponse.json();
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Error creating task. Please try again.");
    }
  }

  // Start editing a task
  function startEditTask(task) {
    const taskDate = new Date(task.dueAt);
    const dateString = taskDate.toISOString().split('T')[0];
    const timeString = taskDate.toTimeString().slice(0, 5);
    
    setEditingTask(task._id);
    setEditForm({
      clientId: task.clientId || "",
      text: task.text,
      dueDate: dateString,
      dueTime: timeString,
    });
  }

  // Cancel editing
  function cancelEdit() {
    setEditingTask(null);
    setEditForm({
      clientId: "",
      text: "",
      dueDate: "",
      dueTime: "",
    });
  }

  // Update task
  async function updateTask(id) {
    if (!editForm.text.trim() || !editForm.dueDate || !editForm.dueTime) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const dateTimeString = `${editForm.dueDate}T${editForm.dueTime}`;
      
      const response = await fetch(`http://localhost:5050/task/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          clientId: editForm.clientId || null,
          text: editForm.text,
          dueAt: new Date(dateTimeString),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      const updatedTasks = tasks.map(task => 
        task._id === id 
          ? { ...task, ...editForm, dueAt: new Date(dateTimeString) }
          : task
      );
      setTasks(updatedTasks);

      // Clear edit form and stop editing
      setEditingTask(null);
      setEditForm({
        clientId: "",
        text: "",
        dueDate: "",
        dueTime: "",
      });
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Error updating task. Please try again.");
    }
  }

  // Delete task
  async function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`http://localhost:5050/task/${id}?userId=${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove task from local state
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Error deleting task. Please try again.");
    }
  }

  // Group tasks by date
  function groupTasksByDate(tasks) {
    const grouped = {};
    
    tasks.forEach(task => {
      const date = new Date(task.dueAt).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(task);
    });

    // Sort tasks within each date by time
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));
    });

    return grouped;
  }

  // Get client name by ID
  function getClientName(clientId) {
    if (!clientId) return "No client";
    const client = clients.find(c => c._id === clientId);
    return client ? client.client : "Unknown client";
  }

  const groupedTasks = groupTasksByDate(tasks);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center p-4">
        <h3 className="text-lg font-semibold">Task Manager</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
        >
          {showForm ? "Cancel" : "Add Task"}
        </button>
      </div>

      {/* Inline Create Form */}
      {showForm && (
        <div className="border rounded-lg overflow-hidden p-4 mb-4">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="clientId" className="block text-sm font-medium leading-6 text-slate-900 mb-2">
                Client
              </label>
              <select
                id="clientId"
                name="clientId"
                value={form.clientId}
                onChange={(e) => updateForm({ clientId: e.target.value })}
                className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">No client</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.client}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="text" className="block text-sm font-medium leading-6 text-slate-900 mb-2">
                Task Text *
              </label>
              <textarea
                id="text"
                name="text"
                required
                rows={3}
                value={form.text}
                onChange={(e) => updateForm({ text: e.target.value })}
                className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter task description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium leading-6 text-slate-900 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  required
                  value={form.dueDate || ""}
                  onChange={(e) => updateForm({ dueDate: e.target.value })}
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div>
                <label htmlFor="dueTime" className="block text-sm font-medium leading-6 text-slate-900 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  id="dueTime"
                  name="dueTime"
                  required
                  value={form.dueTime || ""}
                  onChange={(e) => updateForm({ dueTime: e.target.value })}
                  className="block w-full rounded-md border-0 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
            >
              Create Task
            </button>
          </form>
        </div>
      )}

      {/* Tasks List */}
      <div className="border rounded-lg overflow-hidden">
        {Object.keys(groupedTasks).length === 0 ? (
          <div className="p-4 text-center text-slate-600">
            No tasks found. Create your first task above!
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {Object.entries(groupedTasks).map(([date, dateTasks]) => (
              <div key={date}>
                <div className="bg-slate-50 px-4 py-2">
                  <h4 className="text-sm font-medium text-slate-900">{date}</h4>
                </div>
                <div className="divide-y divide-slate-100">
                  {dateTasks.map((task) => (
                    <div key={task._id} className="flex items-center justify-between p-4 hover:bg-slate-50">
                      {editingTask === task._id ? (
                        // Edit mode
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">Client</label>
                              <select
                                value={editForm.clientId}
                                onChange={(e) => setEditForm({ ...editForm, clientId: e.target.value })}
                                className="block w-full rounded-md border-0 py-1 text-xs text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                              >
                                <option value="">No client</option>
                                {clients.map((client) => (
                                  <option key={client._id} value={client._id}>
                                    {client.client}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-700 mb-1">Time</label>
                              <input
                                type="time"
                                value={editForm.dueTime}
                                onChange={(e) => setEditForm({ ...editForm, dueTime: e.target.value })}
                                className="block w-full rounded-md border-0 py-1 text-xs text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Task Text</label>
                            <textarea
                              value={editForm.text}
                              onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                              rows={2}
                              className="block w-full rounded-md border-0 py-1 text-xs text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateTask(task._id)}
                              className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-xs bg-slate-600 text-white px-2 py-1 rounded hover:bg-slate-700"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Display mode
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-slate-500">
                              {new Date(task.dueAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                              })}
                            </span>
                            <span className="text-sm font-medium text-slate-900">{task.text}</span>
                          </div>
                          <div className="mt-1">
                            <span className="text-sm text-slate-500">{getClientName(task.clientId)}</span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        {editingTask !== task._id && (
                          <button
                            onClick={() => startEditTask(task)}
                            className="text-slate-600 hover:text-slate-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => deleteTask(task._id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
