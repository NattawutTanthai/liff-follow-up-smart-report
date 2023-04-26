import React, { useEffect, useState } from 'react'
import Axios from '../constants/axiosConfig'

import { Backdrop, CircularProgress } from '@mui/material';

// Day.js
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.locale('th');
dayjs.extend(buddhistEra);
dayjs.extend(relativeTime);

export default function Card({ displayName }) {
    const [task, setTask] = useState([]);
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        getTask();
    }, [])

    const getTask = async () => {
        await Axios.post('task/get/user', {
            user: displayName
        })
            .then((res) => {
                setTask(res.data);
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <>
            {
                task.length == 0 ? <div className="flex justify-center h-40 mt-5">
                    <div className=" w-full mx-4 rounded-lg shadow-lg flex flex-col justify-center  border border-gray-500">
                        <div className='flex flex-row justify-center'>
                            <h1 className='ml-2 mt-2 text-gray-500 text-2xl'>
                                <b>ไม่มีข้อมูลของคุณ</b>
                            </h1>
                        </div>
                    </div>
                </div> :
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
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>

    )
}
