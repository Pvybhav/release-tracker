import "./App.css";
import { NavLink, Outlet } from "react-router";
import SprintView from "./pages/SprintView";
import { CogIcon } from "./icons/CogIcon";
import { HomeIcon } from "./icons/HomeIcon";

function App() {
  return (
    <div>
      <header className="flex items-center justify-between px-4 py-2 mt-2 text-white bg-blue-500 rounded-xl">
        <h1 className="mx-auto text-xl font-bold">Release Tracker</h1>

        <NavLink
          to="/manage-team"
          className="flex items-center justify-end mx-2 text-white hover:text-yellow-300 hover:underline"
        >
          <CogIcon className="w-5 h-5" />
          <span>Manage Team</span>
        </NavLink>

        <div className="w-px h-5 mx-2 bg-white" />

        <NavLink
          to="/"
          className="flex items-center justify-end px-2 text-white hover:text-yellow-300 hover:underline"
        >
          <HomeIcon className="w-5 h-5" />
          <span>Home</span>
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
