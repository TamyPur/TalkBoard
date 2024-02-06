import axios from "axios";
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import { TCustomer } from "../interfaces/customer";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IconButton, Tooltip, TooltipProps, Typography, styled, tooltipClasses } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { TUser } from "../interfaces/user";
import React from "react";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));




export const CustomerManagement = () => {

    const apiUri = 'http://localhost:3000';
    const token = Cookies.get('JwtToken');
    const [customers, setCustomers] = useState<TCustomer[]>([])
    const [users, setUsers] = useState<TUser[]>([])
    const [render, setRender] = useState<Boolean>()

    useEffect(() => {
        getUsers();
        getCustomers();
    }, [render])


    const getCustomers = () => {
        axios.get(`${apiUri}/customer`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            }
        )
            .then(res => setCustomers(res.data))
            .catch(error => console.log(error))
    }

    const deleteCustomer = (id: string) => {
        axios.post(`${apiUri}/customer/delete/${id}`, { _id: id },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            }
        )
            .then(() => setRender(!render))
            .catch(error => console.log("in deleteCustomer " + error))
    }

    const getUsers = () => {
        axios.get(`${apiUri}/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        )
            .then(res => setUsers(res.data))
            .catch(error => console.log(error))
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell className="title" align="right"><b>סמל החברה</b></TableCell>
                            <TableCell className="title" align="right"><b>שם החברה</b></TableCell>
                            <TableCell className="title" align="right"><b>קצת עלינו...</b></TableCell>
                            <TableCell className="title" align="right"><b>איש קשר</b></TableCell>
                            <TableCell className="title" align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.map((customer, i) => (
                            <TableRow
                                key={customer.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                </TableCell>
                                <TableCell align="right">{i + 1}</TableCell>
                                <TableCell align="right">
                                    <img style={{ height: "35px" }} src={`${apiUri}/files/${customer.logo}`} />
                                </TableCell>
                                <TableCell align="right">{customer.name}</TableCell>
                                <TableCell align="right">{customer.description}</TableCell>
                             
                                <HtmlTooltip
                                    title={
                                        <React.Fragment>
                                            <Typography color="inherit">{users.find((u => u._id == customer.userId))?.name}</Typography>
                                            {users.find((u => u._id == customer.userId))?.occupation}<br />
                                            {users.find((u => u._id == customer.userId))?.email} | {users.find((u => u._id == customer.userId))?.phoneNumber}<br />
                                            {users.find((u => u._id == customer.userId))?.address}<br />
                                        </React.Fragment>
                                    }
                                >
                                    <TableCell align="right">{users.find((u => u._id == customer.userId))?.name}</TableCell>
                                </HtmlTooltip>
                                <TableCell align="right">
                                    <IconButton onClick={() => deleteCustomer(customer._id)} aria-label="delete" size="large">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )

}