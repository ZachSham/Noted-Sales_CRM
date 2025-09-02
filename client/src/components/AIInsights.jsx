import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AIInsights() {
  const { id } = useParams();
  const [client, setClient] = useState(null);

  useEffect(() => {
    async function fetchClient() {
      try {
        const response = await fetch(`http://localhost:5050/clients/${id}`);
        if (response.ok) {
          const clientData = await response.json();
          setClient(clientData);
        }
      } catch (error) {
        console.error("Error fetching client:", error);
      }
    }
    fetchClient();
  }, [id]);

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold p-4">AI Insights</h3>
      <div className="border rounded-lg overflow-hidden p-4">
        {client ? (
          <div className="mb-4">
            <h4 className="text-md font-medium text-slate-900 mb-2">
              Client: {client.client || client.name}
            </h4>
            <p className="text-sm text-slate-600 mb-4">
              AI-powered insights and recommendations for this client.
            </p>
          </div>
        ) : (
          <p className="text-slate-600 mb-4">Loading client information...</p>
        )}
        <p className="text-slate-600">AI insights functionality coming soon...</p>
      </div>
    </div>
  );
}
