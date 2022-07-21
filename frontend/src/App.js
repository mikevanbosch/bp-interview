import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"

import Home from "./Components/Home"

const queryClient = new QueryClient()

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    </div>
  )
}

export default App
