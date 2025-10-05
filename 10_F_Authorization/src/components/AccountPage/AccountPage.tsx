import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Fetcher from '../../classes/Fetcher';
import type { MeResponse } from './types/me-response';
import './account-page.css';

type AccountPageProps = {
    numberless: boolean;
};

function AccountPage({ numberless }: AccountPageProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [userNumber, setUserNumber] = useState(0);

    useEffect(() => { init() }, []);

    const init = async () => {
        const path = location.pathname;
        const pathValidationExp = /^\/me(\/[0-9])?$/;
        const pathIsValid = pathValidationExp.test(path);

        if(pathIsValid) {
            const accessToken = localStorage.getItem('accessJwt') as string;
            let response: Response;

            if(numberless)
                response = await Fetcher.makeMeRequest(accessToken);
            else {
                const numberPart = path.replace('/me/', '');
                const reqNumber = parseInt(numberPart);
                response = await Fetcher.makeMeRequest(accessToken, reqNumber);
            }
            
            const { data, request_num } = await response.json() as MeResponse;
            const { username } = data;

            setUsername(username);
            setUserNumber(request_num || 0);
        } else navigate('/me');
    }

    return <div className="account-page">
        <h1 className="account-page__heading">Account Page</h1>
        <p className="account-page__text">Your username: {username}</p>
        {numberless || (
            <p className="account-page__text">Your number: {userNumber}</p>
        )}
    </div>;
}
 
export default AccountPage;