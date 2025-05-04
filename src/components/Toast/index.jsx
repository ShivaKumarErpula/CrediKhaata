import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const Toast = () => {
  const { toast } = useContext(AppContext);
  if (!toast) return null;

  const { message, type = "success" } = toast;

  return (
    <div
      role="alert"
      className={`fixed bottom-4 right-4 p-4 rounded shadow-lg text-white transition-all duration-300 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;
