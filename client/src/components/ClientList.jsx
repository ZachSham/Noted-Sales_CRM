import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    client: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [editingClient, setEditingClient] = useState(null);
  const [editForm, setEditForm] = useState({
    client: "",
    email: "",
    phone: "",
    notes: "",
  });

  // This method fetches the clients from the database.
  useEffect(() => {
    async function getClients() {
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
    }
    getClients();
  }, []);

  // This method will delete a client
  async function deleteClient(id) {
    const userId = localStorage.getItem("userId");
    await fetch(`http://localhost:5050/clients/${id}?userId=${userId}`, {
      method: "DELETE",
    });
    const newClients = clients.filter((el) => el._id !== id);
    setClients(newClients);
  }

  // Update form state
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // Handle form submission for creating new client
  async function onSubmit(e) {
    e.preventDefault();
    
    if (!form.client.trim()) {
      alert("Please fill in the client name");
      return;
    }

    try {
      const response = await fetch("http://localhost:5050/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          client: form.client,
          email: form.email,
          phone: form.phone,
          notes: form.notes,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Clear form and hide it
      setForm({ client: "", email: "", phone: "", notes: "" });
      setShowForm(false);

      // Refresh clients list
      const userId = localStorage.getItem("userId");
      const updatedResponse = await fetch(`http://localhost:5050/clients/?userId=${userId}`);
      const updatedClients = await updatedResponse.json();
      setClients(updatedClients);
    } catch (error) {
      console.error("Error creating client:", error);
      alert("Error creating client. Please try again.");
    }
  }

  // Start editing a client
  function startEditClient(client) {
    setEditingClient(client._id);
    setEditForm({
      client: client.client || client.name,
      email: client.email || "",
      phone: client.phone || "",
      notes: client.notes || "",
    });
  }

  // Cancel editing
  function cancelEdit() {
    setEditingClient(null);
    setEditForm({
      client: "",
      email: "",
      phone: "",
      notes: "",
    });
  }

  // Update client
  async function updateClient(id) {
    if (!editForm.client.trim()) {
      alert("Please fill in the client name");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5050/clients/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          client: editForm.client,
          email: editForm.email,
          phone: editForm.phone,
          notes: editForm.notes,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Exit edit mode
      setEditingClient(null);
      setEditForm({
        client: "",
        email: "",
        phone: "",
        notes: "",
      });

      // Refresh clients list
      const userId = localStorage.getItem("userId");
      const updatedResponse = await fetch(`http://localhost:5050/clients/?userId=${userId}`);
      const updatedClients = await updatedResponse.json();
      setClients(updatedClients);
    } catch (error) {
      console.error("Error updating client:", error);
      alert("Error updating client. Please try again.");
    }
  }

  // This following section will display the clients in a clean list format
  return (
    <>
      <div className="flex justify-between items-center p-4">
        <h3 className="text-lg font-semibold">Client Manager</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
        >
          {showForm ? "Cancel" : "Add Client"}
        </button>
      </div>

      {/* Inline Create Form */}
      {showForm && (
        <div className="border rounded-lg p-4 mb-4 bg-slate-50">
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Client Name *"
                value={form.client}
                onChange={(e) => updateForm({ client: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => updateForm({ email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="tel"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => updateForm({ phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
              <textarea
                placeholder="Notes"
                value={form.notes}
                onChange={(e) => updateForm({ notes: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 rounded-md"
              >
                Create Client
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        {clients.length === 0 ? (
          <div className="p-4 text-center text-slate-600">No clients found. Create your first client above!</div>
        ) : (
          <div className="divide-y divide-slate-200">
            {clients.map((client) => (
              <div key={client._id} className="p-4 hover:bg-slate-50">
                {editingClient === client._id ? (
                  // Edit Form
                  <form onSubmit={(e) => { e.preventDefault(); updateClient(client._id); }} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Client Name *"
                        value={editForm.client}
                        onChange={(e) => setEditForm({ ...editForm, client: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                                             <textarea
                         placeholder="Notes"
                         value={editForm.notes}
                         onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                         className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
                         rows={3}
                       />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 rounded-md"
                      >
                        Update Client
                      </button>
                    </div>
                  </form>
                ) : (
                  // Display Client Info
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-slate-900">
                          {client.client || client.name}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-xs text-slate-500">
                        <span>{client.email}</span>
                        <span>{client.phone}</span>
                      </div>
                      {client.notes && (
                        <div className="mt-2 text-sm text-slate-600 max-w-xs truncate" title={client.notes}>
                          {client.notes}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEditClient(client)}
                        className="text-slate-600 hover:text-slate-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteClient(client._id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                      <Link
                        to={`/ai-insights/${client._id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        AI Insights
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}