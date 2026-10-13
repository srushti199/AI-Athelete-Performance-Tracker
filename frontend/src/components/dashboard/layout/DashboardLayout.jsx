import Sidebar from "../sidebar";
import DashboardHeader from "../DashboardHeader";

export default function DashboardLayout({ children, name = "" }) {
  return (
    <div className='min-h-screen bg-[#F8FAFE] md:flex'>
      {/* Sidebar */}
      <div className='hidden md:block md:w-72 md:shrink-0'>
        <div className='fixed left-0 top-0 h-screen w-72'>
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className='min-w-0 flex-1 md:ml-0'>
        <DashboardHeader name={name} />

        <main className='mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8'>{children}</main>
      </div>
    </div>
  );
}
