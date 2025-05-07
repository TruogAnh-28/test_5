import {
  EmployeeForm,
} from "~/features/employee/components/forms/employee-form"

export default function CreateEmployeePage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-row items-center justify-between">

        <h1 className="text-xl font-semibold capitalize">Tạo tài khoản mới</h1>

      </div>

      <EmployeeForm isCreate />
    </div>
  )
}
