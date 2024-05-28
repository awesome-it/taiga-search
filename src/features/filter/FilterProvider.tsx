import React, {createContext, ReactNode, useContext, useState} from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface FilterDataInterface extends Record<string, any> {}

type FilterData = FilterDataInterface & {
  projects?: number[]
  doneTickets?: boolean
  assignees?: number[]
  statuses?: string[]
}

const FilterContext = createContext({} as FilterData)
const FilterDispatchContext = createContext<React.Dispatch<React.SetStateAction<FilterData>>>(() => {})
function FilterProvider({children}: {children: ReactNode}) {
  const sessionFilterData = localStorage.getItem('filterData') ?? '{}'
  const [filterData, setFilterData] = useState(JSON.parse(sessionFilterData) as FilterData)

  return (
    <FilterContext.Provider value={filterData}>
      <FilterDispatchContext.Provider value={setFilterData}>{children}</FilterDispatchContext.Provider>
    </FilterContext.Provider>
  )
}

export function useFilters() {
  return useContext(FilterContext)
}

export function useFiltersDispatch() {
  return useContext(FilterDispatchContext)
}

export default FilterProvider
