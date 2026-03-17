// components/HeaderSwitcher.jsx
import { useAuth } from "@clerk/clerk-react";
import Header from "./Header";
import NewHeader from "./NewHeader";

const HeaderSwitcher = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  return isSignedIn ? <NewHeader /> : <Header />;
};

export default HeaderSwitcher;