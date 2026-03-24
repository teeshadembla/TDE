import { useState } from "react";
import { useNavigate } from "react-router";
import { Menu, ArrowRight } from "lucide-react";
import Logo from "./Logo.jsx";
import ProfileDrawer from "./ProfileDrawer.jsx";
import HamburgerMenu from "./HamburgerMenu.jsx";
import { useEffect } from "react";
import axiosInstance from "../config/apiConfig.js";

const NewHeader = () => {
  const navigate = useNavigate();
  const [menuContent, setMenuContent] = useState();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(()=>{
    const fetchHighlights = async() =>{
      try{
        const res = await axiosInstance.get("/api/user/highlights/personalized");
        const content = [
                res?.data?.upcomingEvents?.[1],
                res?.data?.publications?.[1]
            ].filter(Boolean);

            setMenuContent(content);

      }catch(err){
        console.log("This error is occurring while trying to fetch personalized highlights");
      }
    }

    fetchHighlights();
  },[])

  const B = {
    textInverse:     "#161616",
    grey600:         "#888",
    blue:            "#004aad",
    blue2nd:         "#062c65",
    grey200:         "#d9d9d9",
    grey400:         "#adadad",
    grey50:          "#f6f5f5",
    bgSecondary:     "#474646",
    textPrimary:     "#fff",
    buttonSecondary: "#6f6f6f",
    buttonHover:     "#062c65",
    buttonPrimary:   "#105abd",
    textOnColor:     "#fff",
    textSecondary:   "#9f9f9f",
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 30,
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%,rgba(0,0,0,0.9) 50%,rgba(0,0,0,0.7) 70% ,rgba(0,0,0,0) 100%)",
        }}
      >
        {/* Blue announcement bar */}
        <div
          style={{
            width: "100%",
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(to right, ${B.blue}, ${B.blue2nd})`,
            color: "#fff",
            fontSize: 12.5,
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          <a
            href="https://docsend.com/view/8ken6c6i84m8bwcu"
            style={{
              display: "flex",
              alignItems: "center",
              color: "#fff",
              textDecoration: "none",
              gap: 4,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.querySelector("span").style.textDecoration = "underline")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.querySelector("span").style.textDecoration = "none")
            }
          >
            <span>Join The Institutional Research Network.</span>
            <ArrowRight size={16} strokeWidth={1.5} />
          </a>
        </div>

        {/* Main nav */}
        <div
          style={{
            width: "100%",
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: "5%",
            paddingRight: "5%",
            marginTop: 10,
            boxSizing: "border-box",
          }}
        >
          {/* Hamburger — clicking this opens the menu */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              padding: 6,
              borderRadius: 6,
              transition: "background 0.15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <Menu size={24} strokeWidth={1.8} />
          </button>

          {/* Logo — centered absolutely */}
          <div
            onClick={() => navigate("/")}
            style={{
              cursor: "pointer",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <Logo />
          </div>

          {/* Profile — right */}
          <ProfileDrawer />
        </div>
      </div>

      {/* HamburgerMenu rendered outside header so it overlays the full page */}
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} data={menuContent}/>
    </>
  );
};

export default NewHeader;