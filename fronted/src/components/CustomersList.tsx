import { useEffect, useState } from 'react';
import { TCustomer } from '../interfaces/customer';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Customer } from './Customer';
import { Stack } from '@mui/material';

export const CustomersList = () => {

  const [customers, setCustomers] = useState<TCustomer[]>([])
  const apiUri = 'http://localhost:3000';
  const token = Cookies.get('JwtToken');

  useEffect(() => {
    getCustomers()
  }, [])

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

  return (
    <div className='scroll'>
      <Stack direction="row" spacing={2} useFlexGap flexWrap={"wrap"}>

        {customers.map((_customer, i) => <Customer key={i} _id={_customer._id} name={_customer.name} description={_customer.description} logo={_customer.logo} userId={undefined} />)}
      </Stack>
    </div>
  )
}
