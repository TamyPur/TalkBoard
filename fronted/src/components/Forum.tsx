import axios from "axios";
import { useEffect, useState } from "react"
import Cookies from 'js-cookie';
import { TMessage } from "../interfaces/message";
import { Message } from "./Message";
import { TForum } from "../interfaces/forum";
import { TUser } from "../interfaces/user";
import { useNavigate, useParams } from "react-router-dom";
import { TbSettings } from 'react-icons/tb';
import { IoMdSend } from 'react-icons/io';
import Tooltip from '@mui/material/Tooltip';
import React from "react";



export const Forum = () => {

    const [render, setRender] = React.useState('');

    const apiUri = 'http://localhost:3000';
    const { forumId, userId } = useParams();

    const [messages, setMessages] = useState<TMessage[]>([]);
    const [forum, setForum] = useState<TForum>();
    const [user, setUser] = useState<TUser>();
    const [content, setContent] = useState("");

    let navigate = useNavigate();

    const diff: number[] = [];

    useEffect(() => {
        const token = Cookies.get('JwtToken');

        axios.get(`${apiUri}/message/${forumId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            }
        )
            .then(res => setMessages(res.data))
            .catch(error => alert(error))

        getForum()

    }, [render])

    useEffect(() => {
        if (forum)
            getUser()
        getDate()
    }, [forum])

    const getUser = async () => {
        await axios.get(`${apiUri}/user/${forum?.admin}`)
            .then(res => setUser(res.data))
            .catch(err => alert(err))
    }

    const getForum = async () => {
        const token = Cookies.get('JwtToken');
        await axios.get(`${apiUri}/forum/${forumId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            }
        )
            .then(res => setForum(res.data))
            .catch(error => alert(error))
    }

    function convertMsToTime(milliseconds: number) {
        let seconds = Math.floor(milliseconds / 1000);
        let minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        seconds = seconds % 60;
        minutes = minutes % 60;

        diff[0] = hours;
        diff[1] = minutes;

    }

    function diff_year_month_day(dt1: Date, dt2: Date) {

        const time = (dt2.getTime() - dt1.getTime()) / 1000;
        diff[0] = Math.abs(Math.round((time / (60 * 60 * 24)) / 365.25));
        diff[1] = Math.abs(Math.round(time / (60 * 60 * 24 * 7 * 4)));
        diff[2] = Math.abs(Math.round(time / (3600 * 24)));
    }

    const getDate = () => {
        if (forum?.lastEdited != null) {
            const date: Date = new Date(forum?.lastEdited);

            const tooday = new Date();

            if (date.getDate() == tooday.getDate() && date.getMonth() + 1 == tooday.getMonth() + 1 && date.getFullYear() == tooday.getFullYear()) {
                const msBetweenDates = tooday.getTime() - date.getTime();
                convertMsToTime(msBetweenDates);
                if (diff[0] != 0) {
                    return `נערך לאחרונה לפני ${diff[0]} שעות ו ${diff[1]} דקות`;
                }
                if (diff[1] != 0) {
                    return `נערך לאחרונה לפני ${diff[1]} דקות`;
                }
            }
            else {
                diff_year_month_day(tooday, date);
                if (diff[0] != 0) {
                    return `נערך לאחרונה לפני ${diff[0]} שנים`;
                }
                if (diff[1] != 0) {
                    return `נערך לאחרונה לפני ${diff[1]} חודשים`;
                }
                if (diff[2] != 0) {
                    return `נערך לאחרונה לפני ${diff[2]} ימים`;
                }
            }



        }

    }

    const addMessage = () => {
        const token = Cookies.get('JwtToken');
        const newMessage = {
            id: 8979,
            forumId: forumId,
            owner: 1,
            content: content,
            date: Date.now(),
            deleted: false
        };
        try {
            axios.post(`${apiUri}/message`, newMessage, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setContent('');
            updateDate();
        } catch {
            alert()
        }

    }

    const updateDate = () => {
        const token = Cookies.get('JwtToken');
        axios.post(`${apiUri}/forum/${forumId}`,
            {
                forumId: forumId
            }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }

        ).then(() => { setRender('render') })
            .catch(error => alert(error))
    }

    if (forum)
        return (
            <>

                <div className="list-group">
                    <div className="list-group-item list-group-item-secondary center">
                        <div className="d-flex w-100 justify-content-between">
                            {
                                forum.isPublic ?
                                    (<p className="mb-1 title">במה ציבורית</p>)
                                    :
                                    (<p className="mb-1 title">לפורום זה הוזמנת באופן פרטי</p>)
                            }
                            <small>{getDate()}</small>
                        </div>
                        <h4 className="mb-1">{forum?.issue}</h4>
                        <small>{user?.name}</small>
                    </div>
                    <div className="scroll">
                        {messages.map(message => <Message {...message} />)}
                    </div>
                    <div className="list-group-item list-group-item-secondary center">
                        <div className="d-flex w-100 justify-content-between">
                            <div>
                                <input type="text" name="content" value={content} onChange={(event) => setContent(event.target.value)} />
                                <label onClick={addMessage}> < IoMdSend /></label>
                            </div>
                            {userId == forum.admin ? (
                                <Tooltip title="ניהול המשתמשים בפורום, עריכת הגדרות וצפיה בנתונים">
                                    <button onClick={() => navigate(`/homePage/setForum/${forumId}`)}>< TbSettings /></button>
                                </Tooltip>
                            ) : (<></>)}
                        </div>
                    </div>
                </div>
            </>
        )

}