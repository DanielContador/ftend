import { useRouter } from "next/router";
import Welcome from "../shared/layouts/welcomelayout/WelcomeLayout";
import WelcomeTextAndButtons from "../shared/layouts/components/welcome/WelcomeTextAndButtons";
import WelcomeRobot from "../shared/layouts/components/welcome/WelcomeRobot";
import WelcomeBottomSection from "../shared/layouts/components/welcome/WelcomeBottomSection";
import WelcomeTextAndButtonsAlreadyRegistered from "../shared/layouts/components/welcome/WelcomeTextAndButtonsAlreadyRegistered";

const WelcomePage = () => {
  const router = useRouter();
  const onlyLayout =
    router.query.onlyLayout === "true" || router.query.onlyLayout === true;

  return onlyLayout ? (
    <Welcome
      WelcomeTextAndButtons={<WelcomeTextAndButtonsAlreadyRegistered />}
      WelcomeRobot={<WelcomeRobot />}
      onlyLayout={true}
    />
  ) : (
    <Welcome
      WelcomeBottomSection={<WelcomeBottomSection />}
      WelcomeTextAndButtons={<WelcomeTextAndButtons />}
      WelcomeRobot={<WelcomeRobot />}
    />
  );
};

export default WelcomePage;
