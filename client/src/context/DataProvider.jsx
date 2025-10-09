import react from 'react';
import { createContext, useState } from 'react';

const DataContext = createContext(null);

const DataProvider = ({children}) =>{
    const [account, setAccount] = useState({_id: "",name: "", email: "", role: "", profilePicture: ""});

    return(
        <DataContext.Provider value={{account, setAccount}}>
            {children}
        </DataContext.Provider>
    )

}

export default {DataContext, DataProvider};