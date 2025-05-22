import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { NavLink, Outlet } from "react-router";
import Navbar from "./pages/Navbar";
import ListView from "./pages/ListView";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <header className="bg-blue-500 text-white py-2">
        <h1 className="text-xl font-bold text-center">Release Tracker</h1>
      </header>
      <main className="mx-16">
        <ListView />
        <Outlet />
      </main>
    </div>
  );
}

export default App;
