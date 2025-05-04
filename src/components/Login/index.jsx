import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form"; // Make sure this is imported
import { AppContext } from "../../context/AppContext";


const Login = () => {
  const { setUser, showToast, setCurrentView } = useContext(AppContext);

  let register, handleSubmit, errors;
  let reactHookFormAvailable = false;

  try {
    const form = useForm();
    register = form.register;
    handleSubmit = form.handleSubmit;
    errors = form.formState.errors;
    reactHookFormAvailable = true;
  } catch (err) {
    console.warn("React Hook Form not available, using fallback.");
    register = () => {};
    handleSubmit = (fn) => fn;
    errors = {};
  }

  const [formData, setFormData] = useState({ email: "", password: "" });

  const onSubmit = (data) => {
    const submittedData = reactHookFormAvailable ? data : formData;
    console.log("Form submitted with data:", submittedData);

    if (!submittedData.email || !submittedData.password) {
      showToast("Please fill in both fields", "error");
      return;
    }

    const user = { email: submittedData.email };
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    setCurrentView("dashboard");
    showToast("Logged in successfully");
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={reactHookFormAvailable ? handleSubmit(onSubmit) : (e) => { e.preventDefault(); onSubmit(); }}
        className="p-6 bg-white dark:bg-gray-800 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl mb-4 dark:text-white">Login</h2>

        <div className="mb-4">
          <input
            {...(reactHookFormAvailable
              ? register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/, message: "Invalid email format" },
                })
              : {})}
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            placeholder="Email"
          />
          {errors?.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <input
            {...(reactHookFormAvailable
              ? register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })
              : {})}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            placeholder="Password"
          />
          {errors?.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
