import Prompt from "./components/Prompt"
import Playlist from "./components/Playlist"
import type {Track} from "./types"
import {useState} from 'react'

function App() {
  const [playlistData, setPlaylistData] = useState<Track[]>([])

  const sessionID = crypto.randomUUID();
  sessionStorage.setItem("sessionID", sessionID);

  return (
    <>
      <header className='max-w-4xl mx-auto px-6>'>
        <h1 className="text-6xl text-slate-700 text-center py-10">
          Gemini DJ
        </h1>
      </header>
      <Prompt setPlaylist={setPlaylistData}/>
      <Playlist playlist={playlistData}/>
    </>
  )
}

export default App
