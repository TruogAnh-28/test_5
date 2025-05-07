import {
  UpdateEmployee,
} from "~/features/employee/components/update-employee"

export default function UpdateEmployeePage({ params }: { params: {
  id: number
} }) {
  return (
    <UpdateEmployee id={params.id} />
  )
}
