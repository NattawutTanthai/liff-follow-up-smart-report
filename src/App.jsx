import { useEffect, useState } from "react";
import liff from "@line/liff";
import "./App.css";
import ImageProfile from "./components/ImageProfile";
import icon from "./assets/icon.png";
import Axios from "./constants/axiosConfig";
import { Backdrop, CircularProgress } from '@mui/material';

// Day.js
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.locale('th');
dayjs.extend(buddhistEra);
dayjs.extend(relativeTime);


function App() {
  const [task, setTask] = useState([]);
  const [profile, setProfile] = useState({});
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);


  const getTask = async (displayName) => {
    await Axios.post('task/get/user', {
      user: displayName
    })
      .then((res) => {
        console.log(res.data);
        setTask(res.data);
        setOpen(false);

      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    setOpen(true);
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID
      })
      .then(async () => {
        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          liff.getProfile().then((profile) => {
            setProfile(profile);
            getTask(profile.displayName)
          });
        }
      })
      .catch((e) => {
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
        {
          task.map((item, index) => {
            return (
              <div className="flex justify-center h-40 mt-5" key={index}>
                <div className=" w-full mx-4 rounded-lg shadow-lg flex flex-row  border border-gray-500">
                  <div className='mx-2 flex justify-center flex-col'>
                    <img className=" w-32 h-32 object-cover rounded-lg" src={item.imgStart} alt="avatar" />
                  </div>
                  <div className='flex flex-col justify-center'>
                    <h1 className='ml-2 mt-2 text-gray-500'>
                      <b>รายละเอียด: </b>{item.detail}
                    </h1>
                    <h1 className='ml-2 text-gray-500'>
                      <b>สถานะ: </b>{item.status == 0 ? "รอรับเรื่อง" : "กำลังดำเนินการ"}
                    </h1>
                    <h1 className='ml-2 text-gray-500'>
                      <b>วันที่แจ้ง: </b>{dayjs().to(dayjs.unix(item.startDate_timeStamp))}
                    </h1>
                    <h1 className='ml-2 mb-2 text-gray-500'>
                      <b>สถานที่: </b>{item.address}
                    </h1>
                  </div>
                </div>
              </div>
            );
          }
          )
        }
      </div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default App;
