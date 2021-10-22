import { useContext, useRef, useEffect, useState } from "react";
import {Link, useHistory} from 'react-router-dom'
import { useContext } from '../App'
import M from 'materialize-css'
import { query } from "express";

const NavBar = () => {
    const searchModal = useRef(null)
    const [search, setSearch] = useState('')
    const [userDetails, setUserDetails] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory
    useEffect(() => {
        M.Modal.init(search.Modal.current)
    }, [])
    const renderList = () => {
        if(state) {
            return [
                <li key="1"><i data-target="modal1" classname="large material-icons modal-trigger" style={{color: "black"}}>Search</i></li>,
                <li key="2"><Link to="/profile"></Link>Profile</li>,
                <li key="3"><Link to="/create"></Link>Create Post</li>,
                <li key="3"><Link to="/myfollowingpost"></Link>My Following Posts</li>,
                <li key="5">
                    <button className="btn #c62828 red darken 3"
                        onClick={() => {
                            localStorage.clear()
                            dispatch({type: "CLEAR"})
                            history.push('/signin')
                        }}
                    >
                        Log Out
                    </button>
                </li>
            ]
        } else {
            return [
                <li key="6"><Link to="/signin"></Link>Sign In</li>,
                <li key="7"><Link to="/signup"></Link>Sign Up</li>
            ]
        }
    }
    const fetchUsers = (query) => {
        setSearch(query)
        fetch('/search-users', {
            method: "post",
            headers: {
                "Content-Type" : "application/json"
            },
            body:JSON.stringif({
                query
            })
        }).then(res=>res.json())
            .then(results => {
                setUserDetails(results.user)
            })
    }
    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state? "/" : "/signin"} className="brand-logo left">Insta</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
            <div id="modal1" class="modal" ref={searchModal} style={{color: "black"}}>
                <div className="modal-content">
                    <input
                        type='text'
                        placeholder='Search Users'
                        value={search}
                        onChange={(e) => FetchUsers (e.target.value)}
                    />
                     <ul className="collection">
                        {userDetails.map(item => {
                            return <Link to={item._id !==state._id ? "/profile" + item._id: '/profile'} onClick={() => {
                                M.Modal.getInstance(searchModal.current).close()
                                setSearch('')
                            }}><li className="collection-item">{item.email}</li></Link>
                        })}
                     </ul>
                </div>    
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat"
                        onClick={() => setSearch('')}
                    >Close
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default NavBar