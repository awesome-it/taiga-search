import React, {createContext, ReactNode, useContext, useState} from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface FilterData extends Record<string, any> {
  projects?: number[]
  projectsExclude?: boolean
  doneTickets?: boolean
  assignees?: number[]
  statuses?: string[]
}

const FilterContext = createContext({} as FilterData)
const FilterDispatchContext = createContext<React.Dispatch<React.SetStateAction<FilterData>>>(() => {})
const TemporaryFilterContext = createContext({} as FilterData)
const TemporaryFilterDispatchContext = createContext<React.Dispatch<React.SetStateAction<FilterData>>>(() => {})

function FilterProvider({children}: {children: ReactNode}) {
  const sessionFilterData = localStorage.getItem('filterData') ?? '{}'
  const [filterData, setFilterData] = useState(JSON.parse(sessionFilterData) as FilterData)
  const [temporaryFilterData, setTemporaryFilterData] = useState(filterData)

  return (
    <FilterContext.Provider value={filterData}>
      <TemporaryFilterContext.Provider value={temporaryFilterData}>
        <TemporaryFilterDispatchContext.Provider value={setTemporaryFilterData}>
          <FilterDispatchContext.Provider value={setFilterData}>{children}</FilterDispatchContext.Provider>
        </TemporaryFilterDispatchContext.Provider>
      </TemporaryFilterContext.Provider>
    </FilterContext.Provider>
  )
}

export function useFilters() {
  return useContext(FilterContext)
}

export function useFiltersDispatch() {
  return useContext(FilterDispatchContext)
}

export function useTemporaryFilters() {
  return useContext(TemporaryFilterContext)
}

export function useTemporaryFiltersDispatch() {
  return useContext(TemporaryFilterDispatchContext)
}

export default FilterProvider
