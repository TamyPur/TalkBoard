import { TCustomer } from "../interfaces/customer";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';


export const Customer = (customer: TCustomer) => {
    const apiUri = 'http://localhost:3000';

    return (
        <div>
            {/* <img style={{ height: "140px" }} src={`${apiUri}/files/${customer.logo}`} /> */}


            <Card sx={{ width: 345 }}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="140"
                        image={`${apiUri}/files/${customer.logo}`}
                        sx={{ objectFit: "contain" }}
                    />
                    <CardContent className='text-card'>
                        <Typography gutterBottom variant="h5" component="div">
                            {customer.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {customer.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    )
}