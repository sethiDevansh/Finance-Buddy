import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { API_PATHS } from '../../utils/apiPath';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import Modal from '../../components/layouts/Modal'
import ExpenseList from '../../components/Expense/ExpenseList';
import DeleteAlert from '../../components/layouts/DeleteAlert';

const Expense = () => {

  useUserAuth();

    const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

     // Get All Expense Details
    const fetchExpenseDetails = async () => {
      if (loading) return;

      setLoading(true);

      try {
        const response = await axiosInstance.get(
          `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}` // Assuming the API path for expenses is similar to income
        );

        if (response.data) {
          setExpenseData(response.data);
        }
      } catch (error) {
        console.log("Something went wrong. Please try again.", error);
      } finally {
        setLoading(false);
      }
    };

  // add expense details
  const handleAddExpense = async(expense) => {
    const {category,amount,date,icon} = expense;

    // validation check
    if(!category.trim()){
      toast.error("Category is required");
      return;
    }

    if(!amount || isNaN(amount) || Number(amount) <= 0){
      toast.error("Valid amount is required");
      return;
    }

    if(!date){
      toast.error("Date is required");
      return;
    }

    try{
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
    });
    
    setOpenAddExpenseModal(false);
    toast.success("Expense added successfully");
    fetchExpenseDetails();
  } 
  catch (error) {
    console.error("Error adding expense:", error.response?.data?.message || error.message);
  };
  };

  // delete expense details
  const deleteExpense = async (id) => {
    try{
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({show:false,data:null});
      toast.success("Expense deleted successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error("Error deleting expense:", error.response?.data?.message || error.message);
    };
  };

  // download expense details
  const handleDownloadExpenseDetails = async () => {
    try{
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
        responseType: 'blob', // Important for downloading files
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expense_details.xlsx'); // Set the file name
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link); // Clean up the link element
      window.URL.revokeObjectURL(url); // Free up memory
    }
    catch(error) {
      console.error("Error downloading expense details:", error.response?.data?.message || error.message);
      toast.error("Failed to download expense details");
    }
  };

  useEffect(() => {
      fetchExpenseDetails();
  
      return () => {};
      }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className='my-5 mx-auto'>
        <div>
          <div>
            <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
              />
          </div>

          <ExpenseList
            transactions={expenseData}
            onDelete = {(id) => {
              setOpenDeleteAlert({show: true, data: id});
            }}
            onDownload={handleDownloadExpenseDetails}
          />

        </div>

        <Modal
          
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm
            onAddExpense={handleAddExpense} />
        </Modal>

        <Modal
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({show:false,data:null})}
            title="Delete Expense"
            >
              <DeleteAlert
                content="Are you sure you want to delete this expense details?"
                onDelete={() =>  deleteExpense(openDeleteAlert.data)}
                />
          </Modal>  

      </div>
    </DashboardLayout>
  )
}

export default Expense