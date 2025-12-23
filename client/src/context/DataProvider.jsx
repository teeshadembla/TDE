import react from 'react';
import { createContext, useState, useMemo } from 'react';

const DataContext = createContext(null);

const DataProvider = ({children}) =>{
    const [account, setAccount] = useState({_id: "",name: "", email: "", role: "", profilePicture: "", verified: ""});
    
    // Memoize the context value to prevent unnecessary re-renders
    const value = useMemo(() => ({ account, setAccount }), [account]);

    return(
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )

}

export default {DataContext, DataProvider};