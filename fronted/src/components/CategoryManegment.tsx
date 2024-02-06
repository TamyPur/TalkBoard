import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { TCategory } from '../interfaces/category';
import { Button, IconButton} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';



export const CategoryManegment = () => {

  const [categories, setCategories] = useState<TCategory[]>([])
  const [categoryName, setCategoryName] = useState("");
  const [render, setRender] = useState<boolean>();
  const [showAddCategory, setShowAddCategory] = useState<boolean>();




  const apiUri = 'http://localhost:3000';
  const token = Cookies.get('JwtToken');

  useEffect(() => {
    getCategories()
  }, [render])

  const getCategories = () => {
    axios.get(`${apiUri}/category`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      }
    )
      .then(res => setCategories(res.data))
      .catch(error => console.log(error))
  }

  const addCategory = () => {
    debugger
    const newCategory = {
      name: categoryName
    }
    axios.post(`${apiUri}/category`, newCategory,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      }
    )
      .then(() => { setRender(!render); setCategoryName(""); setShowAddCategory(false) })
      .catch(error => console.log(error))
  }

  return (
    <TableContainer className='center' component={Paper}>
      <Table sx={{ width: 650 }} aria-label="simple table">
        <TableBody>
          {categories.sort((a,b)=>a.name > b.name ? 1 : -1).map((category, i) => (
            <TableRow
              key={category._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <b>{i + 1}</b>
              </TableCell>
              <TableCell align="right">{category.name}</TableCell>
              <TableCell align="right">  </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <IconButton onClick={() => setShowAddCategory(!showAddCategory)} aria-label="addCategory" size="large">
        {showAddCategory?(<CloseIcon />):(<AddIcon />)}
      </IconButton>
      {showAddCategory ? (<>
        <input type='text' value={categoryName} onChange={(event) => setCategoryName(event.target.value)}></input>
        <Button color='inherit' onClick={()=>addCategory()} variant="outlined" startIcon={<DoneIcon />} size='small'>
          הוספת הקטגוריה
        </Button>
      </>) : (<></>)}

    </TableContainer>
  )
}
