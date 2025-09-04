import Slider from "pages/Home/Slider";
import Services from "pages/Home/Services";
import Trainings from "pages/Home/Trainings";
import Testimonials from "pages/Home/Testimonials";
import Courses from "pages/Home/Courses";
import LearningFormats from "pages/Home/LearningFormats";
import Partners from "pages/Home/Partners";
import Faq from "pages/Home/Faq";
import About from "pages/Home/About";
import Documents from "pages/Home/Documents";

function Home() {
  return (
    <>
      <Slider />
      <Services />
      <Trainings />
      <Testimonials />
      <Courses />
      <Documents />
      <LearningFormats />
      <Partners />
      <Faq />
      <About />
    </>
  );
};

export default Home;
