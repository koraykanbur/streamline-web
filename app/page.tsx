import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import StepThrough from "@/components/StepThrough";
import RoutePlanner from "@/components/RoutePlanner";
import Services from "@/components/Services";
import Why from "@/components/Why";
import Founder from "@/components/Founder";
import Faq from "@/components/Faq";
import Quote from "@/components/Quote";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <div id="top" />
      <Nav />
      <main id="main">
        <Hero />
        <Journey />
        <StepThrough />
        <RoutePlanner />
        <Services />
        <Why />
        <Founder />
        <Faq />
        <Quote />
      </main>
      <Footer />
    </>
  );
}
