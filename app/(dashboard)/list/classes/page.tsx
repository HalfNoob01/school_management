import { Class, Prisma, Teacher } from ".prisma/client";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { SearchParams } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

type ClassList = Class & {supervisor : Teacher}



export default async function ClassListPage({searchParams} : {searchParams : SearchParams}) {

  const { sessionClaims } = await  auth();
  const role = (sessionClaims?.metadata as {role?: string})?.role;  

  const columns = [
    {
      header : "Class Name",
      accessor : "name"
    },
    {
      header : "Capacity", accessor : "capacity", className : "hidden md:table-cell"
    },
    {
      header : "Grade", accessor : "grade" , className : "hidden md:table-cell"
    },
    {
      header : "Supervisor", accessor : "supervisor" , className : "hidden md:table-cell"
    },
  ...(role === "admin" ?  [{
      header : "Actions", accessor : "action" 
    }] : []),
  ];
  
  const renderRow = (item : ClassList) => {
    return (
      <tr key={item.id} className="border-6 border-gray-200 even:bg-slate-50 text-sm hover:bg-mainPurpleLight">
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td className="hidden md:table-cell">{item.capacity}</td>
      <td className="hidden md:table-cell">{item.name[0]}</td>
      <td className="hidden md:table-cell">{item.supervisor.name + " " + item.supervisor.surname}</td>
       <td>
       <div className="flex items-center gap-2">
      {role === "admin" &&( 
         <>
          <FormContainer table="class" type="update" data={item}/>
          <FormContainer table="class" type="delete" id={item.id}/>
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
   const query : Prisma.ClassWhereInput = {};

    if(queryParams) {
      for(const [key,value] of Object.entries(queryParams)) {
        if(value !== undefined) {
          switch(key) {
            case  "supervisorId" :
              query.supervisorId = value
              break;
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
     prisma.class.findMany({
      where : query,
      include : {
        supervisor : true
      },
      take : ITEM_PER_PAGE,
      skip : ITEM_PER_PAGE * ( p - 1 )
    }),
     prisma.class.count({
      where : query,
     })
  ])


  return (
    <div className="bg-white  p-4 rounded-md  flex-1  m-4 mt-0">
     {/* Top */}
     <div className="flex items-center justify-between">
         <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
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
            <FormContainer table="class" type="create" />
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
