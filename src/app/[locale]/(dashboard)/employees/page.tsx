import {
  ViewEmployees,
} from "~/features/employee/components/view-employees"

export const metadata = {
  title: "Quản lý nhân viên",
}

export default function EmployeesPage() {
  return (
    <div className="p-8">
      <ViewEmployees />
    </div>
  )
}
