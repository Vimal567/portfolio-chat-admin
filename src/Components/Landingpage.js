import { useState, useEffect } from "react";
import "./Landingpage.css";
import axios from "axios";
import RefreshIcon from '@mui/icons-material/Refresh';
import CircularProgress from "@mui/material/CircularProgress";
import ChatRoom from "./ChatRoom";

const Landingpage = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async() => {
        try{
            setLoading(true);
            const fetched = await axios.get("https://chat-box.onrender.com/");
            setData(fetched.data);
            setLoading(false);
        }catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []
    )

    return(
        <div>
            <h2 className="chat-room-header">ADMIN CHAT CONTROL ROOM</h2>
            <span title="refresh">
                <RefreshIcon className="whole-refresh" onClick={fetchData} />
            </span>
            {loading ? <div className="main-loading">
                <CircularProgress />Loading please wait vimal💡</div>
                : data.map((item, index) => {
                return <div className="rooms" key={index}><ChatRoom name ={item.name} /></div>
            })}
        </div>
    )
}

export default Landingpage;