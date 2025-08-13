import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Record from "./components/Record";
import RecordList from "./components/RecordList";
import UpcomingMeetings from "./components/UpcomingMeetings";
import TaskManager from "./components/TaskManager";
import AIInsights from "./components/AIInsights";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,         // Navbar + <Outlet />
    children: [
      { index: true, element: <RecordList /> },   // "/" -> RecordList
      { path: "client-manager", element: <RecordList /> },   // "/client-manager" -> RecordList
      { path: "upcoming-meetings", element: <UpcomingMeetings /> },   // "/upcoming-meetings" -> UpcomingMeetings
      { path: "task-manager", element: <TaskManager /> },   // "/task-manager" -> TaskManager
      { path: "create", element: <Record /> },    // "/create" -> Record
      { path: "edit/:id", element: <Record /> },  // "/edit/123" -> Record
      { path: "ai-insights/:id", element: <AIInsights /> },  // "/ai-insights/123" -> AIInsights
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);