import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks";
import css from './HeaderPage.module.css';
import {NavLink} from 'react-router-dom';
import {apiActions} from "../../redux";
import Cookies from "js-cookie";


const HeaderPage = () => {

    const {tokenStatus} = useAppSelector(state => state.apiReducer)
    const {userId} = useAppSelector(state => state.apiReducer);
    const dispatch = useAppDispatch();

    const getToken = async (): Promise<void> => {
        try {
            await dispatch(apiActions.getToken());
        } catch (error) {
            console.error('Token not received:', error);
        }
    };


    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            dispatch(apiActions.setTokenStatus(true));
        }
    }, []);


    return (
        <div className={css.Header}>
            {
                tokenStatus ?
                    <div style={{color: 'greenyellow'}}>Токен есть</div> :
                    <div style={{color: 'red'}}>Токена нет</div>
            }


            <div>
                <NavLink to={'register'} onClick={getToken}>GetToken</NavLink>
                <NavLink to={'users'}>Users</NavLink>
                <NavLink to={'register'}>RegisterUser</NavLink>
                <NavLink to={`/users/${userId}`}>User By Id</NavLink>
                <NavLink to={'positions'}>GetPositions</NavLink>
            </div>

        </div>
    );
};

export {HeaderPage};


