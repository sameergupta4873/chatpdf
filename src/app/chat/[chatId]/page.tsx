import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizeable";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    return redirect("/");
  }
  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));
  const isPro = await checkSubscription();

  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen">
        <ResizablePanelGroup
          direction="horizontal"
          className=""
        >
          <ResizablePanel defaultSize={25} maxSize={30} minSize={20}>
            {/* chat sidebar */}
            <div className="flex-[1]">
              <ChatSideBar
                chats={_chats}
                chatId={parseInt(chatId)}
                isPro={isPro}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle className="hover:bg-blue-500 active:bg-blue-500 w-1" />
          <ResizablePanel className="h-[95vh]">
            {/* pdf viewer */}
            {/* <div className="min-h-screen p-4 flex-[5]"> */}
              <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
            {/* </div> */}
          </ResizablePanel>
          <ResizableHandle withHandle className="hover:bg-blue-500 active:bg-blue-500 w-1" />
          <ResizablePanel defaultSize={35} maxSize={40} minSize={30}>
            {/* chat component */}
            <div className="flex-[3] border-l-4 border-l-slate-200">
              <ChatComponent chatId={parseInt(chatId)} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ChatPage;
