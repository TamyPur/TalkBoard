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
import { TForum } from "../interfaces/forum";
import { useSelector } from "react-redux";
import { UserState } from "../type";
import { Avatar, Stack, Tooltip, TooltipProps, Typography, styled, tooltipClasses } from "@mui/material";

interface props {
    renderPage: () => void;
    message: TMessage;
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));

export const Message = ({ renderPage, message }: props) => {

    const currentUser: TUser = useSelector(
        (state: UserState) => state.currentUser
    )
    const token = Cookies.get('JwtToken');
    const apiUri = 'http://localhost:3000';
    const [user, setUser] = useState<TUser>();
    const [Sdate, setSDtae] = useState("");
    const [currentForum, setCurrentForum] = useState<TForum>();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        getOwner()
        getForum()
        getDate();
    }, [])

    const getOwner = () => {
        axios.get(`${apiUri}/user/${message.owner}`)
            .then(res => setUser(res.data))
            .catch(err => console.log(err))
    }

    const getForum = () => {
        axios.get(`${apiUri}/forum/${message.forumId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            }
        )
            .then((res) => setCurrentForum(res.data))
            .catch((err) => console.log(err))
    }


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
        const d: Date = new Date(message.date);
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
        axios.post(`${apiUri}/message/${message._id}`,
            {
                id: message._id
            }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        ).then(() => { handleClick(); updateDate(); })
            .catch(err => console.log(err))
        renderPage();
    }

    const updateDate = () => {
        const token = Cookies.get('JwtToken');
        axios.put(`${apiUri}/forum/updateDate/${message.forumId}`,
            {
                forumId: message.forumId
            }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }

        ).then(() => { })
            .catch(error => console.log(error))
    }

    return (<>
        {message.deleted ? (
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
                    <HtmlTooltip
                        title={
                            <React.Fragment>
                                <Typography color="inherit">{user?.name}</Typography>
                                {user?.occupation}<br />
                                {user?.email} | {user?.phoneNumber}<br />
                                {user?.address}<br />
                            </React.Fragment>
                        }
                    >
                        <Stack direction="row" spacing={2} className="mb-1">
                            <Avatar alt={user?.name} src={`${apiUri}/files/${user?.profilePicture}`} sx={{ width: 25, height: 25 }} />
                          <strong> {user?.name} </strong>  
                        </Stack>
                    </HtmlTooltip>
                    <small>{Sdate}</small>
                </div>
                <div className="d-flex w-100 justify-content-between">
                    <p className="mb-1 text-break" dangerouslySetInnerHTML={{ __html: message.content }}></p>
                    {currentUser?._id == message.owner || currentUser?._id == currentForum?.admin ? (
                        <IconButton onClick={deleteMessage} aria-label="deleteMessage" size="small">
                            <AiFillDelete />
                        </IconButton>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        )}
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={handleClose}
            message="ההודעה נמחקה בהצלחה"
            action={action}
        />
    </>
    )
}