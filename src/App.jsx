import "./App.css";
import { NavLink, Outlet } from "react-router";
import SprintView from "./pages/SprintView";
import { CogIcon } from "./icons/CogIcon";

function App() {
  return (
    <div>
      <header className="flex items-center justify-between px-4 py-2 mt-2 text-white bg-blue-500 rounded-xl">
        <h1 className="mx-auto text-xl font-bold">Release Tracker</h1>
        <NavLink
          to="/manage-team"
          className="flex items-center justify-end text-white hover:text-yellow-300 hover:underline"
        >
          <CogIcon className="w-6 h-6" />
          <span>Manage Team</span>
        </NavLink>
      </header>
      <main className="mx-16">
        <SprintView />
        <Outlet />
      </main>
    </div>
  );
}

export default App;
