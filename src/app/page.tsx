import Chat from "@/components/chat";
import JSONEditorComponent from "@/components/text-editor";

export default function Home() {
  return (
    <main className="flex flex-col gap-2 p-4">
      <div className="px-8">wsg</div>
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="w-full md:w-1/2 p-4">
          <div className="h-[calc(100vh-8rem)]">
            <JSONEditorComponent />
          </div>
        </div>
        <div className="w-full md:w-1/2 p-4">
          <Chat />
        </div>
      </div>
    </main>
  );
}
