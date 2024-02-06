import { TUser } from "../interfaces/user"
import { useSelector } from "react-redux"
import { UserState } from "../type"
import axios from "axios"
import Cookies from 'js-cookie';
import { Box, Button, TextField } from "@mui/material"
import { useState } from 'react'


export const UpdatePassword = () => {

    const currentUser: TUser = useSelector(
        (state: UserState) => state.currentUser
    )

    const apiUri = 'http://localhost:3000';
    const token = Cookies.get('JwtToken');

    const [correctPassword, setCorrectPassword] = useState(false)
    const [tempPassword, setTempPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")


    const checkPassword = () => {
        if (tempPassword == currentUser.tempPassword)
            setCorrectPassword(true)
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
        })
            .catch((err) => { console.log(err) })
    }

    return (
        <div className='full-width'>
            <Box sx={{ '& > :not(style)': { m: 1 } }}>
                <br />
                <h4>עדכון סיסמה</h4>
                {correctPassword ? (<>
                    <label>בחר/י סיסמה חדשה</label><br />
                    <TextField
                        name='newPassword'
                        onChange={(event) => setNewPassword(event.target.value)}
                        value={newPassword}
                        sx={{ "width": "90%" }}
                    />
                    <br />
                    <Button className='outline-button' type='submit' onClick={FupdateUser} sx={{ "width": "90%" }}>
                        עדכון סיסמה
                    </Button>
                </>) : (<>
                    <label>יש להזדהות באמצעות הסיסמה שנשלחה אליך לתיבת האימייל</label><br />
                    <TextField
                        name='tempPassword'
                        onChange={(event) => setTempPassword(event.target.value)}
                        value={tempPassword}
                        sx={{ "width": "90%" }}
                    />
                    <br />
                    <Button className='outline-button' type='submit' onClick={checkPassword} sx={{ "width": "90%" }}>
                        המשך
                    </Button>
                </>)}
            </Box>
        </div>
    )
}
