import Sidebar from "./components/Sidebar"
import Player from "./components/Player"
import MainContent from "./components/MainContent"
import Auth from "./components/Auth"
// import Auth from "./components/Auth"

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4">
            <Auth />
          </div>
          <MainContent />
        </div>
      </div>
      <Player />
    </div>
  )
}