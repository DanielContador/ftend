import Welcome from "../shared/layouts/welcomelayout/WelcomeLayout";
import WelcomeTextAndButtons from "../shared/layouts/components/welcome/WelcomeTextAndButtons";
import WelcomeRobot from "../shared/layouts/components/welcome/WelcomeRobot";
import WelcomeBottomSection from "../shared/layouts/components/welcome/WelcomeBottomSection";

const WelcomePage = () => {
  return (
    <Welcome
      WelcomeBottomSection={<WelcomeBottomSection />}
      WelcomeTextAndButtons={<WelcomeTextAndButtons />}
      WelcomeRobot={<WelcomeRobot />}
    ></Welcome>
  );
};

export default WelcomePage;
