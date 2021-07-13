import React, { createContext, useState, ReactChild, ReactChildren } from 'react';

export interface ValueProps {
  selectedField: null | string;
  setSelectedField: (field: null | string) => void;
};

const emptyValue: ValueProps = {
  selectedField: null,
  setSelectedField: () => {},
};

const Context = createContext(emptyValue);

interface Props {
  filterLookupMap: any;
  children: ReactChild | ReactChildren;
}
const Provider = ({ children, filterLookupMap }: Props) => {
  const [selectedField, setSelectedField] = useState<string | null>(null);
  console.log(filterLookupMap);
  return (
    <Context.Provider value={{
      selectedField,
      setSelectedField,
    }}>
      {children}      
    </Context.Provider>
  );
};

export default {
  Context,
  Provider,
}