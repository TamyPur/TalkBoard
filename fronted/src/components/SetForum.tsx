import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Switch from '@mui/material/Switch';
import { Autocomplete, Chip, FormControlLabel, ThemeProvider, createTheme } from '@mui/material';
import axios from 'axios';
import { FormEventHandler, useEffect, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { TForum } from '../interfaces/forum';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TCategory } from '../interfaces/category'


export const SetForum = () => {
    let navigate = useNavigate();

    const token = Cookies.get('JwtToken');
    const apiUri = 'http://localhost:3000';

    const [categories, setCategories] = useState<TCategory[]>([]);
    const [values, setValues] = useState(['', '', '']);
    const [list, setList] = useState<string[]>([""]);
    const [checked, setChecked] = useState(false);
    const [count, setCount] = useState(list.length);
    const [validated, setValidated] = useState(false);
    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [forum, setForum] = useState<TForum>();
    const [showError, setShowError] = useState(false);
    const [selectCategories, setSelectCategories] = useState<TCategory[]>([]);




    let admin: any;
    const { forumId, userId } = useParams();
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;


    useEffect(() => {
        handleClickOpen();
        getCategories();
        getForum()
    }, [])

    useEffect(() => {
        if (list[list.length - 1] != "") {
            setCount(count + 1);
            const newList = [...list, ""]
            setList(newList);
        }
    }, [list])

    useEffect(() => {
        getData();
        getSelectCategories();
    }, [forum])


    const getForum = () => {
        axios.get(`${apiUri}/forum/${forumId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            }
        )
            .then(res => { setForum(res.data) })
            .catch(error => console.log(error))
    }

    const getData = () => {
        if (forum) {
            admin = forum.admin
            setCount(forum.usersList.length)
            setList(forum.usersList);
            setChecked(!forum.isPublic);
            const v: string[] = [forum.subject, forum.description, forum.password];
            setValues(v);
        }
    }

    const getCategories = () => {
        axios.get(`${apiUri}/category`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            }
        )
            .then(res => setCategories(res.data.sort((a: { name: string; }, b: { name: string; }) => a.name > b.name ? 1 : -1)))
            .catch(error => console.log(error))
    }

    const getSelectCategories = () => {
        let temp: TCategory[] = []
        forum?.categoriesList.map((category, i) => temp[i] = category);
        setSelectCategories(temp);
    }

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
        if (password == forum?.password) {
            setOpen(false);
        }
        else {
            setPassword("")
            setShowError(true);
        }
    };

    const exit = () => {
        navigate(`/homePage/forum/${forumId}/${userId}`)
    }

    const handleToggle = () => () => {
        setChecked(!checked);
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

    const getList = () => {
        let content = [];
        for (let i = 0; i < count; i++) {
            content.push(<Form.Control className='input-mail' type="email" value={list[i]} onChange={(event) => updateList(event, i)} />);
            content.push(<label onClick={() => deleteLine(list[i])}><MdOutlineCancel /></label>)
            content.push(<br />)
        }
        return content;
    };
    const updateList = (event: { target: { value: any; }; }, index: number) => {
        const newList = [...list];
        newList[index] = event.target.value
        setList(newList);
    }

    const submitForum: FormEventHandler = (event) => {
        handleSubmit(event)
        if (checkValid()) {
            const tempList = list.filter(email => email != "");
            const newForum = {
                _id: forumId,
                admin: admin,
                subject: values[0],
                isPublic: !checked,
                lastEdited: forum?.lastEdited,
                password: values[2],
                description: values[1],
                usersList: tempList,
                categoriesList: selectCategories
            }

            try {
                const token = Cookies.get('JwtToken');
                axios.put(`${apiUri}/forum/${forumId}`, newForum,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );
                navigate(`/homePage/forum/${forumId}/${userId}`)
            } catch {
                console.log()
            }
        }
    };
    const deleteLine = (_email: string) => {
        const tempList = list.filter(email => email != _email);
        setList(tempList);
        setCount(count - 1);
    }

    const deleteForum = () => {
        try {
            const token = Cookies.get('JwtToken');
            axios.delete(`${apiUri}/forum/${forumId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            navigate(`/homePage/forumList`)
        }
        catch (error) {
            console.log(error)
        }
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
            for (let i = 0; i < list.length; i++)
                if (!expression.test(list[i]) && list[i] != "")
                    return false
        return true
    }

    const changePassword = (pass: string) => {
        setPassword(pass);
        setShowError(false)
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
            <Form noValidate validated={validated} className='new' onSubmit={submitForum}>
                <Form.Group className="mb-3" controlId="formGridAddress2">
                    <Form.Label>נושא הפורום</Form.Label>
                    <Form.Control required name='subject' value={values[0]} onChange={onFormChange} placeholder="הנושא יוצג למשתתפי הפורום" />
                    <Form.Control.Feedback type="invalid">זהו שדה חובה</Form.Control.Feedback>
                </Form.Group>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>תיאור</Form.Label>
                        <Form.Control value={values[1]} type="text" name='description' onChange={onFormChange} placeholder="לשימוש אישי" />
                    </Form.Group>
                </Row>
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
                        value={selectCategories}
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

                <Button className='submit del' variant="primary" type="submit">
                    עדכן
                </Button>
                <Button className='submit del' variant="primary" onClick={deleteForum}>
                    מחק
                </Button>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>האם אתה מנהל הפורום?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            אנא הכנס/י את סיסמת הפורום על מנת לערוך אותו
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="password"
                            // label="הכנס סיסמה"
                            type="password"
                            fullWidth
                            variant="standard"
                            value={password}
                            onChange={(event) => changePassword(event.target.value)}
                        />
                        {showError ? (<small className='error'>סיסמה שגויה</small>) : (<></>)}
                    </DialogContent>
                    <DialogActions>
                        <Button className='pink-button' onClick={exit}>יציאה</Button>
                        <Button className='pink-button' onClick={handleClose}>אישור</Button>
                    </DialogActions>
                </Dialog>
            </Form>
        </div>
    )
}
