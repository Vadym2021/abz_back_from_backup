import {useEffect} from 'react';
import {apiActions, RootState} from "../../redux";
import {useAppDispatch} from "../../hooks";
import {useSelector} from "react-redux";


const PositionsList = () => {
    const {positions} = useSelector((state: RootState) => state.apiReducer);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(apiActions.getPositions());
    }, []);


    return (
        <div>
            {positions && positions.length > 0 && (
                <ul>
                    {positions.map((position) => (
                        <li key={position.id}>
                            <p>Id: {position.id}</p>
                            <p>Name: {position.name}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export {PositionsList};
