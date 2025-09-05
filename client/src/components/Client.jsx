import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Client() {
  const [form, setForm] = useState({
    client: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if(!id) return;
      setIsNew(false);
      
      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/");
        return;
      }
      
      const response = await fetch(
        `http://3.141.106.235:5050/clients/${params.id.toString()}?userId=${userId}`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
              const client = await response.json();
        if (!client) {
          console.warn(`Client with id ${id} not found`);
        navigate("/");
        return;
      }
      // Handle both old "name" field and new "client" field
              setForm({
          client: client.client || client.name || "",
          email: client.email || "",
          phone: client.phone || "",
          notes: client.notes || "",
        });
    }
    fetchData();
    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/");
      return;
    }
    
    const person = { ...form, userId };
    if (!isNew) {
      person.id = params.id;
    }
    
    try {
      // Use single POST endpoint for both create and update
      const response = await fetch("http://3.141.106.235:5050/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(person),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
              console.error('A problem occurred adding or updating a client: ', error);
    } finally {
      setForm({ client: "", email: "", phone: "", notes: "" });
      navigate("/client-manager");
    }
  }

  // This following section will display the form that takes the input from the user.
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Create/Update Client Record</h3>
      <form
        onSubmit={onSubmit}
        className="border rounded-lg overflow-hidden p-4"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">
              Client Info
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Enter the client's contact information and any relevant notes.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 ">
            <div className="sm:col-span-4">
              <label
                htmlFor="client"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Client
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="client"
                    id="client"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Client Name"
                    value={form.client}
                    onChange={(e) => updateForm({ client: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Email
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="client@example.com"
                    value={form.email}
                    onChange={(e) => updateForm({ email: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="phone"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Phone
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="(555) 123-4567"
                    value={form.phone}
                    onChange={(e) => updateForm({ phone: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="notes"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Notes
              </label>
              <div className="mt-2">
                <textarea
                  name="notes"
                  id="notes"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter any additional notes about the client..."
                  value={form.notes}
                  onChange={(e) => updateForm({ notes: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
        <input
          type="submit"
          value="Save Client Record"
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
        />
      </form>
    </>
  );
}