import {  z } from "zod";

export const subjectSchema = z.object({
    id : z.coerce.number().optional(),
    name : z.string().min(1, {message : "Subject name is required!"}),
    teachers : z.array(z.string())
})

export type SubjectSchema = z.infer<typeof subjectSchema>

export const classSchema = z.object({
    id : z.coerce.number().optional(),
    name : z.string().min(1, {message : "Class name is required!"}),
    capacity : z.coerce.number().min(1, {message : "Capacity is required!"}),
    gradeId : z.coerce.number().min(1,{message : "Grade name is required!"}),
    supervisorId : z.coerce.string().optional()
});

export type ClassSchema = z.infer<typeof classSchema>


export const teacherSchema = z.object({
    id: z.string().optional(),
    username : z.string()
              .min(3, {message : "Username must be 3 characters long!"})
              .max(20, "Username must be at 20 characters long!"),
    email : z.string().email({message : "Invalid email"}).optional().or(z.literal("")),
    password : z.string().min(8,{message : "Password must be at least 8 characters long!"}).optional().or(z.literal("")),
    name : z.string().min(1,{ message : "name is reequired"}),
    surname : z.string().min(1,{ message : "surname is reequired"}),
    phone : z.string().optional(),
    address : z.string(),
    img : z.string().optional(),
    birthday : z.coerce.date({ message : "BirthDay is required!"}),
    sex : z.enum(["MALE","FEMALE"],{message : "Sex is requires!"}),
    bloodType : z.string().min(1,{message : "Blood Type is required!"}),
    subjects : z.array(z.string() || z.boolean()).optional()    
})

export type TeacherSchema = z.infer<typeof teacherSchema>


export const studentSchema = z.object({
    id: z.string().optional(),
    username : z.string()
              .min(3, {message : "Username must be 3 characters long!"})
              .max(20, "Username must be at 20 characters long!"),
    email : z.string().email({message : "Invalid email"}).optional().or(z.literal("")),
    password : z.string().min(8,{message : "Password must be at least 8 characters long!"}).optional().or(z.literal("")),
    name : z.string().min(1,{ message : "name is reequired"}),
    surname : z.string().min(1,{ message : "surname is reequired"}),
    phone : z.string().optional(),
    address : z.string(),
    img : z.string().optional(),
    birthday : z.coerce.date({ message : "BirthDay is required!"}),
    sex : z.enum(["MALE","FEMALE"],{message : "Sex is requires!"}),
    bloodType : z.string().min(1,{message : "Blood Type is required!"}),
    subjects : z.array(z.string() || z.boolean()).optional(),
    gradeId : z.coerce.number().min(1,{message : "Grade is required!"}),
    classId : z.coerce.number().min(1,{message: "classId is required!"}),
    parentId : z.string().min(1,{message:"Parent ID is reuired!"})    
})

export type StudentSchema = z.infer<typeof studentSchema>

export const examSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, { message: "Title is required!" }),
    startTime: z.coerce.date({ message: "Start time is required!" }),
    endTime: z.coerce.date({ message: "End time is required!" }),
    lessonId: z.coerce.number({ message: "Lesson is required!" }),
  });
  
  export type ExamSchema = z.infer<typeof examSchema>;


 export const announcementSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, { message: "Title  is required!" }),
    date: z.coerce.date({ message: "date is required!" }),
    description: z.string({message : "description is required!"}),
    classId: z.coerce.number({ message: "Class is required!" }),
  });
  
  export type AnnouncementSchema = z.infer<typeof announcementSchema> ;

  export const eventSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, { message: "Title is required!" }),
    startTime: z.coerce.date({ message: "Start time is required!" }),
    endTime: z.coerce.date({ message: "End time is required!" }),
    classId: z.coerce.number({ message: "Class is required!" }),
    description: z.string({message : "description is required!"}),
  });
  
  export type EventSchema = z.infer<typeof eventSchema>;


  export const parentSchema = z.object({
    id: z.string().optional(),
    username : z.string()
              .min(3, {message : "Username must be 3 characters long!"})
              .max(20, "Username must be at 20 characters long!"),
    email : z.string().email({message : "Invalid email"}).optional().or(z.literal("")),
    password : z.string().min(8,{message : "Password must be at least 8 characters long!"}).optional().or(z.literal("")),
    name : z.string().min(1,{ message : "name is reequired"}),
    surname : z.string().min(1,{ message : "surname is reequired"}),
    phone : z.string({message : "phone is required!"}),
    address : z.string(),
    students : z.array(z.string() || z.boolean()).optional()
})

export type ParentSchema = z.infer<typeof parentSchema>;

export const resultSchema = z.object({
  id : z.coerce.number().optional(),
  score : z.coerce.number().min(1, {message : "Score is required!"}),
  examId : z.coerce.number().optional(),
  assignmentId : z.coerce.number().optional(),
  studentId : z.coerce.string({message : 'Student is required!'})
});

export type ResultSchema = z.infer<typeof resultSchema>



export const lessonSchema = z.object({
  id : z.coerce.number().optional(),
  name: z.string().min(1, { message: "Name is required!" }),
  day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"],{message : "This is a required field!"}),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  subjectId : z.coerce.number({message : "Subject is required!"}),
  classId : z.coerce.number({message : "Class is required!"}),
  teacherId : z.coerce.string({message : "Teacher is required!"}) 
});

export type LessonSchema = z.infer<typeof lessonSchema>

export const assignmentSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  startDate: z.coerce.date({ message: "Start Date is required!" }),
  dueDate: z.coerce.date({ message: "Due Date is required!" }),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
});

export type AssignmentSchema = z.infer<typeof assignmentSchema>;
