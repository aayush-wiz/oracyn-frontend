import Chat from "@/components/Chat";
import React from "react";

interface Props {
  params: { chatId: string };
}

const Page = async ({ params }: Props) => {
  const { chatId } = await params;
  return (
    <div>
      <Chat chatId={chatId} />
    </div>
  );
};

export default Page;
