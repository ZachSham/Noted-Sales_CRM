import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API_BASE_URL from "../config";

export default function AIInsights() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchClient() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          navigate("/");
          return;
        }
        
        const response = await fetch(`${API_BASE_URL}/clients/${id}?userId=${userId}`);
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

  const generateInsights = async () => {
    if (!client) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/ai/insights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientData: client
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setAiResponse(result.insights);
    } catch (error) {
      console.error("Error generating AI insights :", error);
      setAiResponse("Error generating insights. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
            
            <button
              onClick={generateInsights}
              disabled={isLoading}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Generating Insights..." : "Generate AI Insights"}
            </button>
            
            {aiResponse && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <h5 className="font-medium text-slate-900 mb-2">AI Insights:</h5>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{aiResponse}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-slate-600 mb-4">Loading client information...</p>
        )}
      </div>
    </div>
  );
}