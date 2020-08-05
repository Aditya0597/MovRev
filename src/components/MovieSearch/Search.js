import React from 'react';
import { withRouter } from 'react-router-dom';
import './Search.css';

const Search = (props) => {
    return (
        <div className="searchBar">
            <div className="container-search">
                <input className="input_search" type="text" value={props.search} onChange={props.detectChange} placeholder="Search Movies..." />
                <div className="icon_search" onClick={props.searchAction}><i className="fas fa-search"></i></div>
            </div>
        </div>



    );
}
export default withRouter(Search);

