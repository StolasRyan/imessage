import toast from "react-hot-toast"

const ChatPage = () => {
  return (
    <button
    onClick={() => toast.success("Hello")}
    >Click</button>
  )
}

export default ChatPage