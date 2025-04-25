import { RouterProvider } from "react-router";
import { routes } from "./config/router"


function App() {

  return (
      <RouterProvider router={routes} />
  )
}

export default App
