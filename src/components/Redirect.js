import { useLocation, Navigate } from "react-router-dom";

const Redirect = ()=> {
    const location = useLocation();
 
 
    return <Navigate to="/login" state={{ from: location }} replace />
}

export default Redirect