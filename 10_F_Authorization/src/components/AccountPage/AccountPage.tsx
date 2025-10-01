import './account-page.css';

type AccountPageProps = {
    username: string;
    number: number;
}

function AccountPage({ username, number }: AccountPageProps) {
    return <div className="account-page">
        <h1>Account Page</h1>
        <p>Your username: {username}</p>
        <p>Given number: {number}</p>
    </div>;
}
 
export default AccountPage;