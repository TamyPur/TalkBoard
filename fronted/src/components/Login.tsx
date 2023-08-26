import { useNavigate } from "react-router-dom"
import axios from 'axios';
import { ChangeEvent, SetStateAction, useState } from "react";
import '../form.css';
import Cookies from 'js-cookie';


export const Login = () => {

    const apiUri = 'http://localhost:3000';


    const [showErrorMessage, setShowErrorMessage] = useState(1);

    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [email, setEmail] = useState('');
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
        default:
            content = null;
    }

    const signIn = async (event: any): Promise<void> => {
        event.preventDefault();
        setShowErrorMessage(1);
        const user = {
            id: 1,
            name: fName + " " + lName,
            email: email
        }

        try {
            const { data } = await axios.post(`${apiUri}/user/signin`, user);
            Cookies.set('JwtToken', data, { expires: 7 })
            setFName('');
            setLName('');
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
                id: 1,
                name: fName + " " + lName,
                email: email
            }
            debugger    
            await axios.post(`${apiUri}/user/signup`, newUser)
                .then(res => enter(res.data))
                .catch(error => catchError(error.response.data.message))
        }
    }
    const enter = (data: string) => {
        Cookies.set('JwtToken', data, { expires: 7 })
        setFName('');
        setLName('');
        setEmail('');
        navigate('/homePage/forumList')
    }
    const catchError=(message:string)=>{
        if (message=='User already exists')
                 setShowErrorMessage(3);
             else
                 setShowErrorMessage(4);
    }
    const valid = () => {
        debugger
        if ((fName == "" && lName == "") || !emailTest.test(email)) {
            setShowErrorMessage(4);
            return false
        }
        return true
    }



    return (
        <div className="formBody">
            <div className="background">
                <div className="shape"></div>
                <div className="shape"></div>
            </div>
            <form onSubmit={signUp}>
                <label htmlFor="firstName" >שם פרטי</label>
                <input type="text" required id="firstName" placeholder="שם" value={fName} onChange={(event) => setFName(event.target.value)} />
                <label htmlFor="firstName" >שם משפחה</label>
                <input type="text" required id="lastName" placeholder="משפחה" value={lName} onChange={(event) => setLName(event.target.value)} />
                <label htmlFor="email">אימייל</label>
                <input type="email" required id="email" placeholder="אמייל" value={email} onChange={(event) => setEmail(event.target.value)} />
                <button className="r" type="submit">הרשמה</button>
                <button onClick={signIn} className="l">התחברות</button>
                <div className="badge bg-warning text-dark">{content}</div>

            </form >

        </div>
    )
}



