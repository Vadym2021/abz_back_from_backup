import React, { useEffect } from 'react';
import { apiActions, RootState } from "../../redux";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useSelector } from "react-redux";
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

const UserList = () => {
    const { users, total_users, total_pages, page, offset, count } = useSelector((state: RootState) => state.apiReducer);
    const { error } = useAppSelector(state => state.apiReducer);
    const dispatch = useAppDispatch();
    const { register, handleSubmit } = useForm();

    useEffect(() => {
        dispatch(apiActions.setError(null));
    }, []);

    useEffect(() => {
        dispatch(apiActions.getAllUsers({ page: page, offset: offset, count: count }));
    }, [dispatch, page, offset, count]);

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        const page = parseInt(data.page);
        const offset = parseInt(data.offset);
        const count = parseInt(data.count);

        dispatch(apiActions.setPage(page));
        dispatch(apiActions.setOffset(offset));
        dispatch(apiActions.setCount(count));
    };

    return (
        <div>
            <div>
                <form style={{ display: 'flex', gap: '10px', padding: '10px' }} onSubmit={handleSubmit(onSubmit)}>
                    Target page number:
                    <input type="number" min="1" max={total_pages} placeholder={`страница`} {...register('page')} />
                    Offset:
                    <input type="number" min="0" max={total_users} placeholder={`offset`} {...register('offset')} />
                    Users per page:
                    <input type="number" min="1" max={total_users} placeholder={`пользователей на стр`} {...register('count')} />
                    <button type="submit">Установить</button>
                </form>
            </div>

            {users && users.length > 0 && (
                <ul>
                    {users.map((user) => (
                        <li key={user.userId}>
                            <p>Id: {user.userId}</p>
                            <p>Name: {user.userName}</p>
                            <p>Email: {user.userEmail}</p>
                            <p>phone: {user.userPhone}</p>
                            <p>position: {user.position}</p>
                            <p>position id: {user.position_id}</p>
                            <p>registration_timestamp: {user.registration_timestamp}</p>
                            <p><img src={`https://node-dec-2022.s3.amazonaws.com/${user.userPhoto.replace('node-dec-2022/', '')}`} alt={user.userId} /></p>
                        </li>
                    ))}
                </ul>
            )}

            {error && error.message && (
                <div style={{ color: 'red' }}>
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

            <div style={{ display: 'flex', gap: '10px', padding: '10px' }}>
                <div>
                    <button
                        onClick={() => dispatch(apiActions.setPage(page < 2 ? page : page - 1))}
                        disabled={offset !== 0}
                    >
                        Prev Page
                    </button>
                </div>
                <div>We have {total_users} users in our base</div>
                <div>Page: {page} of {total_pages}</div>
                <div>
                    <button
                        onClick={() => dispatch(apiActions.setPage(page >= total_pages ? page : page + 1))}
                        disabled={offset !== 0}
                    >
                        Next Page
                    </button>
                </div>
            </div>
        </div>
    );
};

export { UserList };
