import Slider from "pages/Home/Slider";
import Services from "pages/Home/Services";
import Testimonials from "pages/Home/Testimonials";
import Courses from "pages/Home/Courses";
import News from "pages/Home/News";
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
      <Testimonials />
      <Courses />
      <News />
      <Documents />
      <LearningFormats />
      <Partners />
      <Faq />
      <About />
    </>
  );
};

export default Home;
