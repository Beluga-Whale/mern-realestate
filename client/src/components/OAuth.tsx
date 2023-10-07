import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { loginWithGoogle } from '../store/user/userSlice';

const OAuth = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const action = await dispatch(loginWithGoogle());
            const type = action.type.split('/');
            if (type[2] === 'fulfilled') {
                navigate('/');
            }
        } catch (err) {
            console.log('could not sign in with google ', err);
        }
    };
    return (
        <button
            onClick={handleGoogleClick}
            type="button"
            className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 "
        >
            Continue with google
        </button>
    );
};

export default OAuth;
