

const Announcement = () => {
  return (
    <div className="bg-white p-4 rounded-md">
        <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold ">Announcement</h1>
            <span className="text-xs text-gray-400 cursor-pointer">View All</span>
        </div>

        <div className="flex flex-col gap-4 mt-4">
         <div className="bg-mainSkyLight rounded-md p-4">
               <div className="flex items-center justify-between">
                 <h2 className="font-medium">Lorem ipsum dolor sit</h2>
                 <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">2025-03-22</span>
               </div >
               <p className="text-sm text-gray-400 mt-1">Lorem ipsum dolor, sit amet consectetur adipisicing elit. In, voluptate.</p>
         </div>

         <div className="bg-mainPurpleLight rounded-md p-4">
               <div className="flex items-center justify-between">
                 <h2 className="font-medium">Lorem ipsum dolor sit</h2>
                 <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">2025-03-22</span>               
               </div >
               <p className="text-sm text-gray-400 mt-1">Lorem ipsum dolor, sit amet consectetur adipisicing elit. In, voluptate.</p>
         </div>

         <div className="bg-mainYellowLight rounded-md p-4">
               <div className="flex items-center justify-between">
                 <h2 className="font-medium">Lorem ipsum dolor sit</h2>
                 <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">2025-03-22</span>
               </div >
               <p className="text-sm text-gray-400 mt-1">Lorem ipsum dolor, sit amet consectetur adipisicing elit. In, voluptate.</p>
         </div>
        </div>
    </div>
  )
}

export default Announcement
