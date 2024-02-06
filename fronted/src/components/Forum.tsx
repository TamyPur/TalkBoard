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
import { IconButton } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const Forum = () => {


    const token = Cookies.get('JwtToken');
    const apiUri = 'http://localhost:3000';

    const { forumId, userId } = useParams();
    const [render, setRender] = useState<boolean>();
    const [messages, setMessages] = useState<TMessage[]>([]);
    const [forum, setForum] = useState<TForum>();
    const [user, setUser] = useState<TUser>();
    const [content, setContent] = useState("");
    const [element, setElement] = useState("");
    const [isBold, setIsBold] = useState(false);


    let navigate = useNavigate();
    const diff: number[] = [];

    useEffect(() => {
        getMessages()
        getForum()
    }, [render])

    useEffect(() => {
        if (forum)
            getUser()
        getDate()
    }, [forum])

    useEffect(() => {
        let temp2 = element;
        for (let i = 0, j = 0; i < content.length || j < temp2.length; i++, j++) {
            if (element[j] == "<") {
                for (; element[j] != ">"; j++);
                i--;
                continue;
            }
            if (element[j] != content[i]) {
                //write
                if (element[j] == content[i + 1] || element[j] == undefined) {
                    const temp = temp2;
                    temp2 = temp.substring(0, j) + content[i] + temp.substring(j, temp.length);
                    setElement(temp2);
                    // break;
                }
                //delete
                else if (element[j + 1] == content[i] || content[i] == undefined) {
                    const temp = temp2;
                    temp2 = temp.substring(0, j) + temp.substring(j + 1, temp.length);
                    // if(j>0)
                    j--;
                    setElement(temp2);
                    // break;
                }
                //chenge
                else if (element[j] != undefined && content[i] != undefined) {
                    const temp = temp2;
                    temp2 = temp.substring(0, j) + content[i] + temp.substring(j + 1, temp.length);
                    setElement(temp2);
                }

            }
        }
    }, [content]);

    const getMessages = () => {
        axios.get(`${apiUri}/message/${forumId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            }
        )
            .then(res => setMessages(res.data))
            .catch(error => console.log("getMessages " + error))
    }

    // const handleDirectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setDirection(
    //         (event.target as HTMLInputElement).value as SpeedDialProps['direction'],
    //     );
    // };

    // const handleHiddenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setHidden(event.target.checked);
    // };

    const renderPage = () => {
        setRender(!render);
    }

    const getUser = async () => {
        await axios.get(`${apiUri}/user/${forum?.admin}`)
            .then(res => setUser(res.data))
            .catch(err => console.log("getUser" + err))
    }

    const getForum = async () => {
        // console.log(forumId)
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
            .catch(error => console.log("get Forum " + error))
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
        let temp = element
        if (isBold)
            temp = bold();
        setElement(element);
        const token = Cookies.get('JwtToken');
        const newMessage = {
            forumId: forumId,
            owner: 1,
            content: temp,
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
            setElement('');
            updateDate();
        } catch (err) {
            console.log("addMessage " + err)
        }

    }

    const updateDate = () => {
        const token = Cookies.get('JwtToken');
        axios.put(`${apiUri}/forum/updateDate/${forumId}`,
            {
                forumId: forumId
            }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }

        ).then(() => setRender(!render))
            .catch(error => console.log("updateDate " + error))
    }

    const bold = () => {
        let temp = ""
        if (!isBold) {
            temp = element + "<strong>"
            setElement(temp);
            setIsBold(true);
        }
        else {
            temp = element + "</strong>"
            setElement(temp);
            setIsBold(false);
        }
        return temp;
    }

    // const enter = () => {
    //     let temp = "";
    //     temp = element + "<br/>";
    //     setElement(temp);

    // }

    // const showContent = () => {
    //     return <p className="mb-1 text-break" dangerouslySetInnerHTML={{ __html: element }}></p>
    // }

    if (forum)
        return (
            <>
                <div className="list-group">
                    <div className="list-group-item list-group-item-secondary center">
                        <div className="d-flex w-100 justify-content-between">
                            {
                                forum.isPublic ?
                                    (<p className="mb-1 title">
                                        <IconButton onClick={() => navigate(`/homePage/forumList`)} size="small">
                                            <ArrowForwardIcon />
                                        </IconButton>
                                        במה ציבורית</p>)
                                    :
                                    (<p className="mb-1 title">
                                        <IconButton onClick={() => navigate(`/homePage/forumList`)} size="small">
                                            <ArrowForwardIcon />
                                        </IconButton>
                                        לפורום זה הוזמנת באופן פרטי</p>)
                            }
                            <small>{getDate()}</small>
                        </div>
                        <h4 className="mb-1">{forum?.subject}</h4>
                        <small>{user?.name}</small>
                    </div>
                    <div className="scroll">
                        {messages.map((_message, i) => <Message key={i} renderPage={renderPage} message={_message} />)}
                    </div>
                    <div className="list-group-item list-group-item-secondary center">
                        <div className="d-flex w-100 justify-content-between">
                            <div>
                                <input type="text" name="content" value={content} onChange={(event) => setContent(event.target.value)} />
                                <label onClick={addMessage}> < IoMdSend /></label>
                            </div>

                            {userId == forum.admin ? (
                                <Tooltip title="ניהול המשתמשים בפורום, עריכת הגדרות וצפיה בנתונים">
                                    <button onClick={() => navigate(`/homePage/setForum/${forumId}/${userId}`)}>< TbSettings /></button>
                                </Tooltip>
                            ) : (<></>)}
                        </div>
                    </div>
                </div>
            </>
        )

}