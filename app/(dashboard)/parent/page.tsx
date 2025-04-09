import Announcement from "@/components/Announcement";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function ParentPage() {
    const {userId} = await auth(); 

    const students = await prisma.student.findMany({
      where: {
        parentId: userId!,
      },
    });
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row flex-1">
      {/* LEFT */}
      <div className="">
        {students.map((student) => (
          <div className="w-full xl:w-2/3" key={student.id}>
            <div className="h-full bg-white p-4 rounded-md">
              <h1 className="text-xl font-semibold">
                Schedule ({student.name + " " + student.surname})
              </h1>
              <BigCalendarContainer type="classId" id={student.classId} />
            </div>
          </div>
        ))}
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
      <EventCalendar />
      <Announcement />
      </div>
    </div>
  )
}
