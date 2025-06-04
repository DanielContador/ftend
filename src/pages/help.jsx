import SplitLayout from "../shared/layouts/splitlayout/SplitLayout";
import HelpContent from "../shared/layouts/components/help/HelpContent";
import SuccessBox from "../shared/layouts/components/help/SuccessBox";

export default function HelpPage() {
  return (
    <SplitLayout centerComponent={<HelpContent />} children={<SuccessBox />}>
      {/* Puedes agregar contenido adicional aquí si lo necesitas */}
    </SplitLayout>
  );
}
