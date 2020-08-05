// Author: Karan Bhaveshbhai Kharecha
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import './Blogs.css'
import Modal from "react-bootstrap/Modal";
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { getUserToken } from "../UserFunctions/LoginRegister";


function deleteArticle(blog) {
    console.log('deleting...')
    let response = window.confirm("Do you want to delete this article?");
    if (response) {
        submitDeletion(blog)
    }
}

function submitDeletion(blog) {
    const connectionRequestToDelete = new XMLHttpRequest();
    connectionRequestToDelete.open('POST', 'https://awd-backend.herokuapp.com/deleteblog');
    connectionRequestToDelete.onload = () => {
        const responseData = JSON.parse(connectionRequestToDelete.responseText);
        console.log(responseData.status);
        if (responseData.status) {
            window.alert("Deleted Successfully");
            window.location.reload();
        } else {
            window.alert("Blog could not be deleted, please try again later.");
        }
    }

    submitDeleteArticle(connectionRequestToDelete, blog)
}

function submitDeleteArticle(connectionRequestToDelete, blog) {
    const data = new FormData();
    data.append('userid', getUserToken("usertoken").identity.email)
    data.append('blog_title', blog.title)
    data.append('blog_subtitle', blog.subtitle)
    connectionRequestToDelete.send(data);
    return false;
}

function displayContent(setContentShow, setContent, content, setTitle, title, setSubTitle, subtitle) {
    console.log('displaying...')
    setContentShow(true)
    setContent(content)
    setTitle(title)
    setSubTitle(subtitle)
}

function hideConfirmation(setNewBlogShow) {
    let response = window.confirm("Article will be discarded, continue?")
    if (response) {
        setNewBlogShow(false)
    }

}

function getConfirmation(setNewBlogShow, operation, editorState) {
    if (operation === 'save') {
        let response = window.confirm("Do you want to save and publish the article?");
        if (response) {
            let articleTitle = document.getElementById("title").value;
            let articleSubtitle = document.getElementById("subtitle").value;
            let articleContent = draftToHtml(convertToRaw(editorState.getCurrentContent()));

            if (articleTitle === "" || articleTitle == null ||
                articleSubtitle === "" || articleSubtitle == null ||
                articleContent === "" || articleContent == null) {
                alert("Please fill all the fields to submit the article")
                return
            }

            console.log(articleTitle)
            console.log(articleSubtitle)
            console.log(articleContent)
            console.log("saving...")

            sendArticle(articleTitle, articleSubtitle, articleContent, setNewBlogShow);
        }
    } else if (operation === 'discard') {
        let response = window.confirm("Do you want to discard the article?");
        if (response) {
            setNewBlogShow(false)
        }
    }

}

function sendArticle(articleTitle, articleSubtitle, articleContent, setNewBlogShow) {
    const connectionRequest = new XMLHttpRequest();
    connectionRequest.open('POST', 'https://awd-backend.herokuapp.com/saveblog');
    connectionRequest.onload = () => {
        const responseData = JSON.parse(connectionRequest.responseText);
        console.log(responseData.status);

        setNewBlogShow(false)
        if (responseData.status) {
            window.alert("Saved Successfully");
            window.location.reload();
        } else {
            window.alert("Blog could not be saved, please try again later.");
        }
    }

    submitArticle(connectionRequest, articleTitle, articleSubtitle, articleContent)

}

function submitArticle(connectionRequest, articleTitle, articleSubtitle, articleContent) {
    const data = new FormData();
    data.append('userid', getUserToken("usertoken").identity.email)
    data.append('blog_title', articleTitle)
    data.append('blog_subtitle', articleSubtitle)
    data.append('blog_content', articleContent)
    connectionRequest.send(data);
    return false;
}

function Blogs() {

    const requestformdata = {
        method: 'POST'
    }

    requestformdata.body = new FormData();
    requestformdata.body.append('userid', getUserToken("usertoken").identity.email)

    const [contentShow, setContentShow] = useState(false);
    const [grid, setGrid] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [subTitle, setSubTitle] = useState("");
    const [newBlogShow, setNewBlogShow] = useState(false);
    const [editorState, onEditorStateChange] = useState(EditorState.createEmpty());

    useEffect(() => {

        fetch('https://awd-backend.herokuapp.com/getuserblogs', requestformdata).then(response => response.json().then(data => {
            console.log(data)

            let grid = []

            for (let blog = 0; blog < data.length; blog++) {
                grid.push(
                    <div className="card col-md-3 m-3 p-4 rounded text-center blog"
                        key={blog.toString()}>
                        <div className="m-0 p-0">
                            <button className="btn btn-fill animation-on-hover btn-primary btn-block blog-title"
                                onClick={() => displayContent(setContentShow, setContent, data[blog]['content'],
                                    setTitle, data[blog]['title'], setSubTitle, data[blog]['subtitle'])}>
                                {data[blog]['title']}
                            </button>
                            <p style={{ color: "white" }} className="card-text p-2">{data[blog]['subtitle']}</p>
                        </div>
                        <button className="btn btn-fill animation-on-hover btn-danger"><i onClick={() => {
                            deleteArticle(data[blog])
                        }} className="fa fa-trash" /></button>
                    </div>
                )
            }

            setGrid(grid)

        }));

    }, [])

    return (
        <div className="toprated-wrapper">
            <p className="jumbotoprated display-4">
                Blogging<span role="img" aria-label="popcorn">
                    🍿
      </span>
            </p>
            <p className="lead-toprated">
                Express your thoughts.
        </p>
            <hr style={{ backgroundColor: "white" }}></hr>
            <div className="container m-3">

                <div className="row justify-content-center">
                    <div className="col">
                        <button type="button" className="btn btn-fill animation-on-hover btn-success btn-lg m-3 blog-new"
                            onClick={() => setNewBlogShow(true)}>Write New Blog
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
                        <Modal.Body dangerouslySetInnerHTML={{ __html: content }} />
                    </Modal>
                    <Modal
                        size='xl'
                        show={newBlogShow}
                        onHide={() => hideConfirmation(setNewBlogShow)}
                        centered>

                        <Modal.Header className='bg-dark text-white justify-content-center'>
                            <Modal.Title id="article-content">
                                <p style={{ color: "#61DAFB" }}><span role="img" aria-label="pen">🖊️</span> Start writing your new blog! <span role="img" aria-label="pen">🖊️</span></p>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className='bg-new-blog'>
                            <form>
                                <label>Title</label>
                                <input style={{ color: "black" }} type='text' className="blogsInput form-control" id="title"
                                    placeholder="Avengers Infinity War: Endgame (2019)" required />
                                <hr />
                                <label>Subtitle</label>
                                <input style={{ color: "black" }} type='text' className="form-control" id="subtitle"
                                    placeholder="How did Tony Stark die?" required />
                                <hr />
                                <label>Content</label>

                                <Editor
                                    editorState={editorState}
                                    toolbarClassName="toolbarClassName"
                                    wrapperClassName="wrapperClassName"
                                    editorClassName="editorClassName"
                                    onEditorStateChange={onEditorStateChange}
                                    editorStyle={{
                                        'background': '#FFFFFF',
                                        'border': '1px solid #E0E0E0',
                                        'border-radius': '5px',
                                        'padding': '10px'
                                    }}
                                    toolbarStyle={{
                                        'background': '#FFFFFF',
                                        'border': '1px solid #E0E0E0',
                                        'border-radius': '5px'
                                    }}
                                />
                                <button type="button" className="btn btn-danger btn-lg m-3 float-right"
                                    onClick={() => getConfirmation(setNewBlogShow, 'discard', editorState)}>
                                    <i className="fa fa-close" /> Discard
                            </button>
                                <button type="button" className="btn btn-success btn-lg m-3 float-right"
                                    onClick={() => getConfirmation(setNewBlogShow, 'save', editorState)}>
                                    <i className='fa fa-floppy-o' /> Save
                            </button>
                            </form>
                        </Modal.Body>

                    </Modal>
                </div>
            </div></div>
    )

}

export default withRouter(Blogs);
