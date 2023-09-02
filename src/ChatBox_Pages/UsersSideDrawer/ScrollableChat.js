import React from 'react'
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameuser } from '../../config/ChatLogic';
import { ContextState } from '../../Context/ChatProvider';
import { Avatar, Tooltip } from '@chakra-ui/react';
const ScrollableChat = ({messages}) => {
  const {user}=ContextState();  
  return (
    <ScrollableFeed>
      {messages && messages.map((m,i)=> (
        <div style={{display:"flex"}} key={m._id}>
        {/* {m.sender.name} */}
          {(isSameSender(messages,m,i,user._id) || 
          isLastMessage(messages,i,user._id)) && (
            <Tooltip label={m.sender.name} placeholder='bottom-start' hasArrow>
             <Avatar
               mt="7px"
               mr={1}
               size="sm"
               cursor="pointer"
               name={m.sender.name}
               src={m.sender.pic} 
             />
            </Tooltip>
          )}

  <span style={{backgroundColor:`${m.sender._id===user._id ? "#BEE3F8" : "#B9F5D0"}`,
        borderRadius:"20px",
        padding:"5px 15px",
        maxWidth:"75%",
        marginLeft:isSameSenderMargin(messages,m,i,user._id),
        marginTop:isSameuser(messages,m,i,user._id) ? 3 : 5,
  }}>{m.content}</span>

        </div>
      ))}  
    </ScrollableFeed>
  )
}

export default ScrollableChat
