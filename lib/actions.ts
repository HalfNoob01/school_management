"use server"

import { AnnouncementSchema, AssignmentSchema, ClassSchema, EventSchema, ExamSchema, LessonSchema, ParentSchema, ResultSchema, StudentSchema, SubjectSchema, TeacherSchema } from "./fromValidationSchema";
import { prisma } from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";

export const createSubject = async (currentState : { success : boolean; error : boolean} ,data:SubjectSchema) => {
  try {
       await prisma.subject.create({
          data :  {
            name : data.name,
            teachers : {
              connect : data.teachers.map((teacherId) => ({id:teacherId}))
            }
          }
       })

      //  revalidatePath("/list/subject")
       return {success : true, error : false}
    }catch (error) {
        console.log(error)
        return {success : false, error : true}
    }
}

export const updateSubject = async (currentState : { success : boolean; error : boolean}, data:SubjectSchema) => {
  try {
       await prisma.subject.update({
         where : {
          id : data?.id
         },
         data : {
          name : data.name,
          teachers : {
            set : data.teachers.map((teacherId) => ({ id : teacherId }))
          }
         }
       })

      //  revalidatePath("/list/subject")
       return {success : true, error : false}
    }catch (error) {
        console.log(error)
        return {success : false, error : true}
    }
}

export const deleteSubject = async (currentState : { success : boolean; error : boolean}, data:FormData) => {
   const id = data.get("id") as string;  
   
  try {
       await prisma.subject.delete({
         where : {
          id : parseInt(id)
         }
       })

      //  revalidatePath("/list/subject")
       return {success : true, error : false}
    }catch (error) {
        console.log(error)
        return {success : false, error : true}
    }
}

export const createClass = async (currentState : { success : boolean; error : boolean} ,data:classSchema) => {
  try {
       await prisma.class.create({
          data 
       })

      //  revalidatePath("/list/class")
       return {success : true, error : false}
    }catch (error) {
        console.log(error)
        return {success : false, error : true}
    }
}

export const updateClass = async (currentState : { success : boolean; error : boolean}, data:ClassSchema) => {
  try {
       await prisma.class.update({
         where : {
          id : data?.id
         },
         data 
       })

      //  revalidatePath("/list/class")
       return {success : true, error : false}
    }catch (error) {
        console.log(error)
        return {success : false, error : true}
    }
}

export const deleteClass = async (currentState : { success : boolean; error : boolean}, data:FormData) => {
  const id = data.get("id") as string;  
  
 try {
      await prisma.class.delete({
        where : {
         id : parseInt(id)
        }
      })

     //  revalidatePath("/list/class)
      return {success : true, error : false}
   }catch (error) {
       console.log(error)
       return {success : false, error : true}
   }
}

export const createTeacher = async (currentState : { success : boolean; error : boolean} ,data:TeacherSchema) => {
  try {

    const client = await clerkClient();
    const user = await client.users.createUser({
      username : data.username,
      password : data.password,
      firstName : data.name,
      lastName : data.surname,
      publicMetadata:{role:"teacher"}
    });
       await prisma.teacher.create({
          data: {
            id: user.id,
            username: data.username,
            name: data.name,
            surname: data.surname,
            email: data.email,
            address: data.address,
            img: data.img,
            bloodType: data.bloodType,
            sex: data.sex,
            birthday: data.birthday ,
            subjects: {
              connect: data.subjects?.map((subjectId) => ({
                id: parseInt(subjectId)
              }))
            }
          }
       })

       //  revalidatePath("/list/teacher")
       return {success : true, error : false}
    }catch (error) {
      console.error("Error creating user:", error);
      return { success: false, error: true };
    }
}

export const updateTeacher = async (currentState : { success : boolean; error : boolean}, data:TeacherSchema  ) => {
  if(!data.id) {
    return { success : false, error : true}
  }
  try {
    const client = await clerkClient();
    const user = await client.users.updateUser(data.id,{
      username : data.username,
      ...(data.password !== "" && {password : data.password}),
      firstName : data.name,
      lastName : data.surname,
    });
       await prisma.teacher.update({
        where : {id : data.id},
          data: {
            ...(data.password !== "" && {password : data.password}),
            id: user.id,
            username: data.username,
            name: data.name,
            surname: data.surname,
            email: data.email,
            address: data.address,
            img: data.img,
            bloodType: data.bloodType,
            sex: data.sex,
            birthday: data.birthday ,
            phone : data.phone,
            subjects: {
              set: data.subjects?.map((subjectId: string) => ({
                id: parseInt(subjectId)
              }))
            }
          }
       })


      //  revalidatePath("/list/teacher")
       return {success : true, error : false}
    }catch (error) {
        console.log(error)
        return {success : false, error : true}
    }
}

export const deleteTeacher = async (currentState : { success : boolean; error : boolean}, data:FormData) => {
  const id = data.get("id") as string;  
  
 try {

  const client = await clerkClient();
  await client.users.deleteUser(id)
      await prisma.teacher.delete({
        where : {
         id : id
        }
      })

     //  revalidatePath("/list/teacher")
      return {success : true, error : false}
   }catch (error) {
       console.log(error)
       return {success : false, error : true}
   }
}


export const createStudent = async (currentState : { success : boolean; error : boolean} ,data:StudentSchema) => {

  try {
    const classItem = await prisma.class.findUnique({
      where : {
        id : data.classId
      },
      include : {_count : {select : { students : true }}}
    });

    if(classItem && classItem.capacity === classItem._count.students) {
      return { success :false, error : true};
    }
    const client = await clerkClient();
    const user = await client.users.createUser({
      username : data.username,
      password : data.password,
      firstName : data.name,
      lastName : data.surname,
      publicMetadata:{role:"student"}
    });
    await prisma.student.create({
          data: {
            id: user.id,
            username: data.username,
            name: data.name,
            surname: data.surname,
            email: data.email,
            address: data.address,
            img: data.img,
            bloodType: data.bloodType,
            sex: data.sex,
            birthday: data.birthday ,
            gradeId : data.gradeId,
            classId : data.classId,
            parentId : data.parentId
            }
       })

       //  revalidatePath("/list/student")
       return {success : true, error : false}
    }catch (error) {
      console.error("Error creating user:", error);
      return { success: false, error: true };
    }
}

export const updateStudent = async (currentState : { success : boolean; error : boolean}, data:StudentSchema  ) => {
  if(!data.id) {
    return { success : false, error : true}
  }
  try {
    const client = await clerkClient();
    const user = await client.users.updateUser(data.id,{
      username : data.username,
      ...(data.password !== "" && {password : data.password}),
      firstName : data.name,
      lastName : data.surname,
    });
       await prisma.student.update({
        where : {id : data.id},
          data: {
            ...(data.password !== "" && {password : data.password}),
            id: user.id,
            username: data.username,
            name: data.name,
            surname: data.surname,
            email: data.email,
            address: data.address,
            img: data.img,
            bloodType: data.bloodType,
            sex: data.sex,
            birthday: data.birthday ,
            phone : data.phone,
            gradeId : data.gradeId,
            classId : data.classId,
            parentId : data.parentId
          }
       })


          //  revalidatePath("/list/student")
       return {success : true, error : false}
    }catch (error) {
        console.log(error)
        return {success : false, error : true}
    }
}

export const deleteStudent = async (currentState : { success : boolean; error : boolean}, data:FormData) => {
  const id = data.get("id") as string;  
  
 try {
  const client = await clerkClient();
    await client.users.deleteUser(id)
      await prisma.student.delete({
        where : {
         id : id
        }
      })

     //  revalidatePath("/list/student")
      return {success : true, error : false}
   }catch (error) {
       console.log(error)
       return {success : false, error : true}
   }
}


export const createExam = async  (currentState : { success : boolean; error : boolean}, data:ExamSchema) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // if (role === "teacher") {
    //   const teacherLesson = await prisma.lesson.findFirst({
    //     where: {
    //       teacherId: userId!,
    //       id: data.lessonId,
    //     },
    //   });

    //   if (!teacherLesson) {
    //     return { success: false, error: true };
    //   }
    // }

    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateExam = async (currentState : { success : boolean; error : boolean}, data:ExamSchema) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // if (role === "teacher") {
    //   const teacherLesson = await prisma.lesson.findFirst({
    //     where: {
    //       teacherId: userId!,
    //       id: data.lessonId,
    //     },
    //   });

    //   if (!teacherLesson) {
    //     return { success: false, error: true };
    //   }
    // }

    await prisma.exam.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


export const deleteExam = async (currentState : { success : boolean; error : boolean}, data:FormData) => {
  const id = data.get("id") as string;

  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
        // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createAnnouncement = async (currentState : { success : boolean; error : boolean} ,data:AnnouncementSchema) => {
  try {
       await prisma.announcement.create({
          data 
       })

      //  revalidatePath("/list/announcement")
       return {success : true, error : false}
    }catch (error) {
        console.log(error)
        return {success : false, error : true}
    }
}

export const updateAnnouncement = async (currentState : { success : boolean; error : boolean}, data:AnnouncementSchema) => {
  try {
       await prisma.announcement.update({
         where : {
          id : data?.id
         },
         data 
       })

        //  revalidatePath("/list/announcement")
       return {success : true, error : false}
    }catch (error) {
        console.log(error)
        return {success : false, error : true}
    }
}

export const deleteAnnouncement = async (currentState : { success : boolean; error : boolean}, data:FormData) => {
  const id = data.get("id") as string;  
  
 try {
      await prisma.announcement.delete({
        where : {
         id : parseInt(id)
        }
      })

       //  revalidatePath("/list/announcement")
      return {success : true, error : false}
   }catch (error) {
       console.log(error)
       return {success : false, error : true}
   }
}


export const createEvent = async  (currentState : { success : boolean; error : boolean}, data:EventSchema) => {
  try {
    await prisma.event.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: data.classId,
        description: data.description,
      },
    });

    // revalidatePath("/list/event");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateEvent= async (currentState : { success : boolean; error : boolean}, data:EventSchema) => {

  try {

    await prisma.event.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: data.classId,
        description: data.description,
      },
    });

    // revalidatePath("/list/event");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


export const deleteEvent = async (currentState : { success : boolean; error : boolean}, data:FormData) => {
  const id = data.get("id") as string;
  try {
    await prisma.event.delete({
      where: {
        id: parseInt(id),
        
      },
    });

    // revalidatePath("/list/event");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


export const createParent= async (currentState : { success : boolean; error : boolean} ,data:ParentSchema) => {
  try {

    const client = await clerkClient();
    const user = await client.users.createUser({
      username : data.username,
      password : data.password,
      firstName : data.name,
      lastName : data.surname,
      publicMetadata:{role:"parent"}
    });
    console.log(user)
       await prisma.parent.create({
          data: {
            id: user.id,
            username: data.username,
            name: data.name,
            surname: data.surname,
            email: data.email,
            address: data.address,
            phone : data.phone,
            students: {
              connect: data.students?.map((id: string) => ({
                id: id
              }))
            }
          }
       })

       //  revalidatePath("/list/parent")
       return {success : true, error : false}
    }catch (error) {
      console.error("Error creating user:");
      return { success: false, error: true };
    }
}

export const updateParent = async (currentState: { success: boolean; error: boolean }, data: ParentSchema) => {
  if (!data.id) {
    return { success: false, error: true };
  }

  try {
    const client = await clerkClient();
    const user = await client.users.updateUser(data.id, {
      username: data.username,
      ...(data.password && data.password !== "" ? { password: data.password } : {}),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.parent.update({
      where: { id: data.id },
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        address: data.address,
        phone: data.phone,
        students: {
          connect: data.students?.map((id: string) => ({ id })) || [],
        },
      },
    });
    

    return { success: true, error: false };
  } catch (error) {
    console.error("Error updating parent:", error);
    return { success: false, error: true };
  }
};


export const deleteParent = async (
  currentState: { success: boolean; error: boolean },
  data: FormData
) => {
  const id = data.get("id") as string;

  if (!id) {
    return { success: false, error: true };
  }

  try {
    const client = await clerkClient();
    const response = await client.users.deleteUser(id);

    await prisma.parent.delete({
      where: { id },
    });

    return { success: true, error: false };
  } catch (error: any) {
    console.error("Error deleting parent:", error);
    return { success: false, error: true };
  }
};


export const createResult = async (currentState : { success : boolean; error : boolean} ,data:ResultSchema) => {
  
  try {
       await prisma.result.create({
          data 
       })

      //  revalidatePath("/list/result")
       return {success : true, error : false}
    }catch (error) {
        console.log(error)
        return {success : false, error : true}
    }
}

export const updateResult = async (currentState : { success : boolean; error : boolean}, data:ResultSchema) => {
  console.log(data)
  try {
       await prisma.result.update({
         where : {
          id : data?.id
         },
         data 
       })

      //  revalidatePath("/list/class")
       return {success : true, error : false}
    }catch (error) {
        console.log(error)
        return {success : false, error : true}
    }
}

export const deleteResult = async (currentState : { success : boolean; error : boolean}, data:FormData) => {
  const id = data.get("id") as string;  
  console.log(id)
 try {
      await prisma.result.delete({
        where : {
         id : parseInt(id)
        }
      })

      //  revalidatePath("/list/result")
      return {success : true, error : false}
   }catch (error) {
       console.log(error)
       return {success : false, error : true}
   }
}

export const createLesson = async (currentState : { success : boolean; error : boolean} ,data:LessonSchema) => {

  
  try {
       await prisma.lesson.create({
          data :  {
            name : data.name,
            day : data.day,
            startTime : data.startTime,
            endTime : data.endTime,
            subjectId : data.subjectId,
            classId : data.classId,
            teacherId : data.teacherId,
          }
       })

      //  revalidatePath("/list/lesson")
       return {success : true, error : false}
    }catch (error) {
        console.log(error)
        return {success : false, error : true}
    }
}

export const updateLesson = async (currentState : { success : boolean; error : boolean}, data:LessonSchema) => {
  try {
       await prisma.lesson.update({
         where : {
          id : data?.id
         },
         data : {
          name : data.name,
          day : data.day,
          startTime : data.startTime,
          endTime : data.endTime,
          subjectId : data.subjectId,
          classId : data.classId,
          teacherId : data.teacherId
        }
         
       })

      //  revalidatePath("/list/lesson")
       return {success : true, error : false}
    }catch (error) {
        console.log(error)
        return {success : false, error : true}
    }
}

export const deleteLesson = async (currentState : { success : boolean; error : boolean}, data:FormData) => {
   const id = data.get("id") as string;  
   
  try {
       await prisma.lesson.delete({
         where : {
          id : parseInt(id)
         }
       })

      //  revalidatePath("/list/lesson")
       return {success : true, error : false}
    }catch (error) {
        console.log(error)
        return {success : false, error : true}
    }
}

export const createAssignment  = async  (currentState : { success : boolean; error : boolean}, data:AssignmentSchema) => {
  try {
    await prisma.assignment.create({
      data: {
        title: data.title,
        startDate: data.startDate,
        dueDate: data.dueDate,
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/Assignment");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateAssignment  = async (currentState : { success : boolean; error : boolean}, data:AssignmentSchema) => {

  try {
    await prisma.assignment.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startDate: data.startDate,
        dueDate: data.dueDate,
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/Assignment");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


export const deleteAssignment = async (currentState : { success : boolean; error : boolean}, data:FormData) => {
  const id = data.get("id") as string;
  try {
    await prisma.assignment.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/Assignment");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};