import { useState, useEffect, ChangeEvent } from 'react'
import PersonIcon from '@mui/icons-material/Person';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import EmailIcon from '@mui/icons-material/Email';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupsIcon from '@mui/icons-material/Groups';
import Cookies from 'js-cookie';
import axios from 'axios';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import StarRateIcon from '@mui/icons-material/StarRate';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { TUser } from '../interfaces/user';
import { UserState } from '../type';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { Avatar, IconButton } from '@mui/material';


export const Account = () => {

    const currentUser: TUser = useSelector(
        (state: UserState) => state.currentUser
    )

    const [logo, setLogo] = useState<any>();
    const [logoName, setLogoName] = useState("");
    const [profilePicture, setProfilePicture] = useState<any>();
    const [profilePictureName, setProfilePictureName] = useState<any>();
    const [customer, setCustomer] = useState({ _id: "", name: "", description: "" });
    const [user, setUser] = useState(currentUser);
    const [showCustomerForm, setShowCustomerForm] = useState(false);

    const apiUri = 'http://localhost:3000';
    const token = Cookies.get('JwtToken');

    useEffect(() => {
        setUser(currentUser)
    }, [currentUser])

    useEffect(() => {
        getCustomers()
        if (customer._id)
            setShowCustomerForm(true)
    }, [user])

    const getCustomers = () => {
        axios.get(`${apiUri}/customer/${currentUser._id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            }
        )
            .then(res => setCustomer(res.data))
            .catch(error => console.log(error))
    }

    const changeCustomer = (event: { target: { name: string; value: any; }; }) => {
        setCustomer({ ...customer, [event.target.name]: event.target.value });
    }

    const changeUser = (event: { target: { name: string; value: any; }; }) => {
        setUser({ ...user, [event.target.name]: event.target.value });
    }

    const onChangeLogo = (file: ChangeEvent) => {
        const { files } = file.target as HTMLInputElement;
        if (files && files.length !== 0) {
            setLogoName(files[0].name)
            setLogo(files[0]);
        }
    }

    const onChangeProfilePicture = (file: ChangeEvent) => {
        const { files } = file.target as HTMLInputElement;
        if (files && files.length !== 0) {
            setProfilePictureName(files[0].name)
            setProfilePicture(files[0]);
        }
    }

    const objectToFormData = (obj: Object) => {
        const formData = new FormData();

        Object.entries(obj).forEach(([key, value]) => {
            formData.append(key, value);
        });
        return formData;
    }

    const updateUser = () => {
        if (!(user.phoneNumber.match('[0-9]{10}')))
            console.log('Please provide valid phone number');
        const formData = objectToFormData(user);
        formData.append("file", profilePicture);
        axios.put(`${apiUri}/user/${currentUser._id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
                Accept: 'application/json',
            }
        }
        ).then((data) => {console.log(data) })
            .catch((err) => { console.log(err) })
    }

    const customerSubmit = () => {
        const newCustomer = {
            name: customer['name'],
            description: customer['description'],
            logo: ""
        }
        const formData = objectToFormData(newCustomer);
        formData.append("file", logo);
        axios.post(`${apiUri}/customer/${currentUser._id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
                Accept: 'application/json',
            }
        }
        ).then((data) => { console.log(data) })
            .catch((err) => { console.log(err) })
    }


    return (
        <div id='account-form' className='account-form scroll'>
            <Box sx={{ '& > :not(style)': { m: 1 } }}>
                <form onSubmit={updateUser}>
                    <IconButton sx={{ p: 0 }}>
                        <Avatar sx={{ width: 65, height: 65 }} alt={user.name} src={`${apiUri}/files/${currentUser.profilePicture}`} />
                    </IconButton>
                    <br />


                    <TextField
                        id="input-with-icon-textfield"
                        label="שם"
                        name='name'
                        onChange={(event) => changeUser(event)}
                        value={user.name}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon />
                                </InputAdornment>
                            ),
                        }}
                        variant="standard"
                    />
                    <br />
                    <TextField
                        id="input-with-icon-textfield"
                        label="עיסוק"
                        name='occupation'
                        onChange={(event) => changeUser(event)}
                        value={user.occupation}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <VerifiedUserIcon />
                                </InputAdornment>
                            ),
                        }}
                        variant="standard"
                    />
                    <br />
                    <TextField
                        id="input-with-icon-textfield"
                        label="אימייל"
                        name='email'
                        onChange={(event) => changeUser(event)}
                        value={user.email}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon />
                                </InputAdornment>
                            ),
                        }}
                        variant="standard"
                    />
                    <br />
                    <TextField
                        id="input-with-icon-textfield"
                        label="מספר פלאפון"
                        name='phoneNumber'
                        onChange={(event) => changeUser(event)}
                        value={user.phoneNumber}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PhoneAndroidIcon />
                                </InputAdornment>
                            ),
                        }}
                        variant="standard"
                    />
                    <br />
                    <TextField
                        id="input-with-icon-textfield"
                        label="כתובת"
                        name='address'
                        onChange={(event) => changeUser(event)}
                        value={user.address}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LocationOnIcon />
                                </InputAdornment>
                            ),
                        }}
                        variant="standard"
                    />
                    <br />
                    {/* <SwitchAccountIcon /> */}
                    <div className="app">
                        <SupervisedUserCircleIcon />

                        <label>תמונת פרופיל</label>
                        <div className="parent">
                            <div className="file-upload">
                                <Avatar>
                                    <CloudUploadOutlinedIcon />
                                </Avatar>
                                <input name='profilePicture' id='file' type="file" onChange={onChangeProfilePicture} />
                                <small>{profilePictureName}</small>
                            </div>
                        </div>
                    </div>
                    <small>פרטים אלו יהיו גלויים לכל משתמשי המערכת</small>
                    <Button className='submit short-submit' variant="primary" type='submit'>
                        עדכון פרטים
                    </Button>
                </form>


                <p>
                    <h4 >בעל עסק?</h4>
                    <small>קבל פירסום אטרקטיבי</small><br/>
                    {showCustomerForm ? (<a href='#customer'><KeyboardArrowUpIcon onClick={() => setShowCustomerForm(!showCustomerForm)} /></a>) : (<a href='#account-form'><KeyboardArrowDownIcon onClick={() => setShowCustomerForm(!showCustomerForm)} /> </a>)}
                </p>

                {showCustomerForm ? (
                    <form id='customer' className='account-form business-form' onSubmit={() => customerSubmit()}>
                        <TextField
                            id="input-with-icon-textfield"
                            label="שם העסק"
                            name='name'
                            onChange={(event) => changeCustomer(event)} value={customer.name}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <GroupsIcon />
                                    </InputAdornment>
                                ),
                            }}
                            variant="standard"
                        />

                        <TextField
                            id="input-with-icon-textfield"
                            label="תיאור העסק"
                            name='description'
                            onChange={(event) => changeCustomer(event)} value={customer.description}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <ContentPasteIcon />
                                    </InputAdornment>
                                ),
                            }}
                            variant="standard"
                        />
                        <br />
                        <div className="app">
                            <StarRateIcon />

                            <label>לוגו של העסק</label>
                            <div className="parent">
                                <div className="file-upload">
                                    <Avatar>
                                        <CloudUploadOutlinedIcon />
                                    </Avatar>
                                    <input name='profilePicture' id='file' type="file" onChange={onChangeLogo} />
                                    <small>{logoName}</small>
                                </div>
                            </div>
                        </div>
                        <Button className='submit short-submit' variant="primary" type='submit'>
                            לפרסום החברה
                        </Button>

                    </form>
                ) : (<></>)}
            </Box>
        </div>
    )
}
