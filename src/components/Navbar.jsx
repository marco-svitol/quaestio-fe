import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { MiniSecondaryButton, PrimaryButton, SecondaryButton } from "./Buttons";
import { getLoggedByAuth0, getUnloggedByAuth0 } from "../redux/loginSlice";
import { getFavourites } from "../redux/favouritesSlice";
import { setSection } from "../redux/sectionSlice";
import { Link } from "react-router-dom";

const Navbar = () => {

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

    // Get user profile
    const { isLogged, token } = useSelector((state) => state.login);
    const { userInfo } = useSelector((state) => state.userProfile);

    // select section

    const { sectionNumber } = useSelector(state => state.section);
    const sortStatus = useSelector(state => state.sortStatus);
    const { pageSize } = useSelector(state => state.search);
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
            <div className="min-w-[150px]">
                {
                    isLogged ? (
                        <div className="flex gap-4 items-center">
                            <div className="w-16 h-16 flex justify-center items-center border p-1">
                                {userInfo && userInfo.logopath && <img src={userInfo.logopath} alt="avatar" className="rounded-xl" />}
                            </div>
                            {userInfo && userInfo.displayname && <h2>{userInfo.displayname}</h2>}
                            <Link to="/settings"><div className="border border-red-300 py-1 pt-[10px] px-3 rounded-xl" onClick={() => handleSection(2)}><i class="fi fi-rr-user-gear text-2xl"></i></div></Link>
                        </div>
                    ) : (
                        <></>
                    )
                }
            </div>
            <div className="flex gap-4 items-center">
                {isAuthenticated && <ul className="flex gap-4 text-2xl text-red-800 mr-8 items-center">
                    <Link to="/"><li className={`cursor-pointer hover:text-black ${sectionNumber === 0 ? 'bg-red-100' : ''} rounded-lg p-2`} onClick={() => { handleSection(0) }}>Tutti</li></Link>
                    <Link to="/"><li className={`cursor-pointer hover:text-black ${sectionNumber === 1 ? 'bg-red-100' : ''} rounded-lg p-2`} onClick={() => { handleSection(1) }}>Preferiti</li></Link>
                </ul>}
                {!isAuthenticated && <PrimaryButton text="Login" click={() => loginWithRedirect()} />}
                {
                    isAuthenticated && <MiniSecondaryButton text="Logout" click={handleLogout} />
                }
            </div>
        </div>
    )
}

export default Navbar;