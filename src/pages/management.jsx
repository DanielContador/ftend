import ManagementLayout from "../shared/layouts/managementlayout/ManagementLayout";
import SaveContinueButton from "../shared/layouts/components/management/SaveContinueButton";

export default function ManagementPage() {
  return (
    <ManagementLayout button={<SaveContinueButton />}>
      {/* Aquí puedes agregar el contenido de management */}
    </ManagementLayout>
  );
}
