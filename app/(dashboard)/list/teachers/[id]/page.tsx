import { Teacher } from ".prisma/client";
import Announcement from "@/components/Announcement";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import FormContainer from "@/components/FormContainer";
import Performance from "@/components/Performance";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SingleTeacherPage({params} :  {params : {id : string}}) {
    const {id} = await params;
    const { sessionClaims } = await  auth();
    const role = (sessionClaims?.metadata as {role?: string})?.role;  
  
    const teacher : (Teacher & {_count : { subjects : number; lessons: number; classes : number  }} | null) = await prisma.teacher.findUnique({
      where : {id},
      include : {
        _count : {
          select : {
            subjects:true,
            lessons : true,
            classes : true
          }
        }
      }
    })
  
    if(!teacher) {
      return notFound()
    }
  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* Left */}
      <div className="w-full xl:w-2/3">
      {/* Top */}
      <div className="flex flex-col lg:flex-row gap-4">
      {/* User Info Card */}
         <div className="bg-mainSky px-6 py-4 rounded-md flex-1  flex gap-4">
          <div className="w-1/3">
          <Image src={teacher.img || "/noAvatar.png"} 
          alt="" width={144} height={144} className="w-36 h-36 rounded-full object-cover"/>
          </div>
          <div className="w-2/3 flex flex-col justify-between gap-4">
           <div className="flex items-center gap-4">
           <h1 className="text-xl font-semibold">{teacher.name  + " " + teacher.surname}</h1>
          {role === "admin" && <FormContainer table="teacher" type="update" data={teacher}/>}
          </div>
           <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
           <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
            <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                <Image src="/blood.png" alt="" width={14} height={14} />
                <span>{teacher.bloodType}</span>
            </div>
            <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                <Image src="/date.png" alt="" width={14} height={14} />
                <span>{new Intl.DateTimeFormat("en-GB").format(teacher.birthday)}</span>
            </div>
            <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                <Image src="/mail.png" alt="" width={14} height={14} />
                <span>{teacher.email || "-"}</span>
            </div>
            <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2" >
                <Image src="/phone.png" alt="" width={14} height={14} />
                <span>{teacher.phone || "-"}</span>
            </div>
           </div>
           <div>
           </div>
          </div>
         </div>
         {/* Small Cards */}
         <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* Card */}
           <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[40%] xl:w-[45%] 2xl:w-[48%]">
           <Image src="/singleAttendance.png" alt="" width={24} height={24} className="w-6 h-6"  />
            <div className="">
               <h1 className="text-xl font-semibold">90%</h1>
               <span className="text-sm text-gray-400">Attendance</span>
            </div>
           </div>

           <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[40%] xl:w-[45%] 2xl:w-[48%]">
           <Image src="/singleBranch.png" alt="" width={24} height={24} className="w-6 h-6"  />
            <div className="">
               <h1 className="text-xl font-semibold">{teacher._count.subjects}</h1>
               <span className="text-sm text-gray-400">Branches</span>
            </div>
           </div>
           <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[40%] xl:w-[45%] 2xl:w-[48%]">
           <Image src="/singleLesson.png" alt="" width={24} height={24} className="w-6 h-6"  />
            <div className="">
               <h1 className="text-xl font-semibold">{teacher._count.lessons}</h1>
               <span className="text-sm text-gray-400">Lessons</span>
            </div>
           </div>

           <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[40%] xl:w-[45%] 2xl:w-[48%]">
           <Image src="/singleClass.png" alt="" width={24} height={24} className="w-6 h-6"  />
            <div className="">
               <h1 className="text-xl font-semibold">{teacher._count.classes}</h1>
               <span className="text-sm text-gray-400">Classese</span>
            </div>
           </div>
         </div>
      </div>

      {/* Bottom */}
      <div className="mt-4 rounded-md p-4 h-[800px]">
        <h1>Teacher&apos;s Schedule</h1>
        <BigCalendarContainer type="teacherId" id={teacher.id}/>
      </div>
      </div>
      {/* Right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
      <div className="bg-white p-4 rounded-md">
        <h1 className="text-xl font-semibold">Shortcuts</h1>
        <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
           <Link className="p-3 rounded-md bg-mainSkyLight" href={`/list/classes?supervisorId=${'teacher2'}`}>Teacher&apos;s Classes</Link>
           <Link className="p-3 rounded-md bg-mainPurpleLight" href={`/list/students?teacherId=${"teacher2"}`}>Teacher&apos;s Students</Link>
           <Link className="p-3 rounded-md bg-mainYellowLight" href={`/list/lessons?teacherId=${"teacher2"}`}>Teacher&apos;s Lessons</Link>
           <Link className="p-3 rounded-md bg-pink-50" href={`/list/exams?teacherId=${'teacher2'}`}>Teacher&apos;s Exams</Link>
           <Link className="p-3 rounded-md bg-mainSkyLight" href={`/list/assignments?teacherId=${'teacher2'}`}>Teacher&apos;s Assignments</Link>
        </div>
      </div>
      <Performance/>
      <Announcement />
      </div>
    </div>
  )
}
