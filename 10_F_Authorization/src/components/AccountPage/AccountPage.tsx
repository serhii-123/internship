import './account-page.css';

type AccountPageProps = {
    username: string;
    number: number;
}

function AccountPage({ username, number }: AccountPageProps) {
    return <div className="account-page">
        <h1 className="account-page__heading">Account Page</h1>
        <p className="account-page__text">Your username: {username}</p>
        <p className="account-page__text">Given number: {number}</p>
    </div>;
}
 
export default AccountPage;