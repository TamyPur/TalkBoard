import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { TForum } from '../interfaces/forum';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { TUser } from '../interfaces/user';
import { RiChatPrivateFill } from "react-icons/ri";
import { BsFillChatQuoteFill } from "react-icons/bs";



export const ForumList = () => {

    const apiUri = 'http://localhost:3000';

    const [forums, setForums] = useState<TForum[]>([]);
    const [filterForums, setFilterForums] = useState<TForum[]>([]);
    const [currentUser, setCurrentUser] = useState<TUser>();

    let navigate = useNavigate();


    useEffect(() => {
        const token = Cookies.get('JwtToken');
        axios.get(`${apiUri}/forum`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        )
            .then(res => setForums(res.data))
            .catch(error => alert(error))

        axios.get(`${apiUri}/user/getCurrentUser`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        ).then(res => setCurrentUser(res.data))
            .catch(err => alert(err))
    }, []);


    useEffect(() => {
        if (forums && currentUser) {
            setFilterForums(forums.filter(f => f.isPublic == true || (f.isPublic == false && f.usersList.includes(currentUser.email))))
        }
    }, [forums, currentUser])

    const renderRow = (props: ListChildComponentProps) => {
        const { index, style } = props;

        return (
            <div className="forum-list">
                <ListItem style={style} key={index} component="div" disablePadding>
                    <ListItemButton>
                        {
                            filterForums[index].isPublic ? (
                                <h3><BsFillChatQuoteFill /></h3>)
                                :
                                (<h3><RiChatPrivateFill /></h3>)
                        }

                        <ListItemText onClick={() => { showForum(filterForums[index]._id); }} className="ListItemText" primary={filterForums[index].issue} />
                    </ListItemButton>
                </ListItem>
            </div>
        );
    }
    const showForum = (_forumId: any) => {
        const token = Cookies.get('JwtToken');
        axios.post(`${apiUri}/forum/enterToForum/${_forumId}`,
            {
                forumId: _forumId
            }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        )
            .then(data => {
                Cookies.set('JwtToken', data.data, { expires: 7 });
                navigate(`/homePage/forum/${_forumId}/${currentUser?._id}`)
            })
            .catch(error => alert(error))
    }

        return (
            <div className="scroll">
                <Box
                    sx={{ width: '97%', height: 550, bgcolor: 'background.paper', border: 'black solid 1px', borderRadius: '1%' }}
                >
                    <FixedSizeList
                        height={550}
                        width={'100%'}
                        itemSize={46}
                        itemCount={filterForums.length}
                        overscanCount={5}>
                        {renderRow}
                    </FixedSizeList>

                </Box>
            </div>
        )
}