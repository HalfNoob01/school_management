import Announcement from "@/components/Announcement";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import CountChartContainer from "@/components/CountChartContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";

export default function AdminPage({searchParams} : {searchParams : {[keys : string] : string | undefined}}) {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row ">
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
           <div className="flex gap-4 justify-between flex-wrap">
            <UserCard type="admin"/>
            <UserCard type="student"/>
            <UserCard type="teacher"/>
            <UserCard type="parent"/>
           </div>
         <div className="flex gap-4 flex-col lg:flex-row">
        {/* Count Chart */}
        <div className="w-full lg:w-1/3 h-[450px]">
         <CountChartContainer />
        </div>
        {/* Attendance Chart */}
        <div className="w-full lg:w-2/3 h-[450px]">
          <AttendanceChartContainer/>
        </div>
      </div>

      <div className="w-full h-[500px]">
        <FinanceChart/>
      </div>

      </div>
      
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <EventCalendarContainer searchParams={searchParams} />
          <Announcement />
      </div>
    </div>
  )
}
