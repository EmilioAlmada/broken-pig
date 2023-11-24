import { createContext, useContext, useMemo, useState } from "react";

const BasicDataContext = createContext(null);

const BasicDataProvider = ({ children }) => {
    const [basicData, setBasicData] = useState(null)

    const basicDataContext = useMemo(() => ({
        basicData,
        setBasicData,
    }),[]);

    return(
        <BasicDataContext.Provider value={basicDataContext}>
            {children}
        </BasicDataContext.Provider>
    )
}

export default BasicDataProvider

export const useBasicDataContext = () => useContext(BasicDataContext);