import "./App.css";
import { Outlet } from "react-router";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <div>
      <header className="py-2 mt-2 text-white bg-blue-500 rounded-xl">
        <h1 className="text-xl font-bold text-center rounded-lg">
          Release Tracker
        </h1>
      </header>
      <main className="mx-16">
        <LandingPage />
        <Outlet />
      </main>
    </div>
  );
}

export default App;
