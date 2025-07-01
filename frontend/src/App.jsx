import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import MainLayout from "./layout/main-layout"
import { CreateTemplatePage, FormPreview, HomePage, LoginPage, NotFoundPage, ProfilePage, RegisterPage } from "./pages"
import FormLayout from "./layout/form-layout"
import { AccountDetails, AllTemplates, UsersManagment } from "./components"

function App() {
    const routes = createBrowserRouter(
    createRoutesFromElements(
     <>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="templates/:id" element={<CreateTemplatePage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="profile/" element={<ProfilePage/>}>
            <Route index element={<AccountDetails/>}/>
            <Route path="all-templates" element={<AllTemplates/>}/>
            <Route path="all-users" element={<UsersManagment/>}/>
          </Route>
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