import React, { useState, useEffect } from 'react';
import { forwardRef } from 'react';
import Grid from '@material-ui/core/Grid'
import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import axios from 'axios'
import Alert from '@material-ui/lab/Alert';
import ls from 'local-storage';
import './UserReviews.css'

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const api = axios.create({
    baseURL: `https://awd-backend.herokuapp.com/loadReviews`
})
const api_2 = axios.create({
    baseURL: `https://safe-hamlet-70720.herokuapp.com/https://awd-backend.herokuapp.com`
})
const api_3 = axios.create({
    baseURL: `https://awd-backend.herokuapp.com`
})

function App() {

    var columns = [

        { title: "Movie Title", field: "title", editable: "never" },
        { title: "Review Title", field: "reviewtitle" },
        { title: "Rating", field: "rating" },
        { title: "Review", field: "description" },
    ]
    const [data, setData] = useState([]); //table data

    //for error handling
    const [iserror, setIserror] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])

    useEffect(() => {
        const email = ls.get('email');
        api.get(`/${email}`)
            .then(res => {
                setData(JSON.parse(res.data.body))
            })
            .catch(error => {
                console.log("Error")
            })
    }, [])

    const handleRowUpdate = (newData, oldData, resolve) => {
        //validation
        let errorList = []
        if (newData.rating > 10 || newData.rating < 1) {
            errorList.push("Please enter rating between 1-10")
        }
        if (newData.description === "") {
            errorList.push("Please enter review!")
        }

        if (errorList.length < 1) {
            api_2.put("/updateReview", newData)
                .then(res => {
                    console.log(res)
                    const dataUpdate = [...data];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setData([...dataUpdate]);
                    resolve()
                    setIserror(false)
                    setErrorMessages([])
                })
                .catch(error => {
                    setErrorMessages(["Update failed! Server error"])
                    setIserror(true)
                    resolve()

                })
        } else {
            setErrorMessages(errorList)
            setIserror(true)
            resolve()

        }
    }
    const handleRowDelete = (oldData, resolve) => {

        api_3.delete("/deleteReview", {
            headers: {
                'Content-Type': 'application/json'
            },
            data: oldData
        })
            .then(res => {
                console.log(res)
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setData([...dataDelete]);
                resolve()
            })
            .catch(error => {
                console.log(error)
                setErrorMessages(["Delete failed! Server error"])
                setIserror(true)
                resolve()
            })
    }


    return (
        <div className="userreviews-wrapper">
            <Grid container spacing={1}>
                <Grid item xs={1}></Grid>
                <Grid item xs={12}>
                    <div>
                        {iserror &&
                            <Alert severity="error">
                                {errorMessages.map((msg, i) => {
                                    return <div key={i}>{msg}</div>
                                })}
                            </Alert>
                        }
                    </div>
                    <MaterialTable
                        title='Your reviews'
                        columns={columns}
                        data={data}
                        icons={tableIcons}
                        localization={{ body: { editRow: { deleteText: 'Are you sure you want to delete your review?' } } }}
                        editable={{
                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve) => {
                                    console.log("NewData:")
                                    console.log(newData)
                                    handleRowUpdate(newData, oldData, resolve);

                                }),
                            onRowDelete: (oldData) =>
                                new Promise((resolve) => {
                                    console.log(oldData)
                                    handleRowDelete(oldData, resolve)
                                }),
                        }}
                        options={{
                            headerStyle: { backgroundColor: '#232B42', color: '#61DAFB' },
                            searchFieldStyle: { borderRadius: "2rem", backgroundColor: '#232B42', color: '#61DAFB' }
                        }}
                    />
                </Grid>
                <Grid item xs={3}></Grid>
            </Grid>
        </div>
    );
}

export default App;