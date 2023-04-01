import { useNavigate } from "react-router-dom";
import Container from '@mui/material/Container';



const Landing = ()=> {
    const navigate = useNavigate();

    return(
        <Container spacing={4} sx={{mt: 5}}>
        <div class="d-flex align-items-center justify-content-center vh-100">
            <div class="text-center row">
                <div class=" col-md-6">
                    <img src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569__340.jpg" alt=""
                        class="img-fluid"/>
                </div>
                <div class=" col-md-6 mt-5">
                    <p class="fs-3"> <span class="text-danger">Opps!</span> Page not found.</p>
                    <p class="lead">
                        The page you’re looking for doesn’t exist.
                    </p>
                    <button onClick={()=> navigate(-1)} class="btn btn-primary m-3">Go Back</button>
                    <button onClick={()=> navigate('/login')} class="btn btn-primary">Login</button>
                </div>

            </div>
        </div>
        </Container>
    )
}

export default Landing;