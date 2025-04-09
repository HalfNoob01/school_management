'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import { eventSchema, EventSchema  } from '@/lib/fromValidationSchema';
import { createEvent, updateEvent,  } from '@/lib/actions';
import { Dispatch, SetStateAction, useActionState, useEffect, useTransition } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const EventForm =  ({ setOpen, type, data, relatedData }: { setOpen: Dispatch<SetStateAction<boolean>>, type: "create" | "update"; data?: any, relatedData?: any }) => {
  const [state, formAction, loading] = useActionState(type === "create" ? createEvent : updateEvent, { success: false, error: false });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
  });

  const onSubmit = handleSubmit((data) => {

    startTransition(() => {
      formAction(data)
    })

  })

  useEffect(() => {
    if (state.success) {
      toast(`Event has been ${type === "create" ? "created" : "updated"}`)
      setOpen(false)
      router.refresh()
    }
  }, [state.success])

  const { classItems }  =  relatedData

  return (
    <form className="flex flex-col gap-8 p-3" onSubmit={onSubmit}>
      <h1 className='text-xl font-semibold'>{type === "create" ? "Create a new Event" : "Update the Event"}</h1>
      <div className='flex justify-between flex-wrap gap-4'>
        <InputField label='Event title' name="title" defaultValue={data?.title} register={register} error={errors.title} />
        <InputField label='Description' name="description" defaultValue={data?.description} register={register} error={errors.description} />
        <InputField label='Start date' name="startTime" defaultValue={data?.startTime} register={register} error={errors.startTime} type='datetime-local' />
        <InputField label='End date' name="endTime" defaultValue={data?.endTime} register={register} error={errors.endTime} type='datetime-local' />
        {data && <InputField label='id' name="id" defaultValue={data?.id} register={register} error={errors?.id} hidden />}

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select className="border ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("classId")} defaultValue={data?.classId}>
             {classItems.map(
             ( classItem: {id:number; name : string }) => (
               <option value={classItem.id} key={classItem.id} defaultValue={data && classItem.id === data.classId}>
                    {classItem.name}
               </option>
             )
             )}
          </select>
          {errors.classId?.message && <p className='text-xs text-red-400'>{errors.classId?.message.toString()}</p>}
        </div>
      </div>

      {state.error && <span className='text-red-500'>Something went wrong</span>}
      {isPending && <span className='text-green-500'>Loading...</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
    </form>
  )
}

export default EventForm;
