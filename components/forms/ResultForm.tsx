'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useTransition,
  useState,
} from 'react';
import {
  createResult,
  updateResult,
} from '@/lib/actions';
import { useRouter } from 'next/navigation';
import {
  resultSchema,
  ResultSchema,
} from '@/lib/fromValidationSchema';
import { toast } from 'react-toastify';

const ResultForm = ({
  setOpen,
  type,
  data,
  relatedData,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: 'create' | 'update';
  data?: any;
  relatedData?: any;
}) => {
  const [state, formAction, loading] = useActionState(
    type === 'create' ? createResult : updateResult,
    { success: false, error: false }
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      ...data,
    },
  });

  const selectedExam = watch('examId');
  const selectedAssignment = watch('assignmentId');

  const onSubmit = handleSubmit((data) => {
    let payload;
  
    if (type === 'update') {
      payload = {
        id: data.id,
        score: data.score,
      };
    } else {
      payload = { ...data };
      if (!payload.examId) delete payload.examId;
      if (!payload.assignmentId) delete payload.assignmentId;
    }
  
    startTransition(() => {
      formAction(payload as any);
    });
  });
  

  useEffect(() => {
    if (state.success) {
      toast(
        `Result has been ${type === 'create' ? 'created' : 'updated'}`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state.success]);

  const { exams, assignments, students } = relatedData || {};

  return (
    <form
      className="flex flex-col gap-6 p-4"
      onSubmit={onSubmit}
    >
      <h1 className="text-xl font-semibold">
        {type === 'create' ? 'Create a new result' : 'Update the result'}
      </h1>

      {data && (
        <InputField
          label="id"
          name="id"
          defaultValue={data?.id}
          register={register}
          error={errors?.id}
          hidden
        />
      )}

      {type === 'create' && (
        <div className="flex flex-wrap gap-4">
          {/* Student */}
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Student</label>
            <select
              className="border ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register('studentId')}
              defaultValue={data?.students}
            >
              <option value="">Select student</option>
              {students?.map(
                (student: { id: string; name: string }) => (
                  <option value={student.id} key={student.id}>
                    {student.name}
                  </option>
                )
              )}
            </select>
            {errors.studentId?.message && (
              <p className="text-xs text-red-400">
                {errors.studentId?.message.toString()}
              </p>
            )}
          </div>

          {/* Assignment */}
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Assignment</label>
            <select
              className="border ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register('assignmentId')}
              defaultValue={data?.assignments}
              disabled={!!selectedExam}
            >
              <option value="">Select assignment</option>
              {assignments?.map(
                (assignment: { id: number; title: string }) => (
                  <option value={assignment.id} key={assignment.id}>
                    {assignment.title}
                  </option>
                )
              )}
            </select>
            {errors.assignmentId?.message && (
              <p className="text-xs text-red-400">
                {errors.assignmentId?.message.toString()}
              </p>
            )}
          </div>

          {/* Exam */}
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Exam</label>
            <select
              className="border ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register('examId')}
              defaultValue={data?.exams}
              disabled={!!selectedAssignment}
            >
              <option value="">Select exam</option>
              {exams?.map((exam: { id: number; title: string }) => (
                <option value={exam.id} key={exam.id}>
                  {exam.title}
                </option>
              ))}
            </select>
            {errors.examId?.message && (
              <p className="text-xs text-red-400">
                {errors.examId?.message.toString()}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Score - always show */}
      <InputField
        label="Score"
        name="score"
        defaultValue={data?.score}
        register={register}
        error={errors.score}
      />

      {state.error && (
        <span className="text-red-500">Something went wrong</span>
      )}
      {isPending && (
        <span className="text-green-500">Loading...</span>
      )}

      <button
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-all duration-200"
        type="submit"
      >
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default ResultForm;
