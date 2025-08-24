import Slider from "pages/Home/Slider";
import Services from "pages/Home/Services";
import Trainings from "pages/Home/Trainings";
import Testimonials from "pages/Home/Testimonials";
import Courses from "pages/Home/Courses";
import LearningFormats from "pages/Home/LearningFormats";
import Partners from "pages/Home/Partners";
import Faq from "pages/Home/Faq";
import About from "pages/Home/About";

function Home() {
  return (
    <>
      <Slider />
      <Services />
      <Trainings />
      <Testimonials />
      <Courses />
      <LearningFormats />
      <Partners />
      <Faq />
      <About />
    </>
  );
};

export default Home;
