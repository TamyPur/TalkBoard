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
import Tooltip from '@mui/material/Tooltip';
import { Autocomplete, Button, Chip, InputAdornment, OutlinedInput, TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { TCategory } from '../interfaces/category';
import { useSelector } from 'react-redux';
import { UserState } from '../type';
import SearchIcon from '@mui/icons-material/Search';
import { TMessage } from '../interfaces/message';

export const ForumList = () => {

    const currentUser: TUser = useSelector(
        (state: UserState) => state.currentUser
    )

    const apiUri = 'http://localhost:3000';

    const [forums, setForums] = useState<TForum[]>([]);
    const [filterForums, setFilterForums] = useState<TForum[]>([]);
    const [category, setCategory] = useState<string | null>('');
    const [categories, setCategories] = useState<TCategory[]>([]);
    const [categoriesName, setCategoriesName] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [messages, setMessages] = useState<TMessage[]>([]);



    let navigate = useNavigate();
    const token = Cookies.get('JwtToken');

    useEffect(() => {
        getForums();
        getMessages();
        getCategories();
    }, []);

    useEffect(() => {
        getCategoriesName()
    }, [categories]);

    useEffect(() => {
        filter()
    }, [forums, currentUser, category, search])

    const filter = () => {
        if (forums && currentUser) {
            let _filterForum = forums.filter(f => f.isPublic || (!f.isPublic && f.usersList.includes(currentUser.email)))
            setFilterForums(_filterForum)
            if (category) {
                _filterForum = _filterForum.filter(f => f.categoriesList.some(_c => _c.name == category))
                setFilterForums(_filterForum)
            }
            if (search) {
                setFilterForums(_filterForum.filter(f => filterBySearch(f)))
            }
        }
    }

    const filterBySearch = (forum: TForum) => {
        if (forum.subject.includes(search) || forum.description.includes(search))
            return true
        for (let i = 0; i < messages.length; i++) {
            if (messages[i].forumId == forum._id && messages[i].content.includes(search))
                return true
        }
        return false;
    }

    const cleanSearch = () => {
        setSearch("")
        setCategory("")
    }

    const getMessages = () => {
        axios.get(`${apiUri}/message`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            }
        )
            .then(res => { setMessages(res.data); })
            .catch(error => console.log(error))
    }

    const reverseForums = (newArray: TForum[]) => {
        newArray.sort((a, b) => new Date(a.lastEdited).getTime() - new Date(b.lastEdited).getTime()).reverse();
        setForums(newArray)
    }

    const getCategoriesName = () => {
        let temp: string[] = [];
        categories.map((c) => temp.push(c.name))
        setCategoriesName(temp.sort((a,b)=>a > b ? 1 : -1));
    }

    const getForums = () => {
        axios.get(`${apiUri}/forum`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        )
            .then(res => { reverseForums(res.data); })
            .catch(error => console.log(error))
    }

    const getCategories = () => {
        axios.get(`${apiUri}/category`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        )
            .then(res => setCategories(res.data))
            .catch(error => console.log(error))

    }

    const renderRow = (props: ListChildComponentProps) => {
        const { index, style } = props;
        return (
            <div className="forum-list">
                <ListItem style={style} key={index} component="div" disablePadding>
                    <ListItemButton onClick={() => { showForum(filterForums[index]._id); }}>
                        {
                            filterForums[index].isPublic ? (
                                <h3><BsFillChatQuoteFill /></h3>)
                                :
                                (<h3><RiChatPrivateFill /></h3>)
                        }
                        <ListItemText className='r'>
                            {filterForums[index].categoriesList.map((category) => (
                                <Chip key={category._id} label={category.name} />
                            ))}
                        </ListItemText>
                        <Tooltip title={filterForums[index].description} placement="bottom-end">
                            <ListItemText className="ListItemText" primary={filterForums[index].subject} />
                        </Tooltip>
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
        }).then(data => {
            Cookies.set('JwtToken', data.data, { expires: 7 });
            navigate(`/homePage/forum/${_forumId}/${currentUser?._id}`)
        }).catch(error => console.log(error))
    }

    return (
        <div className="grid">
            <Box className="g1 grid-colum" sx={{ minWidth: 120 }}>
                <Autocomplete className='c1'
                    noOptionsText={'לא נמצאו תוצאות'}
                    value={category}
                    disablePortal
                    id="combo-box-demo"
                    options={categoriesName}
                    renderInput={(params) => <TextField {...params} placeholder='בחר תווית לחיפוש' />}
                    onChange={(event, value) => setCategory(value)}
                />

                <FormControl className='c2' variant="outlined">
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={'text'}
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <SearchIcon />
                            </InputAdornment>
                        }
                    // label="Password"
                    />
                </FormControl>
                {category || search ? (
                    <Button className='c3 small' onClick={cleanSearch} variant="outlined" color='inherit'>ניקוי נתוני חיפוש</Button>
                ) : (
                    <Button className='c3' onClick={cleanSearch} variant="outlined" color='inherit' disabled>ניקוי נתוני חיפוש</Button>
                )}
            </Box>

            {filterForums.length > 0 ? (
                <Box className="g2"
                    sx={{ width: '97%', bgcolor: 'background.paper', border: 'black solid 1px', borderRadius: '1%' }}
                >
                    <FixedSizeList className='scroll'
                        height={480}
                        width={'100%'}
                        itemSize={46}
                        itemCount={filterForums.length}
                        overscanCount={5}>
                        {renderRow}
                    </FixedSizeList>
                </Box>
            ) : (<Box className="g2 center"
                sx={{ width: '97%', bgcolor: 'background.paper', border: 'black solid 1px', borderRadius: '1%' }}
            >
                <p></p>
                <p>לא נמצאו תוצאות התואמות את הגדרות החיפוש שלך</p>
                <small>ניתן למטב את החיפוש ע"י שימוש במילות מפתח והסרת מילות קישור</small>
            </Box>)}
        </div>
    )
}