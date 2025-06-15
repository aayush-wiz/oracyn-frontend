import ChatInputArea from "./chatcomponents/ChatInputArea";
import ChatArea from "./chatcomponents/ChatArea";

const Chat = () => {
  return (
    <div className="bg-[#030508] h-screen flex flex-col">
      <div className="h-[90%] mx-[100px] mt-10 flex overflow-y-auto">
        <ChatArea />
      </div>
      <div className="h-[10%] mx-[90px] my-5">
        <ChatInputArea />
      </div>
    </div>
  );
};

export default Chat;
