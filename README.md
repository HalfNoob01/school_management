# 🏫 School Management Web App

A modern school management system built with **Next.js**, **Prisma ORM**, **Neon PostgreSQL**, and **Clerk** for authentication. It supports four user roles: **Admin**, **Teacher**, **Student**, and **Parent**—each with specific access and features.

## 🚀 Tech Stack

- **Framework:** Next.js 13+ (App Router)
- **ORM:** Prisma
- **Database:** Neon (PostgreSQL)
- **Authentication & Authorization:** Clerk
- **Styling:** Tailwind CSS
- **Deployment:** Vercel (Recommended)

---

## 👥 User Roles & Permissions

| Role     | Description                                                 |
|----------|-------------------------------------------------------------|
| Admin    | Full control of the app. Manages users, classes, and reports. |
| Teacher  | Views and updates class schedules, student performance, etc. |
| Student  | Views timetable, homework, grades, etc.                      |
| Parent   | Views child's attendance, grades, teacher comments, etc.     |

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/school-management-app.git
cd school_management
npm install


DATABASE_URL="postgresql://neondb_owner:npg_qLUCQejb8o1X@ep-rough-rice-a5fbp4dr-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_a2V5LWtvYWxhLTE5LmNsZXJrLmFjY291bnRzLmRldiQ"
CLERK_SECRET_KEY="YOUR KEY"
NEXT_PUBLIC_CLERK_SIGN_IN_URL = "/"

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="YOUR CLOUD NAME"
NEXT_PUBLIC_CLOUDINARY_API_KEY="YOUR API KEY"
CLOUDINARY_API_SECRET="YOUR SECRET KEY"