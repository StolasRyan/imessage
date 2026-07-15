import  {useWallpaper}  from "../context/wallpaper.js";
import { useChatStore } from "../store/useChatStore.js";
import {useSelectedConversation} from "../hooks/useSelectedConversation.js";
import { useEffect } from "react";
import ChatSidebar from "../components/chat/ChatSidebar.jsx";
import {ChatHeader} from "../components/chat/ChatHeader.jsx";
import MessageList from "../components/chat/MessageList.jsx";
import {ChatComposer} from "../components/chat/ChatComposer.jsx";

const ChatPage = () => {
  const { frameStyle } = useWallpaper();
  const {
    getConversations,
    getMessages,
    getUsers,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const {
    activeConversation,
    activeConversationId,
    isLargeScreen,
  } = useSelectedConversation();

  useEffect(() => {
    getConversations();
    getUsers();
  }, [getConversations, getUsers]);


  useEffect(()=>{
    if(!activeConversationId) return;

    getMessages(activeConversationId);
    subscribeToMessages(activeConversationId);
    return()=>unsubscribeFromMessages();
  },[activeConversationId, getMessages, subscribeToMessages, unsubscribeFromMessages])

  return (
  <div className="flex h-dvh flex-col overflow-hidden p-2 sm:p-3 md:p-8" style={frameStyle}>
      <div className="mx-auto flex w-full max-w-6xl flex-1 overflow-hidden rounded-2xl border border-border bg-background text-foreground">
        <ChatSidebar/>
        <div className={`flex-1 flex-col overflow-hidden ${
        !isLargeScreen && !activeConversationId ? "hidden lg:flex" : "flex"
        }`}>
          <ChatHeader/>
          <MessageList/>
          {activeConversation && (<ChatComposer/>)}
        </div>
      </div>
  </div>
);
};

export default ChatPage;
