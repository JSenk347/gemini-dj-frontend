import Prompt from "./components/Prompt"
import Playlist from "./components/Playlist"
import LoadingAnimation from "./components/LoadingAnimation"
import type { Track } from "./types"
import { useState, useEffect } from 'react'

function App() {
  const [playlistData, setPlaylistData] = useState<Track[]>([])
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // use to change "Spotify Login" -> "<username>" and placeholder photo to user photo

  // only get sessionID if none exists already
  useEffect(() => {
    if (!sessionStorage.getItem("userID")) {
      sessionStorage.setItem("sessionID", window.crypto.randomUUID());
    }
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get("code"); // code sent back from login url which will be exchanged for a token

    if (code) exchangeCodeForToken(code);

    if (code && sessionStorage.getItem("spotify_access_token")){
      exchangeCodeForToken(code) // get new token is code and auth token in url
    } else if (sessionStorage.getItem("spotify_access_token")){
      setIsLoggedIn(true)
    }

  }, [])

  const exchangeCodeForToken = async (code: string) => {
    try{
      const response = await fetch("https://huggingface.co/spaces/JSenkCC/gemini-dj-backend/token", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({
          code: code // the code spotify just sent us
        })
      });

      if (!response.ok){
        throw new Error(`Token exchange failed: ${response.status}`);
      }

      const data = await response.json()
      
      if (data.access_token){
        sessionStorage.setItem("spotify_access_token", data.access_token);
        setIsLoggedIn(true);
        console.log("User successfully logged in.")

        window.history.replaceState({}, "/") // cleans up url
      }
    } catch (error) {
      console.error("Failed to exchange token", error);
      alert("Failed to login. Please try again.")
    }
  }

  const handleLogin = async () => {
    try {
      // ask backend for spotify login url
      const response = await fetch("https://huggingface.co/spaces/JSenkCC/gemini-dj-backend/auth_url", {
        method: "POST", // or GET
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          redirect_uri: "http://localhost:5173/callback"
        })
      });

      const data = await response.json();

      //redirect user to login url
      window.location.href = data.url;

    } catch (error) {
      console.error("Login Error:", error);
    }
  }

  return (
    <>
      <header className='w-full relative flex items-center justify-center py-10 px-6'>
        <h1 className="text-6xl text-slate-700 font-bold text-center">
          Gemini DJ
        </h1>
        <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 mt-2">
          <img src="/spotify-logo.png" className="w-10"/>
          <a className="cursor-pointer">
            Log In {/*must update dynamically*/}
          </a>
        </div>
      </header>
      <Prompt
        setPlaylist={setPlaylistData}
        setIsGenerating={setIsGenerating}
      />
      {/*If playlist is generating, show loading animation, else if playlist length > 0, show playlist, else, show nothing*/}
      {isGenerating ?
        (<LoadingAnimation />)
        : playlistData.length > 0 ?
          (<Playlist playlist={playlistData} />)
          : (null)
      }
    </>
  )
}

export default App
