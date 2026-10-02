import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import FullJourney from "@/components/FullJourney";
import Services from "@/components/Services";
import Why from "@/components/Why";
import Founder from "@/components/Founder";
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
        <FullJourney />
        <Services />
        <Why />
        <Founder />
        <Quote />
      </main>
      <Footer />
    </>
  );
}
