import { createContext, useState } from 'react';

export const ActiveTabContext = createContext(null);

export default ({children}) => {
    const [activeTab, setActiveTab] = useState('home');
    const store = {
        activeTab,
        setActiveTab,
    }
    return <ActiveTabContext.Provider value={store}>{children}</ActiveTabContext.Provider>
}