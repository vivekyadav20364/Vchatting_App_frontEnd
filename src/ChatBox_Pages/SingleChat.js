import React, { useEffect, useState } from "react";
import { ContextState } from "../Context/ChatProvider";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogic";
import ProfileModal from "./ProfileModal";
import UpdateGroupChat from "../Group_chatpage/UpdateGroupChat";
import axios from "axios";
import { BaseUrl } from "../config/Baseurl";
import "../style.css";
import ScrollableChat from "./UsersSideDrawer/ScrollableChat";

//socket code start
import io from 'socket.io-client';
const ENDPOINT="https://vchatting-app.onrender.com";
var socket,selectedChatCompare;
//socket code end



const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ContextState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState();
  const [newmessages, setNewMessages] = useState();
  const [socketConnected,setSocketConnected]=useState(false);
  const toast = useToast();

  useEffect(()=>{
    socket=io(ENDPOINT);
    socket.emit("setup",user);
    socket.on("connected" ,()=>setSocketConnected(true));
  },[]);

  useEffect(()=>{
    fetchMessages();
    selectedChatCompare=selectedChat;
   },[selectedChat]);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);

      const { data } = await axios.get(
        `${BaseUrl}messages/${selectedChat._id}`,
        config
      );
      setMessages(data);
      //console.log("Fetched chat:",messages);


      //which chat us selected it create a room with selected chat id
      socket.emit("join chat",selectedChat._id);

      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newmessages) {
      try {
        //console.log(newmessages);
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessages("");
        const { data } = await axios.post(
          `${BaseUrl}messages`,
          { chatId: selectedChat, content: newmessages },
          config
        );
       // console.log(data);
       socket.emit("new message",data);
        console.log("Message 1:",messages);
        setMessages([...messages, data]);
      } catch (error) {
        // toast({
        //   title: "Error Occuredd!",
        //   status: "error",
        //   duration: 4000,
        //   isClosable: true,
        //   position: "top-right",
        // });
        console.log(error);
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessages(e);
    //typing logic here
  };

//recieving the message
useEffect(()=>{
  socket.on("message recieved" ,(newmessagesRecieved)=>{
    console.log("Recieved message: ",newmessagesRecieved)
    console.log("Message is ",messages);
    if(!selectedChatCompare || selectedChatCompare._id!==newmessagesRecieved.chat._id){
      //give notification
    }
    else{
      setMessages([...messages,newmessagesRecieved]);
    }
  })
})

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontFamily="Work sans"
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChat
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            width="100%"
            height="100%"
            borderRadius="lg"
            overflow="hidden"
          >
            {/* messages here */}
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
             <div className="messages">
               <ScrollableChat messages={messages}/>
              </div>
            )}
            <FormControl isRequired mt={3}>
              {/* onKeyDown is used when we click enter this run */}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message"
                onKeyDown={sendMessage}
                onChange={(e) => typingHandler(e.target.value)}
                value={newmessages}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a User to start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};
export default SingleChat;
