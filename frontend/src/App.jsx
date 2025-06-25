import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import MainLayout from "./layout/main-layout"
import { CreateTemplatePage, HomePage, LoginPage, NotFoundPage, ProfilePage, RegisterPage } from "./pages"

function App() {
    const routes = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<MainLayout/>}>
          <Route index element={<HomePage/>}/>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="templates/:id" element={<CreateTemplatePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage/>}/>
        </Route>
      </>
    )
  )
  return (
    <>
      <RouterProvider router={routes}/>
    </>
  )
}

export default App