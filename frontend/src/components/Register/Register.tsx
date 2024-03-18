import React, {useEffect} from 'react';
import {IUserCreate} from "../../interfaces";
import {SubmitHandler, useForm} from "react-hook-form";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {useNavigate} from "react-router-dom";
import {apiActions} from "../../redux";

const Register = () => {
    const {error} = useAppSelector(state => state.apiReducer);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(apiActions.setError(null));
    }, []);

    const {register, handleSubmit} = useForm<IUserCreate>({
        defaultValues: {
            userName: "",
            userEmail: "",
            userPhone: "",
            position_id: undefined,
            userPhoto: undefined,
        },
    });

    const onSubmit: SubmitHandler<IUserCreate> = async (data) => {
        try {
            const formData = new FormData();
            formData.append('userName', data.userName);
            formData.append('userEmail', data.userEmail);
            formData.append('userPhone', data.userPhone);
            formData.append('position_id', String(data.position_id));
            formData.append("userPhoto", data.userPhoto[0]);


            const response = await dispatch(apiActions.register(formData));
            if (response.meta.requestStatus === "fulfilled") {
                navigate("/");
            }
        } catch (error) {
            console.error("Error during registration:", error);
        }
    };

    return (
        <div>
            <form style={{display: 'flex', gap: '10px', padding: '10px'}} onSubmit={handleSubmit(onSubmit)}
                  encType="multipart/form-data">
                <input type="text" placeholder={"username"} {...register("userName")} />
                <input type="text" placeholder={"email"} {...register("userEmail")} />
                <input type="text" placeholder={"phone"} {...register("userPhone")} />
                <input type="text" placeholder={"positionId"} {...register("position_id")} />
                <input type="file" placeholder={"photo"} {...register("userPhoto")} />

                <button type="submit">Register</button>
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
    );

}

export {Register};
