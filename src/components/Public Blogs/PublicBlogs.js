// Author: Karan Bhaveshbhai Kharecha
import React, {useEffect, useState} from "react";
import {withRouter} from "react-router-dom";
import './PublicBlogs.css'
import Modal from "react-bootstrap/Modal";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


function displayContent(setContentShow, setContent, content, setTitle, title, setSubTitle, subtitle) {
    console.log('displaying...')
    setContentShow(true)
    setContent(content)
    setTitle(title)
    setSubTitle(subtitle)
}

function PublicBlogs() {

    const requestblogsdata = {
        method: 'POST',
        mode: 'no-cors'
    }

    requestblogsdata.body = new FormData();
    requestblogsdata.body.append('userid', localStorage.getItem("email"))

    const [contentShow, setContentShow] = useState(false);
    const [grid, setGrid] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [subTitle, setSubTitle] = useState("");

    useEffect(() => {

        fetch('/https://awd-backend.herokuapp.com/getalluserblogs', requestblogsdata).then(response => response.json().then(data => {
            console.log(data)

            let grid = []

            for (let blog = 0; blog < data.length; blog++) {
                grid.push(
                    <div className="card col-md-3 m-3 p-4 rounded text-center blog"
                         key={blog.toString()}>
                        <div className="m-0 p-0">
                            <button className="btn btn-info btn-block blog-title"
                                    onClick={() => displayContent(setContentShow, setContent, data[blog]['content'],
                                        setTitle, data[blog]['title'], setSubTitle, data[blog]['subtitle'])}>
                                {data[blog]['title']}
                            </button>
                            <p className="card-text p-2">{data[blog]['subtitle']}</p>
                        </div>
                    </div>
                )
            }

            setGrid(grid)

        }));

    }, [])

    return (
        <div className="container m-3">

            <div className="row justify-content-center">
                <div className="col">
                    <button type="button" className="btn btn-dark btn-lg btn-block m-3 blog-public" disabled>
                        <i className="fa fa-newspaper-o"/> Public Blogs
                    </button>
                </div>
            </div>

            <div className="row justify-content-center">
                {grid}
                <Modal
                    size="lg"
                    show={contentShow}
                    onHide={() => setContentShow(false)}
                    centered>
                    <Modal.Header closeButton>
                        <div>
                            <Modal.Title id="article-content">
                                {title}
                            </Modal.Title>
                            <label><i>{subTitle}</i></label>
                        </div>
                    </Modal.Header>
                    <Modal.Body dangerouslySetInnerHTML={{__html: content}}/>
                </Modal>
            </div>
        </div>
    )

}

export default withRouter(PublicBlogs);
