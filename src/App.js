import React, { useContext, useEffect } from "react";
import { AppContext } from "./context/AppContext"; // Ensure this is correct
import Dashboard from "./components/Dashboard";
import CustomerDetail from "./components/CustomerDetail";
import Login from "./components/Login";
import Toast from "./components/Toast";
import ErrorBoundary from "./components/ErrorBoundary"; // Ensure this is correctly imported

const App = () => {
  const { user, isDarkMode, setIsDarkMode, currentView } = useContext(AppContext);

  useEffect(() => {
    console.log("Current view:", currentView, "User:", user);
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode, currentView, user]);

  const renderContent = () => {
    if (!user && currentView === "login") return <Login />;
    if (user && currentView === "dashboard") return <Dashboard />;
    if (user && currentView === "customer") return <CustomerDetail />;
    return null;
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {user && (
          <div className="flex justify-between p-4 bg-white dark:bg-gray-800 shadow">
            <h1 className="text-xl font-bold dark:text-white">CrediKhaata</h1>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 bg-gray-200 dark:bg-gray-700 rounded"
            >
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        )}
        {renderContent()}
        <Toast />
      </div>
    </ErrorBoundary>
  );
};

export default App;
