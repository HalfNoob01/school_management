import Announcement from "@/components/Announcement";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function StudentPage() {
  const {userId} = await auth();

  const classItem = await prisma.class.findMany({
    where : {
      students : { some : { id : userId!}}
    }
  })
 
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-bold">Schedule (4A)</h1>
          <BigCalendarContainer type="classId" id={classItem[0].id}/>
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
      <EventCalendar />
      <Announcement />
      </div>
    </div>
  )
}
