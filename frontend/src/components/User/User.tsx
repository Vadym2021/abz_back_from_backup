import React, {useEffect} from 'react';

import {apiActions, RootState} from "../../redux";
import {useAppDispatch, useAppSelector} from "../../hooks";


import {useSelector} from "react-redux";
import {FieldValues, SubmitHandler, useForm} from 'react-hook-form';
import {useParams} from "react-router-dom";
import {useNavigate} from 'react-router-dom';


const User = () => {
    const {user} = useSelector((state: RootState) => state.apiReducer);

    const dispatch = useAppDispatch();
    const {error} = useAppSelector(state => state.apiReducer);
    const {register, handleSubmit} = useForm();
    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();

    useEffect(() => {
        dispatch(apiActions.setError(null));
    }, []);

    useEffect(() => {
        dispatch(apiActions.getUserById(Number(id)));
    }, [id]);



    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        const userId = parseInt(data.userId);
        navigate(`/users/${userId}`);
    };

    return (
        <div>

            <div>
                <form style={{ display: 'flex', gap: '10px', padding:'10px' }} onSubmit={handleSubmit(onSubmit)}>
                    UserId:
                    <input type="number" placeholder={`User Id`} {...register('userId')} />
                    <button type="submit">Данные пользователя</button>
                </form>

                {error && (
                    <div style={{color: 'red'}}>
                        {error.message}
                        {error.fails && (
                            <ul>
                                {Object.keys(error.fails as Record<string, string[]>).map((key) => (
                                    <li key={key}>
                                        {key}: {(error.fails as Record<string, string[]>)[key].join(', ')}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

            </div>

            {user && (
                <ul>
                    <li>
                        <p>Id: {user.id}</p>
                        <p>Name: {user.name}</p>
                        <p>Email: {user.email}</p>
                        <p>phone: {user.phone}</p>
                        <p>position: {user.position}</p>
                        <p>position id: {user.position_id}</p>
                        <p><img
                            src={`https://node-dec-2022.s3.amazonaws.com/${user.photo.replace('node-dec-2022/', '')}`}
                            alt={user.name}/></p>
                    </li>
                </ul>
            )}
        </div>
    );
};

export {User};
