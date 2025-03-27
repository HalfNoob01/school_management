import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role, studentsData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

type Student = {
  id : number;
  studentId : string;
  name : string;
  email?:string;
  photo:string;
  phone? : string;
  grade : number;
  class : string;
  address : string;
}

const columns = [
  {
    header : "Info",
    accessor : "info"
  },
  {
    header : "Student ID", accessor : "studentId" , className : "hidden md:table-cell"
  },
  {
    header : "Grade", accessor : "grade" , className : "hidden md:table-cell"
  },
  {
    header : "Phone", accessor : "phone" , className : "hidden lg:table-cell"
  },
  {
    header : "Address", accessor : "address" , className : "hidden lg:table-cell"
  },
  {
    header : "Actions", accessor : "action" 
  },
];

export default function StudentListPage() {
  const renderRow = (item : Student) => {
    return (
      <tr key={item.id} className="border-6 border-gray-200 even:bg-slate-50 text-sm hover:bg-mainPurpleLight">
      <td className="flex items-center gap-4 p-4">
        <Image src={item.photo} alt="" width={40} height={40} className="md:hidden xl:block w-10 h-10 rounded-full object-cover"/>
        <div className="">
           <h3 className="font-semibold">{item.name}</h3>
           <p className="text-xs text-gray-500">{item.class}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.studentId}</td>
      <td className="hidden md:table-cell">{item.grade}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
       <td>
       <div className="flex items-center gap-2">
        <Link href={`/list/Students/${item.id}`}>
         <button className="w-7 h-7 flex items-center justify-center rounded-full bg-mainSky">
          <Image src="/view.png" alt="" width={16} height={16}/>
         </button> 
        </Link>
      {role === "admin" &&( 
        // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-mainPurple">
        //   <Image src="/delet.png" alt="" width={16} height={16}/>
        //  </button> 
        <FormModal table="student" type="delete" id={item.id}/>
        )}
      </div>
       </td>
     </tr>
    )
  }
  return (
    <div className="bg-white  p-4 rounded-md  flex-1  m-4 mt-0">
     {/* Top */}
     <div className="flex items-center justify-between">
         <h1 className="hidden md:block text-lg font-semibold">All Students</h1>
         <div className="flex flex-col md:flex-row items-center gap-4  w-full md:w-auto"> 
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-mainYellow cursor-pointer">
              <Image src="/filter.png" alt="" width={14}  height={14}/>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-mainYellow cursor-pointer">
              <Image src="/sort.png" alt="" width={14}  height={14}/>
            </button>
           {role === "admin" && ( 
            // <button className="w-8 h-8 flex items-center justify-center rounded-full bg-mainYellow cursor-pointer">
            //   <Image src="/plus.png" alt="" width={14}  height={14}/>
            // </button>
            <FormModal table="student" type="create" />
          )}
          </div>
         </div>
     </div>
     {/* List */}
     <Table  columns={columns} renderRow={renderRow} data={studentsData}/>
     {/* Pageination */}
     <Pagination/>
    </div>
  )
}
