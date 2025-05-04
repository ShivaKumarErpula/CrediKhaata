import React, { createContext, useState, useEffect, useCallback } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [toast, setToast] = useState(null);
  const [currentView, setCurrentView] = useState("login");
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  useEffect(() => {
    // Mock initial data
    setCustomers([
      {
        id: 1,
        name: "John Doe",
        loans: [
          { id: 1, item: "Groceries", amount: 5000, dueDate: "2025-04-01", repayments: [{ amount: 2000, date: "2025-03-15" }] },
          { id: 2, item: "Clothing", amount: 3000, dueDate: "2025-05-10", repayments: [] },
        ],
      },
      {
        id: 2,
        name: "Jane Smith",
        loans: [
          { id: 3, item: "Electronics", amount: 10000, dueDate: "2025-03-20", repayments: [{ amount: 5000, date: "2025-03-10" }] },
        ],
      },
    ]);
    // Load user from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView("dashboard");
    }
  }, []);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <AppContext.Provider value={{ isDarkMode, setIsDarkMode, user, setUser, customers, setCustomers, showToast, currentView, setCurrentView, selectedCustomerId, setSelectedCustomerId }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
