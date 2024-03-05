import { TUser } from "../interfaces/user"
import { useSelector } from "react-redux"
import { UserState } from "../type"
import axios from "axios"
import Cookies from 'js-cookie';
import { Box, Button, TextField } from "@mui/material"
import { useEffect, useState } from 'react'


export const UpdatePassword = () => {

    const currentUser: TUser = useSelector(
        (state: UserState) => state.currentUser
    )

    const apiUri = 'http://localhost:3000';
    const token = Cookies.get('JwtToken');

    const [steps, setSteps] = useState(1)
    const [tempPassword, setTempPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [invalidPassword, setInvalidPassword] = useState(false)

    useEffect(() => {
        setInvalidPassword(false)
    }, [steps])


    const checkPassword = () => {
        if (tempPassword == currentUser.tempPassword)
            setSteps(2)
    }

    const objectToFormData = (obj: Object) => {
        const formData = new FormData();
        Object.entries(obj).forEach(([key, value]) => {
            formData.append(key, value);
        });
        return formData;
    }

    const FupdateUser = () => {
        const user: TUser = currentUser;
        user.password = newPassword;
        if (user.password.length >= 8) {
            const formData = objectToFormData(user);
            axios.put(`${apiUri}/user/${currentUser._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                }
            }
            ).then((data) => {
                Cookies.set('JwtToken', data.data, { expires: 7 })
                console.log(data);
                setNewPassword("");
                setSteps(3)
            })
                .catch(() => setInvalidPassword(true))
        }
        else{
            setInvalidPassword(true)
        }
    }

    const showContent = () => {
        let content = []
        if (steps == 1) {
            content.push(<label>יש להזדהות באמצעות הסיסמה שנשלחה אליך לתיבת האימייל</label>)
            content.push(<br />)
            content.push(<TextField
                name='tempPassword'
                onChange={(event) => setTempPassword(event.target.value)}
                value={tempPassword}
                sx={{ "width": "90%" }}
            />)
            content.push(<br />)
            content.push(<Button className='outline-button' type='submit' onClick={checkPassword} sx={{ "width": "90%" }}>
                המשך
            </Button>)
        }
        if (steps == 2) {
            content.push(<label>בחר/י סיסמה חדשה</label>)
            content.push(<br />)
            content.push(<TextField
                name='newPassword'
                onChange={(event) => setNewPassword(event.target.value)}
                value={newPassword}
                sx={{ "width": "90%" }}
            />)
            content.push(<br />)
            content.push(<Button className='outline-button' type='submit' onClick={FupdateUser} sx={{ "width": "90%" }}> עדכון סיסמה</Button>)
        }
        if (steps == 3)
            content.push(<p>סיסמתך עודכנה בהצלחה, תודה על שיתוף הפעולה!</p>)
        return content;
    }

    return (
        <div className='full-width'>
            <Box sx={{ '& > :not(style)': { m: 1 } }}>
                <br />
                <h4>עדכון סיסמה</h4>
                {showContent()}
                {invalidPassword ? (<small className="error center">סיסמה לא חוקית</small>) : (<></>)}
            </Box>
        </div>
    )
}
