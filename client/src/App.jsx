import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import Home from "./components/Home.jsx";
// import Login from "./components/Login.jsx";
// import SignUp from "./components/SignUp.jsx";

function App() {
  const router = createBrowserRouter([
    // {
    //   path: "/",
    //   element: <Home />,
    // },
    // {
    //   path: "/login",
    //   element: <Login />,
    // },
    // {
    //   path: "/signup",
    //   element: <SignUp />,
    // },
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
