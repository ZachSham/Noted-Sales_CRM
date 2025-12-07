import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

export default function UpcomingMeetings() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [form, setForm] = useState({
    clientId: "",
    title: "",
    meetingDate: "",
    meetingTime: "",
    notes: "",
    meetingLink: "",
  });
  const [editForm, setEditForm] = useState({
    clientId: "",
    title: "",
    meetingDate: "",
    meetingTime: "",
    notes: "",
    meetingLink: "",
  });

  // Fetch meetings from the database
  useEffect(() => {
    async function getMeetings() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          navigate("/");
          return;
        }
        
        const response = await fetch(`${API_BASE_URL}/meetings/?userId=${userId}`);
        if (!response.ok) {
          const message = `An error occurred: ${response.statusText}`;
          console.error(message);
          return;
        }
        const meetings = await response.json();
        setMeetings(meetings);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    }
    getMeetings();
  }, []);

  // Fetch clients for dropdown
  useEffect(() => {
    async function getClients() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          navigate("/");
          return;
        }
        
        const response = await fetch(`${API_BASE_URL}/clients/?userId=${userId}`);
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

  // Create new meeting
  async function onSubmit(e) {
    e.preventDefault();
    
    if (!form.title.trim() || !form.meetingDate || !form.meetingTime) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // Combine date and time into a single datetime string
      const dateTimeString = `${form.meetingDate}T${form.meetingTime}`;
      
      const response = await fetch(`${API_BASE_URL}/meetings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          clientId: form.clientId || null,
          title: form.title,
          meetingAt: new Date(dateTimeString),
          notes: form.notes,
          meetingLink: form.meetingLink,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Clear form and hide it
      setForm({ clientId: "", title: "", meetingDate: "", meetingTime: "", notes: "", meetingLink: "" });
      setShowForm(false);

      // Refresh meetings list
      const userId = localStorage.getItem("userId");
      const updatedResponse = await fetch(`http://3.141.106.235:5050/meetings/?userId=${userId}`);
      const updatedMeetings = await updatedResponse.json();
      setMeetings(updatedMeetings);
    } catch (error) {
      console.error("Error creating meeting:", error);
      alert("Error creating meeting. Please try again.");
    }
  }

  // Start editing a meeting
  function startEditMeeting(meeting) {
    const meetingDate = new Date(meeting.meetingAt);
    const dateString = meetingDate.toISOString().split('T')[0];
    const timeString = meetingDate.toTimeString().slice(0, 5);
    
    setEditingMeeting(meeting._id);
    setEditForm({
      clientId: meeting.clientId || "",
      title: meeting.title,
      meetingDate: dateString,
      meetingTime: timeString,
      notes: meeting.notes || "",
      meetingLink: meeting.meetingLink || "",
    });
  }

  // Cancel editing
  function cancelEdit() {
    setEditingMeeting(null);
    setEditForm({
      clientId: "",
      title: "",
      meetingDate: "",
      meetingTime: "",
      notes: "",
      meetingLink: "",
    });
  }

  // Update meeting
  async function updateMeeting(id) {
    if (!editForm.title.trim() || !editForm.meetingDate || !editForm.meetingTime) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const dateTimeString = `${editForm.meetingDate}T${editForm.meetingTime}`;
      
      const response = await fetch(`${API_BASE_URL}/meetings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          userId: localStorage.getItem("userId"),
          clientId: editForm.clientId || null,
          title: editForm.title,
          meetingAt: new Date(dateTimeString),
          notes: editForm.notes,
          meetingLink: editForm.meetingLink,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      const updatedMeetings = meetings.map(meeting => 
        meeting._id === id 
          ? { ...meeting, ...editForm, meetingAt: new Date(dateTimeString) }
          : meeting
      );
      setMeetings(updatedMeetings);

      // Clear edit form and stop editing
      setEditingMeeting(null);
      setEditForm({
        clientId: "",
        title: "",
        meetingDate: "",
        meetingTime: "",
        notes: "",
        meetingLink: "",
      });
    } catch (error) {
      console.error("Error updating meeting:", error);
      alert("Error updating meeting. Please try again.");
    }
  }

  // Delete meeting
  async function deleteMeeting(id) {
    if (!confirm("Are you sure you want to delete this meeting?")) {
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`${API_BASE_URL}/meetings/${id}?userId=${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove meeting from local state
      setMeetings(meetings.filter(meeting => meeting._id !== id));
    } catch (error) {
      console.error("Error deleting meeting:", error);
      alert("Error deleting meeting. Please try again.");
    }
  }

  // Group meetings by date
  function groupMeetingsByDate(meetings) {
    const grouped = {};
    
    meetings.forEach(meeting => {
      const date = new Date(meeting.meetingAt).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(meeting);
    });

    // Sort meetings within each date by time
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => new Date(a.meetingAt) - new Date(b.meetingAt));
    });

    return grouped;
  }

  // Get client name by ID
  function getClientName(clientId) {
    if (!clientId) return "No client";
    const client = clients.find(c => c._id === clientId);
    return client ? client.client : "Unknown client";
  }

  const groupedMeetings = groupMeetingsByDate(meetings);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center p-4">
        <h3 className="text-lg font-semibold">Upcoming Meetings</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
        >
          {showForm ? "Cancel" : "Add Meeting"}
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
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-slate-900 mb-2">
                Meeting Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={form.title}
                onChange={(e) => updateForm({ title: e.target.value })}
                className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter meeting title..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="meetingDate" className="block text-sm font-medium leading-6 text-slate-900 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  id="meetingDate"
                  name="meetingDate"
                  required
                  value={form.meetingDate || ""}
                  onChange={(e) => updateForm({ meetingDate: e.target.value })}
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div>
                <label htmlFor="meetingTime" className="block text-sm font-medium leading-6 text-slate-900 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  id="meetingTime"
                  name="meetingTime"
                  required
                  value={form.meetingTime || ""}
                  onChange={(e) => updateForm({ meetingTime: e.target.value })}
                  className="block w-full rounded-md border-0 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium leading-6 text-slate-900 mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={form.notes}
                onChange={(e) => updateForm({ notes: e.target.value })}
                className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter meeting notes..."
              />
            </div>

            <div>
              <label htmlFor="meetingLink" className="block text-sm font-medium leading-6 text-slate-900 mb-2">
                Meeting Link / Phone Number
              </label>
              <input
                type="text"
                id="meetingLink"
                name="meetingLink"
                value={form.meetingLink}
                onChange={(e) => updateForm({ meetingLink: e.target.value })}
                className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter Zoom link, phone number, or location..."
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
            >
              Create Meeting
            </button>
          </form>
        </div>
      )}

      {/* Meetings List */}
      <div className="border rounded-lg overflow-hidden">
        {Object.keys(groupedMeetings).length === 0 ? (
          <div className="p-4 text-center text-slate-600">
            No meetings found. Create your first meeting above!
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {Object.entries(groupedMeetings).map(([date, dateMeetings]) => (
              <div key={date}>
                <div className="bg-slate-50 px-4 py-2">
                  <h4 className="text-sm font-medium text-slate-900">{date}</h4>
                </div>
                <div className="divide-y divide-slate-100">
                  {dateMeetings.map((meeting) => (
                    <div key={meeting._id} className="flex items-center justify-between p-4 hover:bg-slate-50">
                      {editingMeeting === meeting._id ? (
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
                                value={editForm.meetingTime}
                                onChange={(e) => setEditForm({ ...editForm, meetingTime: e.target.value })}
                                className="block w-full rounded-md border-0 py-1 text-xs text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Meeting Title</label>
                            <input
                              type="text"
                              value={editForm.title}
                              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                              className="block w-full rounded-md border-0 py-1 text-xs text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Notes</label>
                                                         <textarea
                               value={editForm.notes}
                               onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                               rows={2}
                               className="block w-full rounded-md border-0 py-1 text-xs text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                             />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Meeting Link / Phone</label>
                            <input
                              type="text"
                              value={editForm.meetingLink}
                              onChange={(e) => setEditForm({ ...editForm, meetingLink: e.target.value })}
                              className="block w-full rounded-md border-0 py-1 text-xs text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateMeeting(meeting._id)}
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
                              {new Date(meeting.meetingAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                              })}
                            </span>
                            <span className="text-sm font-medium text-slate-900">{meeting.title}</span>
                          </div>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-slate-500">
                            <span>{getClientName(meeting.clientId)}</span>
                            {meeting.meetingLink && (
                              <span className="text-blue-600">{meeting.meetingLink}</span>
                            )}
                          </div>
                          {meeting.notes && (
                            <div className="mt-2 text-sm text-slate-600 max-w-xs truncate" title={meeting.notes}>
                              {meeting.notes}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        {editingMeeting !== meeting._id && (
                          <button
                            onClick={() => startEditMeeting(meeting)}
                            className="text-slate-600 hover:text-slate-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => deleteMeeting(meeting._id)}
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
