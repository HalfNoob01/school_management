import { FormContainerProps } from "@/lib/types"
import FormModal from "./FormModal"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

const FormContainer = async ({table,type,data,id} : FormContainerProps) => {
  
  let relatedData = {}
  
  if(type !== "delete") {
    switch(table) {
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select :  {
             id: true, name: true, surname: true ,
          }
        });
     
        relatedData = {teachers : subjectTeachers}
        break;

      case "class" :
        const classGrades = await prisma.grade.findMany({
          select :  {
             id: true, level : true 
          }
        });
        const classTeachers = await prisma.teacher.findMany({
          select :  {
             id: true, name : true, surname : true
          }
        });
     
        relatedData = {teachers : classTeachers, grades : classGrades}
      break;

      case "teacher" :
        const teacherSubjects = await prisma.subject.findMany({
          select :  {
             id: true, name : true
          }
        });
        relatedData = {subjects : teacherSubjects }
      break;

      case "student" :
        const studentGrades = await prisma.grade.findMany({
          select :  {
             id: true, level : true
          }
        });
        const studentClasses= await prisma.class.findMany({
            include : {
              _count: {select:{students : true}}
            }
        });
        relatedData = {classes : studentClasses, grades : studentGrades }
      break;
      
    case "exam" :
      const {userId, sessionClaims } = await  auth();
      const role = (sessionClaims?.metadata as {role?: string})?.role; 
      const examLessons = await prisma.lesson.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: userId! } : {}),
          },
          select: { id: true, name: true },
        });
        
        relatedData = { lessons: examLessons };
        break;
      
        case "announcement" :
          const classAnnouncementTeachers = await prisma.class.findMany({
            select :  {
               id: true, name : true
            }
          });
          
          relatedData = {announcementsClass : classAnnouncementTeachers}
        break;

        case "event" :
          const eventClass = await prisma.class.findMany({
            select :  {
               id: true, name : true
            }
          });
          
          relatedData = {classItems : eventClass }
        break;

        case "parent" :
        const parentChildrens = await prisma.student.findMany({
          select :  {
             id: true, name : true
          }
        });
        relatedData = {students : parentChildrens }
      break;

      case "result" :
        const studentExams = await prisma.exam.findMany({
          select :  {
             id: true, title : true 
          }
        });
        const studentAssignments= await prisma.assignment.findMany({
          select :  {
             id: true, title : true, 
          }
        });
        const students = await prisma.student.findMany({
          select : {
             id : true, name : true
          }
        })
        relatedData = {exams : studentExams, assignments : studentAssignments, students : students}
      break;

      case "lesson" :
        const subjects = await prisma.subject.findMany({
          select :  {
             id: true, name : true 
          }
        });

        const classItems = await prisma.class.findMany({
          select :{id : true, name : true}
        });

        const teachers = await prisma.teacher.findMany({
          select : {
             id : true, name : true,surname : true
          }
        });
       
        relatedData = {classItems : classItems, subjects : subjects, teachers : teachers }
       
        break;


        case "assignment" :
        const lessons = await prisma.lesson.findMany({
          select :  {
             id: true, name : true
          }
        });
        relatedData = {lessons : lessons }
      break;
 
      default :
      break;
    }
  }
  
  return (
    <div>
      <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData}/>
    </div>
  )
}

export default FormContainer
