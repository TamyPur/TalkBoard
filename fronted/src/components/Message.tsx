import { useEffect, useState } from "react"
import { TMessage } from "../interfaces/message"
import { TUser } from "../interfaces/user";
import axios from "axios";
import { AiFillDelete } from 'react-icons/ai';
import Cookies from 'js-cookie';;
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import * as React from 'react';

export const Message = ({ _id, content, date, owner, deleted, forumId }: TMessage) => {

    const apiUri = 'http://localhost:3000';
    const [user, setUser] = useState<TUser>();
    const [Sdate, setSDtae] = useState("");
    const [currentUser, setCurrentUser] = useState<TUser>();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const token = Cookies.get('JwtToken');
        axios.get(`${apiUri}/user/${owner}`)
            .then(res => setUser(res.data))
            .catch(err => alert(err))

        axios.get(`${apiUri}/user/getCurrentUser`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        ).then(res => setCurrentUser(res.data))
            .catch(err => alert(err))

        getDate();
    }, [])

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    function padTo2Digits(num: number) {
        return num.toString().padStart(2, '0');
    }

    const getDate = () => {
        const d: Date = new Date(date);
        const tooday = new Date();
        const day = d.getDate()
        const month = d.getMonth() + 1;
        const year = d.getFullYear();
        const hours = padTo2Digits(d.getHours());
        const minutes = padTo2Digits(d.getMinutes());

        if (day == tooday.getDate() && month == tooday.getMonth() + 1 && year == tooday.getFullYear())
            setSDtae(`${minutes} : ${hours}`);
        else
            setSDtae(`${day}/${month}/${year}`);
    }

    const deleteMessage = () => {
        const token = Cookies.get('JwtToken');
        axios.post(`${apiUri}/message/${_id}`,
            {
                id: _id
            }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        ).then(() => {handleClick(); updateDate();})
            .catch(err => alert(err))
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

        ).then(() =>{})
            .catch(error => alert(error))
    }
    return (<>
        {deleted ? (
            <div className="list-group-item">
                <div className="d-flex w-100 justify-content-between">
                    <p className="mb-1"></p>
                    <small>{Sdate}</small>
                </div>
                <div className="d-flex w-100 justify-content-between">
                    <p className="mb-1">ההודעה נמחקה ע"י מי שכתב אותה</p>
                </div>

            </div>
        ) : (
            <div className="list-group-item">
                <div className="d-flex w-100 justify-content-between">
                    <p className="mb-1"><strong>{user?.name}</strong></p>
                    <small>{Sdate}</small>
                </div>
                <div className="d-flex w-100 justify-content-between">
                    <p className="mb-1 text-break">{content}</p>
                   {currentUser?._id==owner?(
                     <button onClick={deleteMessage}><AiFillDelete /></button>
                   ):(
                    <></>
                   )}
                </div>
            </div>
        )}
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message="ההודעה נמחקה בהצלחה"
            action={action}
        />
    </>
    )
}