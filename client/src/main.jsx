import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Client from "./components/Client";
import ClientList from "./components/ClientList";
import UpcomingMeetings from "./components/UpcomingMeetings";
import TaskManager from "./components/TaskManager";
import AIInsights from "./components/AIInsights";
import Login from "./components/Login";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,         // Navbar + <Outlet />
    children: [
      { index: true, element: <Login /> },        // "/" -> Login
      { path: "login", element: <Login /> },      // "/login" -> Login
      { path: "client-manager", element: <ClientList /> },   // "/client-manager" -> ClientList
      { path: "upcoming-meetings", element: <UpcomingMeetings /> },   // "/upcoming-meetings" -> UpcomingMeetings
      { path: "task-manager", element: <TaskManager /> },   // "/task-manager" -> TaskManager
      { path: "create", element: <Client /> },    // "/create" -> Client
      { path: "edit/:id", element: <Client /> },  // "/edit/123" -> Client
      { path: "ai-insights/:id", element: <AIInsights /> },  // "/ai-insights/123" -> AIInsights
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);