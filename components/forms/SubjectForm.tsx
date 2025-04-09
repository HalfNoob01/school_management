'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import { subjectSchema, SubjectSchema } from '@/lib/fromValidationSchema';
import { createSubject, updateSubject } from '@/lib/actions';
import { Dispatch, SetStateAction, useActionState, useEffect, useTransition } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const SubjectForm =  ({ setOpen, type, data, relatedData }: { setOpen: Dispatch<SetStateAction<boolean>>, type: "create" | "update"; data?: any, relatedData?: any }) => {
  const [state, formAction, loading] = useActionState(type === "create" ? createSubject : updateSubject, { success: false, error: false });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
  });

  const onSubmit = handleSubmit((data) => {

    startTransition(() => {
      formAction(data)
    })

  })

  useEffect(() => {
    if (state.success) {
      toast(`Subject has been ${type === "create" ? "created" : "updated"}`)
      setOpen(false)
      router.refresh()
    }
  }, [state.success])

  const { teachers  }  =   relatedData

  return (
    <form className="flex flex-col gap-8 p-3" onSubmit={onSubmit}>
      <h1 className='text-xl font-semibold'>{type === "create" ? "Create a new subject" : "Update the subject"}</h1>
      <div className='flex justify-between flex-wrap gap-4'>
        <InputField label='Subject name' name="name" defaultValue={data?.name} register={register} error={errors.name} />
        {data && <InputField label='id' name="id" defaultValue={data?.id} register={register} error={errors?.id} hidden />}

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Teachers</label>
          <div className="border ring-[1.5px] ring-gray-300 p-2 rounded-md text-[10px] space-y-1 max-h-32 overflow-y-auto">
            {teachers.map((teacher: { id: string; name: string; surname: string }) => (
              <label key={teacher.id} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  value={teacher.id}
                  {...register("teachers")}
                  className="accent-blue-500 w-3 h-3"
                />
                <span>{teacher.name + " " + teacher.surname}</span>
              </label>
            ))}
          </div>
          {errors.teachers?.message && <p className='text-xs text-red-400'>{errors.teachers?.message.toString()}</p>}
        </div>
      </div>

      {state.error && <span className='text-red-500'>Something went wrong</span>}
      {isPending && <span className='text-green-500'>Loading...</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
    </form>
  )
}

export default SubjectForm;
