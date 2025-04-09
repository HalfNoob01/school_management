'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import { parentSchema, ParentSchema, } from '@/lib/fromValidationSchema';
import { Dispatch, SetStateAction, useActionState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createParent, updateParent } from '@/lib/actions';
import { toast } from 'react-toastify';

const ParentForm = ({ type, data, relatedData, setOpen }: { type: "create" | "update"; data?: any, relatedData?: any; setOpen: Dispatch<SetStateAction<boolean>> }) => {
  const [state, formAction, loading] = useActionState(type === "create" ? createParent : updateParent, { success: false, error: false });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParentSchema>({
    resolver: zodResolver(parentSchema),
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(() => {
      formAction(data)
    })

  })

  useEffect(() => {
    if (state.success) {
      toast(`Parent has been ${type === "create" ? "created" : "updated"}`)
      setOpen(false)
      router.refresh()
    }
  }, [state.success])

  const { students } = relatedData
  
  return (
    <form className="flex flex-col gap-8 p-3" onSubmit={onSubmit}>
      <h1 className='text-xl font-semibold'>{type === "create" ? "Create a new parent" : "Update the parent"}</h1>
      <span className='text-xs text-gray-400 font-medium'>Authentication Information</span>

      <div className='flex justify-between flex-wrap gap-4'>
        <InputField label='Username' name="username"  defaultValue={data?.username} register={register} error={errors.username} />
        <InputField label='Email' name="email" type='email' defaultValue={data?.email} register={register} error={errors.email} />
        <InputField label='Password' type='password'  name="password" defaultValue={data?.password} register={register} error={errors.password} />
      </div>

      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className='flex justify-between flex-wrap gap-4'>
        <InputField
          label="Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
        />
        <InputField
          label="surname"
          name="surname"
          defaultValue={data?.surname}
          register={register}
          error={errors.surname}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        {data && <InputField label='id' name="id" defaultValue={data?.id} register={register} error={errors?.id} hidden />}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Students</label>
          <div className="border ring-[1.5px] ring-gray-300 p-2 rounded-md text-[10px] space-y-1 max-h-32 overflow-y-auto">
            {students.map((student: { id: number; name: string; }) => (
              <label key={student.id} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  value={student.id}
                  {...register("students")}
                  className="accent-blue-500 w-3 h-3"
                />
                <span>{student.name}</span>
              </label>
            ))}
          </div>
          {errors.students?.message && <p className='text-xs text-red-400'>{errors.students?.message.toString()}</p>}
        </div>
     
      </div>
      {state.error && <span className='text-red-500'>Something went wrong - Try Hard Password</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
    </form>
  )
}

export default ParentForm
