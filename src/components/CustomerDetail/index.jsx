import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import jsPDF from "jspdf";
import { AppContext } from "../../context/AppContext";

const CustomerDetail = () => {
  const {
    customers,
    setCustomers,
    showToast,
    setCurrentView,
    selectedCustomerId,
  } = useContext(AppContext);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const customer = customers.find((c) => c.id === selectedCustomerId);

  if (!customer) {
    return (
      <div className="p-6 dark:text-white">
        Customer not found
        <button
          onClick={() => setCurrentView("dashboard")}
          className="ml-4 p-2 bg-blue-500 text-white rounded"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const onAddLoan = (data) => {
    console.log("Adding loan:", data);

    if (!customer.loans) customer.loans = [];

    const newLoanId = customer.loans.reduce((max, l) => Math.max(max, l.id), 0) + 1;

    customer.loans.push({
      id: newLoanId,
      item: data.item,
      amount: parseFloat(data.amount),
      dueDate: data.dueDate,
      repayments: [],
    });

    setCustomers([...customers]);
    showToast("Loan added successfully");
    reset();
  };

  const onAddRepayment = (data) => {
    console.log("Adding repayment:", data);
    const loan = customer.loans.find((l) => l.id === parseInt(data.loanId));

    if (!loan) {
      showToast("Loan not found", "error");
      return;
    }

    const repaymentAmount = parseFloat(data.repaymentAmount);
    const outstanding = getOutstandingBalance(loan);

    if (repaymentAmount > outstanding) {
      showToast("Repayment exceeds remaining balance", "error");
      return;
    }

    loan.repayments.push({
      amount: repaymentAmount,
      date: new Date().toISOString().split("T")[0],
    });

    setCustomers([...customers]);
    showToast("Repayment recorded successfully");
    reset();
  };

  const exportPDF = () => {
    console.log("Exporting PDF for:", customer.name);
    const doc = new jsPDF();
    doc.text(`Statement for ${customer.name}`, 10, 10);

    customer.loans.forEach((loan, index) => {
      const y = 20 + index * 40;
      doc.text(`Loan ${index + 1}: ${loan.item}`, 10, y);
      doc.text(`Amount: ₹${loan.amount}`, 10, y + 10);
      doc.text(`Due Date: ${loan.dueDate}`, 10, y + 20);
      const repayments = loan.repayments.map(r => `₹${r.amount} on ${r.date}`).join(", ") || "None";
      doc.text(`Repayments: ${repayments}`, 10, y + 30);
    });

    doc.save(`${customer.name}_statement.pdf`);
  };

  const getOutstandingBalance = (loan) => {
    const repaid = loan.repayments.reduce((sum, r) => sum + r.amount, 0);
    return loan.amount - repaid;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl dark:text-white">{customer.name}</h2>
        <button
          onClick={() => setCurrentView("dashboard")}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Back to Dashboard
        </button>
      </div>

      <button onClick={exportPDF} className="mb-4 p-2 bg-blue-500 text-white rounded">
        Export Statement as PDF
      </button>

      <h3 className="text-xl mb-2 dark:text-white">Add Loan</h3>
      <form onSubmit={handleSubmit(onAddLoan)} className="mb-6">
        <div className="grid gap-4">
          <input
            {...register("item", { required: "Item is required" })}
            className="p-2 border rounded dark:bg-gray-700 dark:text-white"
            placeholder="Item"
          />
          {errors.item && <p className="text-red-500 text-sm">{errors.item.message}</p>}

          <input
            {...register("amount", {
              required: "Amount is required",
              min: { value: 1, message: "Amount must be positive" },
            })}
            className="p-2 border rounded dark:bg-gray-700 dark:text-white"
            type="number"
            placeholder="Amount"
          />
          {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}

          <input
            {...register("dueDate", { required: "Due date is required" })}
            className="p-2 border rounded dark:bg-gray-700 dark:text-white"
            type="date"
          />
          {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate.message}</p>}

          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Add Loan
          </button>
        </div>
      </form>

      <h3 className="text-xl mb-2 dark:text-white">Record Repayment</h3>
      <form onSubmit={handleSubmit(onAddRepayment)} className="mb-6">
        <div className="grid gap-4">
          {customer.loans.length > 0 ? (
            <select
              {...register("loanId", { required: "Loan is required" })}
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Loan</option>
              {customer.loans.map((loan) => (
                <option key={loan.id} value={loan.id}>
                  {loan.item} (₹{loan.amount})
                </option>
              ))}
            </select>
          ) : (
            <p>No loans available to select.</p>
          )}
          {errors.loanId && <p className="text-red-500 text-sm">{errors.loanId.message}</p>}

          <input
            {...register("repaymentAmount", {
              required: "Amount is required",
              min: { value: 1, message: "Amount must be positive" },
            })}
            className="p-2 border rounded dark:bg-gray-700 dark:text-white"
            type="number"
            placeholder="Repayment Amount"
          />
          {errors.repaymentAmount && (
            <p className="text-red-500 text-sm">{errors.repaymentAmount.message}</p>
          )}

          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Record Repayment
          </button>
        </div>
      </form>

      <h3 className="text-xl mb-2 dark:text-white">Loans</h3>
      <div className="grid gap-4">
        {customer.loans.map((loan) => (
          <div
            key={loan.id}
            className={`p-4 border rounded ${
              new Date(loan.dueDate) < new Date() && getOutstandingBalance(loan) > 0
                ? "border-red-500"
                : ""
            } dark:bg-gray-800 dark:text-white`}
          >
            <p>
              <strong>Item:</strong> {loan.item}
            </p>
            <p>
              <strong>Amount:</strong> ₹{loan.amount}
            </p>
            <p>
              <strong>Due Date:</strong> {loan.dueDate}
            </p>
            <p>
              <strong>Remaining:</strong> ₹{getOutstandingBalance(loan)}
            </p>
            <p>
              <strong>Repayments:</strong>{" "}
              {loan.repayments.map((r) => `₹${r.amount} on ${r.date}`).join(", ") || "None"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDetail;
