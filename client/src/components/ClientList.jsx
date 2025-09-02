import { useEffect, useState } from "react";
import { Link } from "react-router-dom";



export default function ClientList() {
  const [clients, setClients] = useState([]);

  // This method fetches the clients from the database.
  useEffect(() => {
    async function getClients() {
      const response = await fetch(`http://localhost:5050/clients/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const clients = await response.json();
      setClients(clients);
    }
    getClients();
    return;
  }, [clients.length]);

  // This method will delete a client
  async function deleteClient(id) {
    await fetch(`http://localhost:5050/clients/${id}`, {
      method: "DELETE",
    });
    const newClients = clients.filter((el) => el._id !== id);
    setClients(newClients);
  }



  // This following section will display the clients in a clean list format
  return (
    <>
      <div className="flex justify-between items-center p-4">
        <h3 className="text-lg font-semibold">Client Manager</h3>
        <Link
          to="/create"
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
        >
          Add Client
        </Link>
      </div>

      <div className="border rounded-lg overflow-hidden">
        {clients.length === 0 ? (
          <div className="p-4 text-center text-slate-600">No clients found. Create your first client above!</div>
        ) : (
          <div className="divide-y divide-slate-200">
            {clients.map((client) => (
              <div key={client._id} className="flex items-center justify-between p-4 hover:bg-slate-50">
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
                  <Link
                    to={`/edit/${client._id}`}
                    className="text-slate-600 hover:text-slate-800 text-sm font-medium"
                  >
                    Edit
                  </Link>
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
            ))}
          </div>
        )}
      </div>
    </>
  );
}