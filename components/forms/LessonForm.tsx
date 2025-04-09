'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import { lessonSchema, LessonSchema } from '@/lib/fromValidationSchema';
import { createLesson, updateLesson } from '@/lib/actions';
import { Dispatch, SetStateAction, useActionState, useEffect, useTransition } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const LessonForm = ({ setOpen, type, data, relatedData }: { setOpen: Dispatch<SetStateAction<boolean>>, type: "create" | "update"; data?: any, relatedData?: any }) => {
  const [state, formAction, loading] = useActionState(
    type === "create" ? createLesson : updateLesson,
    { success: false, error: false }
  );  
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: data?.name || '',
      day: data?.day || '',
      startTime: data?.startTime || '',
      endTime: data?.endTime || '',
      subjectId: data?.subjectId || '',
      classId: data?.classId || '',
      teacherId: data?.teacherId || '',
      id: data?.id || undefined
    }
  });

  const onSubmit = handleSubmit((formData) => {
    startTransition(() => {
      formAction({
        ...formData,
        teacherId: formData.teacherId
      });
    });
  });

  useEffect(() => {
    if (state.success) {
      toast(`Lesson has been ${type === "create" ? "created" : "updated"}`);
      setOpen(false);
      router.refresh();
    }
  }, [state.success]);

  const { classItems, subjects, teachers } = relatedData;

  return (
    <form className="flex flex-col gap-8 p-3" onSubmit={onSubmit}>
      <h1 className='text-xl font-semibold'>{type === "create" ? "Create a new lesson" : "Update the lesson"}</h1>
      <div className='flex justify-between flex-wrap gap-4'>
        <InputField label='Name' name="name" register={register} error={errors.name} defaultValue={data?.name || ''} />

        {/* Day */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Day</label>
          <select
            {...register("day")}
            className={`border ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm ${errors.day ? 'border-red-500' : ''}`}
          >
            <option value="">Select Day</option>
            <option value="MONDAY">Monday</option>
            <option value="TUESDAY">Tuesday</option>
            <option value="WEDNESDAY">Wednesday</option>
            <option value="THURSDAY">Thursday</option>
            <option value="FRIDAY">Friday</option>
            <option value="SATURDAY">Saturday</option>
          </select>
          {errors.day && <p className="text-xs text-red-400">{errors.day.message}</p>}
        </div>

        {data && <InputField label='ID' name="id" register={register} error={errors?.id} hidden defaultValue={data?.id || ''} />}

        <InputField label='Start time' name="startTime" register={register} error={errors.startTime} type='datetime-local' defaultValue={data?.startTime } />
        <InputField label='End time' name="endTime" register={register} error={errors.endTime} type='datetime-local' defaultValue={data?.endTime } />

        {/* Subject */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subject</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("subjectId")}
          >
            <option value="">Select Subject</option>
            {subjects.map((subject: { id: number; name: string }) => (
              <option value={subject.id} key={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          {errors.subjectId?.message && <p className='text-xs text-red-400'>{errors.subjectId.message}</p>}
        </div>

        {/* Class */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classId")}
          >
            <option value="">Select Class</option>
            {classItems.map((classItem: { id: number; name: string }) => (
              <option value={classItem.id} key={classItem.id}>
                {classItem.name}
              </option>
            ))}
          </select>
          {errors.classId?.message && <p className='text-xs text-red-400'>{errors.classId.message}</p>}
        </div>

        {/* Teacher */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Teacher</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("teacherId")}
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher: { id: number; name: string }) => (
              <option value={teacher.id} key={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
          {errors.teacherId?.message && <p className='text-xs text-red-400'>{errors.teacherId.message}</p>}
        </div>
      </div>

      {state.error && <span className='text-red-500'>Something went wrong</span>}
      {isPending && <span className='text-green-500'>Loading...</span>}

      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default LessonForm;
