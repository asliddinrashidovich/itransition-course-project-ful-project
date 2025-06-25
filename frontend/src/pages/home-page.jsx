import { Header, NonAuthHero, ResentTempletes, StartNewForm } from "../components"

function HomePage() {
  const token = localStorage.getItem('token')
  return (
    <>
      {!token && <NonAuthHero/>}
      {token && <div>
        <StartNewForm/>
        <ResentTempletes/>
      </div>}
    </>
  )
}

export default HomePage