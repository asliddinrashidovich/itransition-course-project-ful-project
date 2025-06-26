import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import MainLayout from "./layout/main-layout"
import { CreateTemplatePage, FormPreview, HomePage, LoginPage, NotFoundPage, ProfilePage, RegisterPage } from "./pages"
import FormLayout from "./layout/form-layout"

function App() {
    const routes = createBrowserRouter(
    createRoutesFromElements(
     <>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="templates/:id" element={<CreateTemplatePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route element={<FormLayout />}>
          <Route path="form/:id" element={<FormPreview />} />
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