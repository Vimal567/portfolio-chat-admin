import "./ChatRoom.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { GiDevilMask } from "react-icons/gi";
import { AiOutlineUser } from "react-icons/ai";
import CircularProgress from "@mui/material/CircularProgress";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const ChatRoom = ({name}) => {
    const [userData, setUserData] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const messagesEnd = useRef(null);

    const fetchData = async() => {
        try{
            setLoading(true);
            const fetched = await axios.get("https://chat-box.onrender.com/" + name);
            setUserData(fetched.data);
            setLoading(false);
        }catch(error){
            console.log(error);
        }
    }

    const handleNewMessage = (event) => {
        const message = event.target.value;
        setNewMessage(message);
    }

    const handleMessageSubmit = async(event) => {
        const message = event.target.value;
        if(!message)
            return;
        const newLine = userData.message.length + 1;
        const name = userData.name;
        const newMessageObj = {
            "text" : message,
            "person": "admin",
            "line": newLine
        };
        let newObj = {
            "name": name,
            "message": [newMessageObj]
        };
        try{
            await axios.patch("https://chat-box.onrender.com/", newObj);
        }catch(error){
            console.log(error);
        }
        const oldMessage = userData.message;
        newObj = {
            "name": name,
            "message": [...oldMessage, newMessageObj]
        };
        setUserData(newObj);
        setNewMessage("");
        fetchData();
    }

    const handleClearChat = async() => {
        try{
            await axios.delete("https://chat-box.onrender.com/" + name);
        }catch(error){
            console.log(error);
        }
    }

    const scrollToBottom = () => {
        messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [userData]);

    useEffect(() => {
        fetchData();
    }, []
    )

    return (
        <div id="chatbox">
            <div className="chat-header">
                <div className="header-align"><AccountCircleIcon />{name}</div>
                {<LogoutIcon className="logout" onClick={handleClearChat} />}
            </div>
            <div className="chat-body">
                {<div className="chat-started">
                        <span className="welcome-message">
                            Welcome Vimal 🙏, {name} is waiting ⏳ for your reply!!
                        </span>
                        {loading ? <div className="loading"><CircularProgress />Loading messages</div> : 
                        userData.message.map((item, index) => {
                            return <div key={index} className={item.person === "admin" ? "admin" : "user"}>
                                <span className="person">
                                    {item.person === "admin" ? <GiDevilMask /> : <AiOutlineUser />}
                                    {item.person === "admin" ? "admin:" : `${name}:`}
                                </span><br />
                                {item.text}
                                <div ref={messagesEnd} />
                            </div>
                        })
                        }
                    </div>
                }
            </div>
            {<div className="chat-input">
                    <input value={newMessage} className="input-para" placeholder="Type your message here..." onChange={handleNewMessage} />
                    <button title="send"  value={newMessage} className="input-send" onClick={handleMessageSubmit}>
                        {">"}
                    </button>
            </div>
            }
            <div className="chat-credit">chat box created by vimal</div>
        </div>
    )
}

export default ChatRoom;