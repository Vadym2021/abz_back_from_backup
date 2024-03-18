import React from 'react';
import {Outlet} from "react-router-dom";


const LayoutPage = () => {
    return (

        <div>
            <Outlet/>
        </div>

    );
};

export {LayoutPage};