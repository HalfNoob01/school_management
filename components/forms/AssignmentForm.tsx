'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import { AssignmentSchema, assignmentSchema, examSchema, ExamSchema } from '@/lib/fromValidationSchema';
import { createAssignment, createExam,  updateAssignment,  updateExam } from '@/lib/actions';
import { Dispatch, SetStateAction, useActionState, useEffect, useTransition } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const AssignmentForm =  ({ setOpen, type, data, relatedData }: { setOpen: Dispatch<SetStateAction<boolean>>, type: "create" | "update"; data?: any, relatedData?: any }) => {
  const [state, formAction, loading] = useActionState(type === "create" ? createAssignment : updateAssignment, { success: false, error: false });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentSchema>({
    resolver: zodResolver(assignmentSchema),
  });

  const onSubmit = handleSubmit((data) => {

    startTransition(() => {
      formAction(data)
    })

  })

  useEffect(() => {
    if (state.success) {
      toast(`Assignment has been ${type === "create" ? "created" : "updated"}`)
      setOpen(false)
      router.refresh()
    }
  }, [state.success])

  const { lessons  }  =   relatedData

  return (
    <form className="flex flex-col gap-8 p-3" onSubmit={onSubmit}>
      <h1 className='text-xl font-semibold'>{type === "create" ? "Create a new assignment" : "Update the assignment"}</h1>
      <div className='flex justify-between flex-wrap gap-4'>
        <InputField label='Assignment title' name="title" defaultValue={data?.title} register={register} error={errors.title} />
        <InputField label='Start date' name="startDate" defaultValue={data?.startDate} register={register} error={errors.startDate} type='datetime-local' />
        <InputField label='Due date' name="dueDate" defaultValue={data?.dueDate} register={register} error={errors.dueDate} type='datetime-local' />
        {data && <InputField label='id' name="id" defaultValue={data?.id} register={register} error={errors?.id} hidden />}

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Lessons</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("lessonId")}
            defaultValue={data?.lessonId}
          >
            {lessons.map((lesson: { id: number; name: string }) => (
              <option value={lesson.id} key={lesson.id} >
                {lesson.name}
              </option>
            ))}
          </select>
          {errors.lessonId?.message && <p className='text-xs text-red-400'>{errors.lessonId?.message.toString()}</p>}
        </div>
      </div>

      {state.error && <span className='text-red-500'>Something went wrong</span>}
      {isPending && <span className='text-green-500'>Loading...</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
    </form>
  )
}

export default AssignmentForm;
