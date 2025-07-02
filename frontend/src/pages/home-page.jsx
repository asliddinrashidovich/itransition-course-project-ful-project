import { NonAuthHero, PublicTemplates, ResentTempletes, StartNewForm } from "../components"

function HomePage() {
  const token = localStorage.getItem('token')
  return (
    <>
      {!token && <div>
        <NonAuthHero/>
        <PublicTemplates/>
      </div>}
      {token && <div>
        <StartNewForm/>
        <ResentTempletes/>
      </div>}
    </>
  )
}

export default HomePage