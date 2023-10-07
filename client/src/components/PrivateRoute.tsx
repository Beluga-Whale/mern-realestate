import { useAppSelector } from '../store/index';
import { userSelector } from '../store/user/userSlice';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute = () => {
    const user = useAppSelector(userSelector);
    console.log(user);

    return (
        <>
            {user.currentUserDatabase || user.currentUserGoogle ? (
                <Outlet />
            ) : (
                <Navigate to="/sign-in" />
            )}
        </>
    );
};

export default PrivateRoute;
