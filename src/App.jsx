import { useEffect, useState } from "react";
import liff from "@line/liff";
import "./App.css";
import ImageProfile from "./components/ImageProfile";
import Card from "./components/Card";
import icon from "./assets/icon.png";

function App() {
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID
      })
      .then(async () => {
        if (!liff.isLoggedIn()) {
          liff.login();
        }
        const profile = await liff.getProfile();
        setProfile(profile);
      })
      .catch((e) => {
        setMessage("LIFF init failed.");
        setError(`${e}`);
      });
  }, []);



  return (
    <>
      <div className="flex justify-center flex-col">
        <img src={icon} alt="icon" className="w-64 mx-auto mt-5" />
        <div className=" flex justify-center ">
          <h1 className="text-2xl text-gray-500">ติดตามการแจ้งปัญหา</h1>
        </div>
          <ImageProfile
            displayName={profile.displayName}
            pictureUrl={profile.pictureUrl}
          />
          <Card displayName={profile.displayName} />
      </div>
    </>
  );
}

export default App;
