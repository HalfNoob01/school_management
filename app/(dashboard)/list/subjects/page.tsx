import { Prisma, Subject, Teacher } from ".prisma/client";
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

type SubjectList = Subject & {teachers : Teacher[]}


export default async function SubjectsPage({searchParams} : {searchParams : SearchParams}) {
   
   const { sessionClaims } = await  auth();
   const role = (sessionClaims?.metadata as {role?: string})?.role;  
  
   const columns = [
    {
      header : "Subject Name",
      accessor : "name"
    },
    {
      header : "Teacher", accessor : "teacher" , className : "hidden md:table-cell"
    },
    {
      header : "Actions", accessor : "action" 
    },
  ];
  
  const renderRow = (item : SubjectList) => {
    return (
      <tr key={item.id} className="border-6 border-gray-200 even:bg-slate-50 text-sm hover:bg-mainPurpleLight">
      <td className="flex items-center gap-4 p-4">
        {item.name}
      </td>
      <td className="hidden md:table-cell">
      {item.teachers.map(teacher => teacher.name).join(",")}
      </td>
       <td>
       <div className="flex items-center gap-2">
      {role === "admin" &&( 
        <>
         <FormContainer table="subject" type="update" data={item}/>
         <FormContainer table="subject" type="delete" id={item.id}/>
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
   const query : Prisma.SubjectWhereInput = {};

    if(queryParams) {
      for(const [key,value] of Object.entries(queryParams)) {
        if(value !== undefined) {
          switch(key) {
              case  "search" :
                query.name = {contains:value, mode:"insensitive"}
                break;
              default:
                break;
          }
        }

      }
    }
  const [data,count] = await prisma.$transaction([
     prisma.subject.findMany({
      where : query,
      include : {
        teachers : true
      },
      take : ITEM_PER_PAGE,
      skip : ITEM_PER_PAGE * ( p - 1 )
    }),
     prisma.subject.count({
      where : query,
     })
  ])

  return (
    <div className="bg-white  p-4 rounded-md  flex-1  m-4 mt-0">
     {/* Top */}
     <div className="flex items-center justify-between">
         <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
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
          <FormContainer table="subject" type="create" />

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
