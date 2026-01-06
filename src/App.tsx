import Prompt from "./components/Prompt"
import Playlist from "./components/Playlist"
import LoadingAnimation from "./components/LoadingAnimation"
import type { Track } from "./types"
import { useState, useEffect } from 'react'

function App() {
  const [playlistData, setPlaylistData] = useState<Track[]>([])
  const [isGenerating, setIsGenerating] = useState(false);

  // only get sessionID if none exists already
  useEffect(() => {
    if (!sessionStorage.getItem("userID")) {
      sessionStorage.setItem("sessionID", window.crypto.randomUUID());
    }
  }, [])


  return (
    <>
      <header className='max-w-4xl mx-auto px-6>'>
        <h1 className="text-6xl text-slate-700 text-center py-10">
          Gemini DJ
        </h1>
      </header>
      <Prompt
        setPlaylist={setPlaylistData}
        setIsGenerating={setIsGenerating}
      />
      {/*If playlist is generating, show loading animation, else if playlist length > 0, show playlist, else, show nothing*/}
      {isGenerating ? 
        (<LoadingAnimation/>)
        : playlistData.length > 0 ?
        (<Playlist playlist={playlistData}/>)
        : (null) 
      }
    </>
  )
}

export default App
