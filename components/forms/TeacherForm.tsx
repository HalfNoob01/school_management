'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import Image from 'next/image';
import { TeacherSchema, teacherSchema } from '@/lib/fromValidationSchema';
import { Dispatch, SetStateAction, useActionState, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createTeacher, updateTeacher } from '@/lib/actions';
import { toast } from 'react-toastify';
import { CldUploadWidget } from 'next-cloudinary';

const TeacherForm = ({ type, data, relatedData, setOpen }: { type: "create" | "update"; data?: any, relatedData?: any; setOpen: Dispatch<SetStateAction<boolean>> }) => {
  const [state, formAction, loading] = useActionState(type === "create" ? createTeacher : updateTeacher, { success: false, error: false });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [img,setImg] = useState<any>()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherSchema>({
    resolver: zodResolver(teacherSchema),
  });



  const onSubmit = handleSubmit((data) => {
    console.log(data)
    startTransition(() => {
      formAction({...data,img:img?.secure_url})
    })

  })

  useEffect(() => {
    if (state.success) {
      toast(`Teacher has been ${type === "create" ? "created" : "updated"}`)
      setOpen(false)
      router.refresh()
    }
  }, [state.success])

  const { subjects } = relatedData
  return (
    <form className="flex flex-col gap-8 p-3" onSubmit={onSubmit}>
      <h1 className='text-xl font-semibold'>{type === "create" ? "Create a new teacher" : "Update the teacher"}</h1>
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
        <InputField
          label="Blood Type"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors.bloodType}
        />
        <InputField
          label="birthday"
          name="birthday"
          defaultValue={data?.birthday.toISOString().split('T')[0]}
          register={register}
          error={errors.birthday}
          type="date"
        />

       {data && <InputField label='id' name="id" defaultValue={data?.id} register={register} error={errors?.id} hidden />}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select className='ring-[1.5px] ring-gray-300 p-2 rounded-md  text-sm w-full' {...register("sex")} defaultValue={data?.sex}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.sex?.message && <p className='text-xs text-red-400'>{errors.sex?.message.toString()}</p>}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subjects</label>
          <div className="border ring-[1.5px] ring-gray-300 p-2 rounded-md text-[10px] space-y-1 max-h-32 overflow-y-auto">
            {subjects.map((subject: { id: number; name: string; }) => (
              <label key={subject.id} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  value={subject.id}
                  {...register("subjects")}
                  className="accent-blue-500 w-3 h-3"
                />
                <span>{subject.name}</span>
              </label>
            ))}
          </div>
          {errors.subjects?.message && <p className='text-xs text-red-400'>{errors.subjects?.message.toString()}</p>}
        </div>
     
        <CldUploadWidget uploadPreset="school_management" onSuccess={(result,{widget}) => {
          setImg(result.info)
          widget.close()
        }}>
          {({ open }) => {
            return (
              <div className="text-xs text-gray-500 flex items-center gap-2  cursor-pointer" onClick={() => open()} >
              <Image src="/upload.png" alt='' width={28} height={28} />
              <span>Upload a photo</span>
            </div>
            );
          }}
        </CldUploadWidget>
      </div>
      {state.error && <span className='text-red-500'>Something went wrong - Try Hard Password</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
    </form>
  )
}

export default TeacherForm
