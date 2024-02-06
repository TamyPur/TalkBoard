import React, { useEffect } from 'react';
import { FormEventHandler, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Switch from '@mui/material/Switch';
import { Autocomplete, FormControlLabel, TextField, ThemeProvider, createTheme } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { MdOutlineCancel } from 'react-icons/md';
import { TCategory } from '../interfaces/category';
import Chip from '@mui/material/Chip';
import { TForum } from '../interfaces/forum';
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export const NewForum = () => {

    const apiUri = 'http://localhost:3000';
    const [values, setValues] = useState(['', '', '']);
    const [emailList, setEmailList] = useState<string[]>([""]);
    const [checked, setChecked] = React.useState(false);
    const [count, setCount] = useState(emailList.length);
    const [validated, setValidated] = useState(false);
    const [categories, setCategories] = useState<TCategory[]>([]);
    const [open, setOpen] = useState(false);
    const [selectCategories, setSelectCategories] = useState<TCategory[]>([]);

    const token = Cookies.get('JwtToken');
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    let navigate = useNavigate();


    useEffect(() => {
        getCategories()
    }, [])

    useEffect(() => {
        if (emailList[emailList.length - 1] != "") {
            setCount(count + 1);
            const newList = [...emailList, ""]
            setEmailList(newList);
        }
    }, [emailList])

    const getCategories = () => {
        axios.get(`${apiUri}/category`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            }
        )
            .then(res => setCategories(res.data.sort((a: { name: string; },b: { name: string; })=>a.name > b.name ? 1 : -1)))
            .catch(error => console.log(error))
    }

    const handleToggle = () => () => {
        setChecked(!checked);
    };

    const theme = createTheme({
        components: {
            MuiSwitch: {
                styleOverrides: {
                    switchBase: {
                        color: "white",
                    },
                    colorPrimary: {
                        "&.Mui-checked": {
                            color: "#C32A53"
                        }
                    },
                    track: {
                        opacity: 0.2,
                        backgroundColor: "#9b9999",
                        ".Mui-checked.Mui-checked + &": {
                            opacity: 0.7,
                            backgroundColor: "#f7d5de"
                        }
                    }
                }
            }
        }
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onFormChange = (event: { target: { name: any; value: any; }; }) => {
        const name = event.target.name;
        const value = event.target.value;
        let index: number = 0;
        switch (name) {
            case ('subject'):
                index = 0;
                break;
            case ('description'):
                index = 1;
                break;
            case ('password'):
                index = 2;
        }
        const newValues = [...values]
        newValues[index] = value;
        setValues(newValues);
    };


    const submitForum: FormEventHandler = (event) => {
        handleSubmit(event)
        if (checkValid()) {
            const tempList: string[] = emailList.filter(email => email != "");
            const newForum = {
                admin: null,
                subject: values[0],
                isPublic: !checked,
                lastEdited: Date.now(),
                password: values[2],
                description: values[1],
                usersList: tempList,
                categoriesList: selectCategories
            }
            axios.post(`${apiUri}/forum`, newForum, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            ).then((data) => {
                sendMail(data.data);
                setValues(['', '', '']);
                setEmailList(['']);
                navigate(`/homePage/forumList`);
            })
                .catch(() => errorMessage())
        }
    };

    const errorMessage = () => {
        handleClickOpen();
        const newValues = [...values]
        newValues[2] = "";
        setValues(newValues);
    }

    const getList = () => {
        let content = [];
        for (let i = 0; i < count; i++) {
            content.push(<Form.Control className='input-mail' type="email" value={emailList[i]} onChange={(event) => updateList(event, i)} />);
            content.push(<label onClick={() => deleteLine(emailList[i])}><MdOutlineCancel /></label>)
            content.push(<br />)
        }
        console.log(content);

        return content;
    };

    const updateList = (event: { target: { value: any; }; }, index: number) => {
        const newList = [...emailList];
        newList[index] = event.target.value
        setEmailList(newList);
    }
    const deleteLine = (_email: string) => {
        const tempList = emailList.filter(email => email != _email);
        setEmailList(tempList);
        setCount(count - 1);
    }

    const handleSubmit = (event: { currentTarget: any; preventDefault: () => void; stopPropagation: () => void; }) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    };

    const checkValid = () => {
        if (values[0] == "" || values[2] == "")
            return false
        if (checked)
            for (let i = 0; i < emailList.length; i++)
                if (!expression.test(emailList[i]) && emailList[i] != "")
                    return false
        return true
    }

    const sendMail = (forum: TForum) => {
        if (!forum.isPublic) {
            axios.post(`${apiUri}/mail/sendMail`, forum,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
        }
    }

    const MyChip = (props: any) => {
        return (
            <Chip
                dir="ltr"
                {...props}
            />
        );
    };

    return (
        <div className='scroll'>
            <Form noValidate validated={validated} className='new'>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridAddress2">
                        <Form.Label>נושא הפורום</Form.Label>
                        <Form.Control required name='subject' onChange={onFormChange} placeholder="יוצג למשתתפי הפורום" />
                        <Form.Control.Feedback type="invalid">זהו שדה חובה</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>סיסמא</Form.Label>
                        <Form.Control required value={values[2]} type="password" name='password' onChange={onFormChange} placeholder="סיסמא אישית לניהול הפורום" />
                        <Form.Control.Feedback type="invalid">זהו שדה חובה</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Form.Group className="mb-3" controlId="formGridEmail">
                    <Form.Label>תיאור</Form.Label>
                    <Form.Control type="text" name='description' onChange={onFormChange} placeholder="התיאור נועד למקד את נושא הפורום" />
                </Form.Group>
                <ThemeProvider theme={theme}>
                    <FormControlLabel
                        control={
                            <Switch
                                onChange={handleToggle()}
                                checked={checked}
                                name="checkedA"
                            />
                        }
                        label="פורום נגיש לרשימת משתתפים מסוימת"
                    />
                </ThemeProvider>
                {checked ? (<Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>הכנס את האימיילים שברצונך לאפשר להם גישה</Form.Label>
                        {getList()}
                    </Form.Group>
                </Row>
                ) : (<></>)}

                <div>
                    <Form.Label> תייג את הפורום שלך בתגיות המתאימות</Form.Label>
                    <Autocomplete className='center-select'
                        noOptionsText={'לא נמצאו תוצאות'}
                        multiple
                        limitTags={2}
                        id="multiple-limit-tags"
                        options={categories}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                            <TextField {...params} placeholder="הקלד לחיפוש..." />
                        )}
                        renderTags={(tagValue, getTagProps) => {
                            return tagValue.map((option, index) => (
                                <MyChip {...getTagProps({ index })} label={option.name} />
                            ));
                        }}
                        sx={{ width: '450px' }}
                        onChange={(event, value) => setSelectCategories(value)}
                    />
                </div>
                <Button className='submit' variant="primary" onClick={submitForum}>
                    יצירת הפורום
                </Button>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="console.log-dialog-title"
                    aria-describedby="console.log-dialog-description">
                    <DialogTitle id="console.log-dialog-title">
                        {"משתמש/ת יקר/ה!"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="console.log-dialog-description">
                            לצערינו הסיסמה שבחרת קיימת כבר במערכת, אנא בחר/י סיסמה אחרת
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button className='pink-button' onClick={handleClose} autoFocus>אישור</Button>
                    </DialogActions>
                </Dialog>
            </Form>
        </div>
    )
}
