import { Announcement, Class, Prisma } from ".prisma/client";
import FormContainer from "@/components/FormContainer";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { SearchParams } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

type AnnouncementList = Announcement & { class : Class}


export default async function AnnouncementsPage({searchParams} : {searchParams : SearchParams}) {

  const {userId , sessionClaims } = await  auth();
  const role = (sessionClaims?.metadata as {role?: string})?.role;  
  const currentUserId = userId;

  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Class",
      accessor: "class",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
   ...(role === "admin" ? [ {
      header : "Actions", accessor : "action" ,
      accessore :"action"
    }] : []),
  ];
  
  const renderRow = async (item : AnnouncementList) => {
    const { sessionClaims } = await  auth();
     const role = (sessionClaims?.metadata as {role?: string})?.role;  
    
    return (
      <tr key={item.id} className="border-6 border-gray-200 even:bg-slate-50 text-sm hover:bg-mainPurpleLight">
      <td className="flex items-center gap-4 p-4">{item.title} </td>
      <td className="">{item.class?.name || "-"}</td>
      <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-us").format(item.date)}</td>
       <td>
       <div className="flex items-center gap-2">
      {role === "admin" &&( 
         <>
          <FormContainer table="announcement" type="update" data={item}/>
          <FormContainer table="announcement" type="delete" id={item.id}/>
         </>
       )}
      </div>
       </td>
     </tr>
    )
  }


  const { page, ...queryParams } =  await searchParams;
  
   const p = page ? parseInt(page) : 1;
   
   // URL PARAMS CONDITION
   const query : Prisma.AnnouncementWhereInput = {};

    if(queryParams) {
      for(const [key,value] of Object.entries(queryParams)) {
        if(value !== undefined) {
          switch(key) {
              case  "search" :
                query.title = {contains:value, mode:"insensitive"}
                break;
              default:
                  break;
          }
        }

      }
    }

     // ROLE CONDITIONS
  const roleConditions = {
    teacher : { lessons: { some : { teacherId : currentUserId!}}},
    student : { students: { some : { id : currentUserId! }}},
    parent : { students: { some : { parentId : currentUserId! }}},
  }

  
  if (role !== "admin") {
    query.OR = [
      { classId: null },
      { class: roleConditions[role as keyof typeof roleConditions] || {} },
    ];
  }

  const [data,count] = await prisma.$transaction([
     prisma.announcement.findMany({
      where : query,
      include : {
        class : true
      },
      take : ITEM_PER_PAGE,
      skip : ITEM_PER_PAGE * ( p - 1 )
    }),
     prisma.announcement.count({
      where : query,
     })
  ])

  return (
    <div className="bg-white  p-4 rounded-md  flex-1  m-4 mt-0">
     {/* Top */}
     <div className="flex items-center justify-between">
         <h1 className="hidden md:block text-lg font-semibold">All Announcements</h1>
         <div className="flex flex-col md:flex-row items-center gap-4  w-full md:w-auto"> 
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-mainYellow cursor-pointer">
              <Image src="/filter.png" alt="" width={14}  height={14}/>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-mainYellow cursor-pointer">
              <Image src="/sort.png" alt="" width={14}  height={14}/>
            </button>
         { role === "admin" && ( 
           <FormContainer table="announcement" type="create" />
          )}
          </div>
         </div>
     </div>
     {/* List */}
     <Table  columns={columns} renderRow={renderRow} data={data}/>
     {/* Pageination */}
     <Pagination page={p} count={count}/>
    </div>
  )
}
