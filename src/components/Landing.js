import { useNavigate } from "react-router-dom";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


const Landing = ()=> {
    const navigate = useNavigate();

    return(
        <Container spacing={4} sx={{mt: 5}}>
            <Typography variant="h3">Welcome to Full Gospel Portal</Typography>
            <Typography variant="subtitle1">NB: Few gages are still under construction.</Typography>
            <ul>
                <li><Button variant="text" onClick={()=> navigate('login')}>Login</Button></li>
                <li><Button variant="text" onClick={()=> navigate('register')}>Register</Button></li>
                <li><Button variant="text" onClick={()=> navigate('admin/dashboard')}>Admin Portal</Button></li>
            </ul>
        </Container>
    )
}

export default Landing;