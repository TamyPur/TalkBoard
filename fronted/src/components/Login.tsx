import { useNavigate } from "react-router-dom"
import axios from 'axios';
import { useState } from "react";
import Cookies from 'js-cookie';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { TUser } from "../interfaces/user";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export const Login = () => {

    const apiUri = 'http://localhost:3000';


    const [showErrorMessage, setShowErrorMessage] = useState(1);

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [hide, setHide] = useState(true);
    const [open, setOpen] = useState(false);
    const [send, setSend] = useState(false);

    let navigate = useNavigate();
    let content;

    const emailTest: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    switch (showErrorMessage) {
        case 1:
            content = null;
            break;
        case 2:
            content = <div>אימות משתמש נכשל, אנא נסה שנית</div>;
            break;
        case 3:
            content = <div>משתמש קיים, התחבר כדי להכנס</div>;
            break;
        case 4:
            content = <div>אימייל קיים במערכת</div>;
            break;
        case 5:
            content = <div>סיסמה קיימת במערכת</div>;
            break;
        default:
            content = null;
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const signIn = async (event: any): Promise<void> => {
        event.preventDefault();
        setShowErrorMessage(1);
        const user = {
            id: 1,
            name: name,
            email: email,
            password: password
        }

        try {
            const { data } = await axios.post(`${apiUri}/user/signin`, user);
            Cookies.set('JwtToken', data, { expires: 7 })
            setName('');
            setPassword('');
            setEmail('');
            navigate('/homePage/forumList')
        }
        catch (data) {
            setShowErrorMessage(2)
        }

    }

    const signUp = async (event: any) => {
        if (valid()) {
            event.preventDefault();
            setShowErrorMessage(1);
            const newUser = {
                name: name,
                email: email,
                password: password
            }
            await axios.post(`${apiUri}/user/signup`, newUser)
                .then(res => enter(res.data))
                .catch(error => catchError(error.response.data.message))
        }
    }
    const enter = (data: string) => {
        Cookies.set('JwtToken', data, { expires: 7 })
        setName('');
        setPassword('');
        setEmail('');
        navigate('/homePage/forumList')
    }

    const catchError = (message: string) => {
        if (message == 'User already exists')
            setShowErrorMessage(3);
        else
            if (message == 'User with this email already exists')
                setShowErrorMessage(4);
            else
                setShowErrorMessage(5)
    }

    const valid = () => {
        if ((name == "") || !emailTest.test(email)) {
            setShowErrorMessage(4);
            return false
        }
        return true
    }

    const forgetPassword = () => {
        const user = {
            name: name,
            email: email
        }
        axios.post(`${apiUri}/user/forgetPassword`, user
        ).then((res) =>{ sendMailPassword(res.data);})
            .catch((err) => { alert(err) })
    }

    const sendMailPassword = (user: TUser) => {
        axios.post(`${apiUri}/mail/sendMailPassword`, user)
            .then(() => setSend(true))
            .catch((err) => alert(err)
            )
    }

    return (
        <div className="formBody">
            <div className="background">
                <div className="shape"></div>
                <div className="shape"></div>
            </div>
            <form onSubmit={signUp}>
                <label htmlFor="firstName" >שם </label>
                <input type="text" required id="firstName" placeholder="שם" value={name} onChange={(event) => setName(event.target.value)} />
                <label htmlFor="password" >סיסמה</label>
                <div className="wrapper">
                    {
                        hide ? (<>
                            <div className="icon">
                                <p className="t" onClick={() => setHide(!hide)}><VisibilityIcon /></p>
                            </div>
                            <input className="input" type="password" required id="lastName" placeholder="סיסמה" value={password} minLength={8} maxLength={13} onChange={(event) => setPassword(event.target.value)} />
                        </>
                        ) : (<><div className="icon">
                            <p className="t" onClick={() => setHide(!hide)}><VisibilityOffIcon /></p>
                        </div>
                            <input className="input" type="text" required id="lastName" placeholder="סיסמה" value={password} minLength={8} maxLength={13} onChange={(event) => setPassword(event.target.value)} />
                        </>
                        )
                    }
                </div>
                <a href="#" onClick={handleClickOpen} className="small">שכחתי סיסמה</a>
                <label htmlFor="email">אימייל</label>
                <input type="email" required id="email" placeholder="אמייל" value={email} onChange={(event) => setEmail(event.target.value)} />
                <button type="submit">הרשמה</button>
                <button onClick={signIn} className="l">התחברות</button>
                <div className="badge bg-warning text-dark">{content}</div>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>שינוי סיסמה</DialogTitle>
                    {send?(
                         <DialogContent>
                             <DialogContentText>
                          הנפקנו לך סיסמה זמנית חדשה, ושלחנו לך לתיבת האימייל
                          עם סיסמה זו תוכל/י להתחבר לחשבון שלך באופן חד- פעמי
                        </DialogContentText>
                        <DialogActions>
                        <Button className='submit del' onClick={handleClose}>סגור</Button>
                    </DialogActions>
                         </DialogContent>
                    ):(
                        <DialogContent>
                             <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="שם"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={name}
                            onChange={(event)=>setName(event.target.value)}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="מייל"
                            type="email"
                            fullWidth
                            variant="standard"
                            value={email}
                            onChange={(event)=>setEmail(event.target.value)}
                        />
                         <DialogActions>
                        <Button className='submit' onClick={forgetPassword}>שלחו לי סיסמה</Button>
                    </DialogActions>
                        </DialogContent>
                    )}
                </Dialog>
            </form >
        </div>
    )
}



