import { useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import DataProvider from '../../context/DataProvider.jsx';
import {useSearchParams} from "react-router-dom";


const LogoutButton = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { setAccount } = useContext(DataProvider.DataContext);
  const [searchParams] = useSearchParams();
    const redirectPath = searchParams.get("redirect") || "/";


  const handleLogout = async () => {
    try {
      setAccount(null);
      await signOut();
      navigate(redirectPath, {replace: true});
      
      toast.success('Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Failed to logout');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;