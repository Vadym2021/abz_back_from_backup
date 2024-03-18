import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {HeaderPage} from "./page/header/HeaderPage";
import {Register} from "./components/Register/Register";
import {LayoutPage} from "./page/layout/LayoutPage";
import {UserList} from "./components/UserList/UserList";
import {PositionsList} from "./components/UserPositions/PositionsList";
import {User} from "./components/User/User";


const App = () => {
    return (

        <div>
            <HeaderPage/>
            <Routes><Route path={'register'} element={<Register/>}/>
                <Route path={'/'} element={<LayoutPage/>}/>
                <Route path={'users'} element={<UserList/>}/>
                <Route path={'users/:id'} element={<User/>}/>
                <Route path={'positions'} element={<PositionsList/>}/>
            </Routes>
        </div>

    );
};

export default App;
