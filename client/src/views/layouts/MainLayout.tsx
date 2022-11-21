import React from "react";
import CustomToast from "../../components/CustomToast";
import Footer from "../partials/footer";
import NavBar from "../partials/navbar";

interface Props {
    children: React.ReactNode
}

function MainLayout(props: Props) {
    const { children } = props;
    return (
        <>
            {/* Navbar */}
            <NavBar></NavBar >
            <CustomToast></CustomToast>
            {children}
            <Footer></Footer>
        </>

    );
}

export default MainLayout;
