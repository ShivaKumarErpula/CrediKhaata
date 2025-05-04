import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import {AppContext} from "../../context/AppContext"
const Dashboard = () => {
  const {
    customers,
    setCustomers,
    showToast,
    setCurrentView,
    setSelectedCustomerId,
  } = useContext(AppContext);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Check if a customer with the same name already exists
    const existingCustomer = customers.find(
      (customer) => customer.name.toLowerCase() === data.name.toLowerCase()
    );

    if (existingCustomer) {
      showToast("Customer with this name already exists", "error");
      return;
    }

    const newCustomer = {
      id: customers.length + 1,
      name: data.name,
      loans: [],
    };

    setCustomers([...customers, newCustomer]);
    showToast("Customer added successfully");
    reset();
  };

  const getOutstandingBalance = (loans) => {
    if (!loans) return 0;
    return loans.reduce((total, loan) => {
      const repaid = loan.repayments.reduce((sum, r) => sum + r.amount, 0);
      return total + (loan.amount - repaid);
    }, 0);
  };

  const getNextDueDate = (loans) => {
    if (!loans || !loans.length) return "-";
    const today = new Date();
    const dueDates = loans
      .map((loan) => new Date(loan.dueDate))
      .filter((date) => date >= today);
    return dueDates.length
      ? new Date(Math.min(...dueDates)).toISOString().split("T")[0]
      : "-";
  };

  const isOverdue = (loans) => {
    if (!loans) return false;
    const today = new Date();
    return loans.some(
      (loan) =>
        new Date(loan.dueDate) < today && getOutstandingBalance([loan]) > 0
    );
  };

  const handleCustomerClick = (customerId) => {
    console.log("Navigating to customer:", customerId);
    setSelectedCustomerId(customerId);
    setCurrentView("customer");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4 dark:text-white">Dashboard</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
        <div className="flex gap-4">
          <input
            {...register("name", { required: "Name is required" })}
            className="p-2 border rounded flex-1 dark:bg-gray-700 dark:text-white"
            placeholder="Customer Name"
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Add Customer
          </button>
        </div>
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </form>

      <div className="grid gap-4">
        {customers.length === 0 && (
          <p className="text-center dark:text-white">No customers found</p>
        )}
        {customers.map((customer) => (
          <button
            key={customer.id}
            onClick={() => handleCustomerClick(customer.id)}
            className="p-4 border rounded flex justify-between items-center dark:bg-gray-800 dark:text-white"
          >
            <div>
              <h3 className="font-bold">{customer.name}</h3>
              <p>Balance: ₹{getOutstandingBalance(customer.loans)}</p>
              <p>Next Due: {getNextDueDate(customer.loans)}</p>
            </div>
            <span
              className={`px-2 py-1 rounded ${
                isOverdue(customer.loans)
                  ? "bg-red-500"
                  : "bg-green-500"
              } text-white`}
            >
              {isOverdue(customer.loans) ? "Overdue" : "Up-to-date"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
