import React, { useEffect } from 'react';
import { FormEventHandler, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Switch from '@mui/material/Switch';
import { FormControlLabel, ThemeProvider, createTheme } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { MdOutlineCancel } from 'react-icons/md';

export const NewForum = () => {
    const apiUri = 'http://localhost:3000';
    const [values, setValues] = useState(['', '', '']);
    const [list, setList] = useState<string[]>([""]);
    const [checked, setChecked] = React.useState(false);
    const [count, setCount] = useState(list.length);
    const [validated, setValidated] = useState(false);

    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;



    useEffect(() => {
        if (list[list.length - 1] != "") {
            setCount(count + 1);
            const newList = [...list, ""]
            setList(newList);
        }
    }, [list])

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

    const onFormChange = (event: { target: { name: any; value: any; }; }) => {
        const name = event.target.name;
        const value = event.target.value;
        let index: number = 0;
        switch (name) {
            case ('issue'):
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
        debugger
        handleSubmit(event)
        if (checkValid()) {
            const tempList = list.filter(email => email != "");
            const newForum = {
                admin: null,
                issue: values[0],
                isPublic: !checked,
                lastEdited: Date.now(),
                password: values[2],
                description: values[1],
                usersList: tempList
            }
            try {
                const token = Cookies.get('JwtToken');
                axios.post(`${apiUri}/forum`, newForum, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setValues(['', '', '']);
                setList([''])
            } catch (err) {
                alert(err)
            }
        }

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
    const deleteLine = (_email: string) => {
        const tempList = list.filter(email => email != _email);
        setList(tempList);
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
        debugger
        if (values[0] == "" || values[2] == "")
            return false
        if (checked)
            for (let i=0; i<list.length;i++)
                if (!expression.test(list[i]) && list[i]!="")
                    return false
        return true
    }

    return (
        <div className='scroll'>
            <Form noValidate validated={validated} className='new' onSubmit={submitForum}>
                <Form.Group className="mb-3" controlId="formGridAddress2">
                    <Form.Label>נושא הפורום</Form.Label>
                    <Form.Control required name='issue' onChange={onFormChange} placeholder="הנושא יוצג למשתתפי הפורום" />
                    <Form.Control.Feedback type="invalid">זהו שדה חובה</Form.Control.Feedback>
                </Form.Group>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>תיאור</Form.Label>
                        <Form.Control type="text" name='description' onChange={onFormChange} placeholder="לשימוש אישי" />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>סיסמא</Form.Label>
                        <Form.Control required type="password" name='password' onChange={onFormChange} placeholder="סיסמא אישית לניהול הפורום" />
                        <Form.Control.Feedback type="invalid">זהו שדה חובה</Form.Control.Feedback>
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

                <Button className='submit' variant="primary" type="submit">
                    יצירת הפורום
                </Button>
            </Form>
        </div>
    )
}
