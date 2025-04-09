import Image from "next/image"
import EventList from "./EventList"
import EventCalendar from "./EventCalendar"

const EventCalendarContainer = async ({searchParams} : {searchParams : {[keys : string] : string | undefined}}) => {

const {date} = await searchParams;
  return (
   <div className="bg-white p-4 rounded-md ">
      <EventCalendar />
     
     <div className='flex justify-between items-center'>
        <h1 className='text-xl font-semibold my-4'>Event</h1>
        <Image src="/moreDark.png" alt='' width={20} height={20}  />
     </div>

      <div className='fle flex-col gap-4'>
        <EventList dateParam={date}/>
      </div>
      </div>
  )
}

export default EventCalendarContainer
