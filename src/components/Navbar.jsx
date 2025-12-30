import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { MiniSecondaryButton, PrimaryButton, SecondaryButton } from "./Buttons";
import { getLoggedByAuth0, getUnloggedByAuth0 } from "../redux/loginSlice";
import { getFavourites } from "../redux/favouritesSlice";
import { setSection } from "../redux/sectionSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Login
    const {
        loginWithRedirect,
        logout,
        user,
        isAuthenticated,
        getAccessTokenSilently
    } = useAuth0();

    const getLoggedWithToken = async () => {
        const token = await getAccessTokenSilently();
        dispatch(getLoggedByAuth0({ user: user, token: token }));
    }

    const dispatch = useDispatch();
    useEffect(() => {
        if (isAuthenticated) {
            getLoggedWithToken();
        }
    }, [isAuthenticated])

    const handleLogout = () => {
        dispatch(getUnloggedByAuth0());
        logout();
    }

    // Dropdown state for user menu
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const closeDropdown = () => setIsDropdownOpen(false);

    // Get user profile
    const { isLogged, token } = useSelector((state) => state.login);
    const { userInfo } = useSelector((state) => state.userProfile);

    // select section

    const { sectionNumber } = useSelector(state => state.section);
    const sortStatus = useSelector(state => state.sortStatus);
    const { pageSize } = useSelector(state => state.search);

    // Handle settings button click
    const handleSettingsClick = () => {
        if (location.pathname === '/settings') {
            // If we're on settings page, go back to home page
            navigate('/');
            handleSection(0); // Set section to "Tutti"
        } else {
            // If we're not on settings page, navigate to settings
            navigate('/settings');
            handleSection(2);
        }
    };

    const handleSection = (number) => {
        dispatch(setSection(number))
        if (number === 1) {
            dispatch(getFavourites({
                favouritesData: {
                    doc_num: '',
                    pdfrom: '',
                    pdto: ''
                }, token: token, sort: sortStatus, pageSize: pageSize
            }));
        }
    }

    return (
        <div className="navbar">
            <div className="flex items-center gap-4">
                {/* Profile Picture on Left */}
                {isAuthenticated && userInfo?.logopath && (
                    <div className="w-10 h-10 border-2 border-slate-200 bg-white shadow-sm overflow-hidden">
                        <img 
                            src={userInfo.logopath} 
                            alt={userInfo?.displayname || 'User avatar'} 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                )}
                
                <div className="min-w-[150px]">
                    {isLogged ? (
                        <div className="flex items-center">
                            <h2 className="font-bold text-slate-800">Pat-To-Date</h2>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <h2 className="font-bold text-slate-800">Pat-To-Date</h2>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex gap-6 items-center">
                {isAuthenticated && (
                    <nav className="flex gap-2 mr-4">
                        <Link to="/">
                            <button 
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                                    sectionNumber === 0 
                                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                                }`} 
                                onClick={() => { handleSection(0) }}
                            >
                                Tutti
                            </button>
                        </Link>
                        <Link to="/">
                            <button 
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                                    sectionNumber === 1 
                                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                                }`} 
                                onClick={() => { handleSection(1) }}
                            >
                                Preferiti
                            </button>
                        </Link>
                    </nav>
                )}
                
                {!isAuthenticated && <PrimaryButton text="Login" click={() => loginWithRedirect()} />}
                
                {isAuthenticated && (
                    <div className="relative">
                        <button 
                            onClick={toggleDropdown}
                            className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        >
                            <div className="w-10 h-10 rounded-full border-2 border-slate-200 bg-white shadow-sm overflow-hidden">
                                {user?.picture ? (
                                    <img 
                                        src={user.picture} 
                                        alt={user?.name || 'User avatar'} 
                                        className="w-full h-full object-cover" 
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">
                                            {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </button>
                        
                        {isDropdownOpen && (
                            <>
                                <div 
                                    className="fixed inset-0 z-10" 
                                    onClick={closeDropdown}
                                ></div>
                                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-2">
                                    <div className="px-4 py-3 border-b border-slate-100">
                                        <p className="text-sm font-medium text-slate-900">
                                            {userInfo?.displayname || user?.name || 'User'}
                                        </p>
                                        <p className="text-sm text-slate-600 truncate">
                                            {user?.email}
                                        </p>
                                    </div>
                                    
                                    <button
                                        onClick={() => {
                                            handleSettingsClick();
                                            closeDropdown();
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150"
                                    >
                                        <i className="fi fi-rr-user-gear text-base mr-3 text-slate-500"></i>
                                        Impostazioni
                                    </button>
                                    
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            closeDropdown();
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150"
                                    >
                                        <i className="fi fi-rr-exit text-base mr-3 text-slate-500"></i>
                                        Esci ({userInfo?.displayname || user?.name || 'User'})
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar;