import react from "react";
import IRNHeader from "../components/IRN/IRNHeader";
import IRNSubheader from "../components/IRN/IRNSubheader";
import InitiativeSection from "../components/IRN/InitiativeSection";
import StrategicValue from "../components/IRN/StrategicValue";
import ParticipateSection from "../components/IRN/ParticipateSection";
import Footer from "../components/Footer";

const IRN = () => {
    return(
        <>
        <IRNHeader />
        <IRNSubheader/>
        <InitiativeSection/>
        <StrategicValue/>
        <ParticipateSection/>
        <Footer/>
        </>
    )
}

export default IRN;





