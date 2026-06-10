import { Outlet } from 'react-router-dom'
import StudentSidebar from './StudentSidebar'
import TopBar from './TopBar'

export default function StudentLayout() {
  return (
    <div className="flex min-h-screen bg-cs-bg">
      <StudentSidebar />
      <div className="flex-1 ml-[280px] flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 pt-16 p-6 max-w-[1440px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
