import logo from '../images/logo.png';

const WelcomePage = () => {
    return (
        <div className="flex flex-col items-center p-8">
            <h1>Patents</h1>
            <img src={logo} alt="logo" />
        </div>
    )
}

export default WelcomePage;