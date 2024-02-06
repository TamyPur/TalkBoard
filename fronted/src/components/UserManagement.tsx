import axios from "axios";
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { TUser } from "../interfaces/user";

export const UserManagement = () => {
    const [users, setUsers] = useState<TUser[]>();
    const [open, setOpen] = useState(false);
    const token = Cookies.get('JwtToken');
    const apiUri = 'http://localhost:3000';
    const [render, setRender] = useState<boolean>()
    const [expanded, setExpanded] = useState<string | false>();
    const [user, setUser] = useState<TUser>();

    useEffect(() => {
        getUsers()
    }, [render])

    const getUsers = () => {
        axios.get(`${apiUri}/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        )
            .then(res => setUsers(res.data))
            .catch(error => console.log(error))
    }


    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false);
        };

    const deleteUser = () => {
        axios.put(`${apiUri}/user/delete/${user?._id}`, {
            id: user?._id
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        )
            .then(() => setRender(!render))
            .catch(error => console.log(error))
    }

    // const getPassword = (password: string) => {
    //     let pass = [...password];
    //     for (let i = 0; i < password.length - 3; i++) {
    //         pass[i] = '*';
    //     }
    //     console.log(pass.join(''));
    //     if(users)
    //     console.log(users[0].email);
    //     return pass.join('');
    // }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseAndDelete = () => {
        setOpen(false);
        deleteUser();
    };

    return (
        <div className="scroll list">
            {users?.map((user) =>
                <Accordion expanded={expanded === user._id} onChange={handleChange(user._id)} TransitionProps={{ unmountOnExit: true }} className="item-of-list">
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >

                        <Typography>
                            <p>
                                <IconButton size="small" sx={{ p: 0 }}>
                                    <Avatar alt={user.name} src={`${apiUri}/files/${user.profilePicture}`} />
                                </IconButton>
                                <b>{" " + user.name}</b></p>
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography >
                            <strong>אימייל: </strong> {user.email} <br />
                            {/* <strong >סיסמה: </strong> {getPassword(user.password)} <br /> */}
                            <strong>כתובת: </strong> {user.address}<br />
                            <strong>עיסוק: </strong> {user.occupation}<br />
                            <strong>טלפון: </strong> {user.phoneNumber}<br />

                            <Stack direction="row" alignItems="center" spacing={1}>
                                <IconButton onClick={() => { setUser(user); handleClickOpen(); }} aria-label="delete" size="large">
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>האם את/ה בטוח/ה שברצונך להסיר את <strong>{user?.name}</strong></DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        המשתמש יוסר מהמערכת ולא יוכל להתחבר מחדש
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button className='pink-button' onClick={handleClose}>לא</Button>
                    <Button className='pink-button' onClick={handleCloseAndDelete}>כן</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}