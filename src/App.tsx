import Prompt from "./components/Prompt"
import Playlist from "./components/Playlist"
import LoadingAnimation from "./components/LoadingAnimation"
import type { Track, User } from "./types"
import { useState, useEffect, useRef } from 'react'

function App() {
  const [playlistData, setPlaylistData] = useState<Track[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // use to change "Spotify Login" -> "<username>" and placeholder photo to user photo
  const [user, setUser] = useState<User>();
  const hasFetchedToken = useRef(false); // tracks if we've already fired off token request

  // only get sessionID if none exists already
  useEffect(() => {
    if (!sessionStorage.getItem("userID")) {
      sessionStorage.setItem("sessionID", window.crypto.randomUUID());
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn){
      const queryParams = new URLSearchParams(window.location.search);
      const code = queryParams.get("code"); // code sent back from login url which will be exchanged for a token

      if (code && !hasFetchedToken.current) {
        hasFetchedToken.current = true;
        exchangeCodeForToken(code);
        getUserData()
      } else if ((code && sessionStorage.getItem("spotify_access_token")) && !hasFetchedToken.current){
        hasFetchedToken.current = true;
        exchangeCodeForToken(code) // get new token is code and auth token in url
        getUserData()
      } else if (sessionStorage.getItem("spotify_access_token")){
        setIsLoggedIn(true)
      }
    }
  }, [])

  const exchangeCodeForToken = async (code: string) => {
    try{
      const response = await fetch("https://jsenkcc-gemini-dj-backend.hf.space/token", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({
          code: code, // the code spotify just sent us
          redirect_uri: "http://127.0.0.1:5173"  
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
      }
    } catch (error) {
      console.error("Failed to exchange token", error);
      alert("Failed to login. Please try again.")
    } finally {
      window.history.replaceState({}, document.title, "/"); // cleans up url
    }
  }

  const getUserData = async () => {
    try{
      const response = await fetch("https://jsenkcc-gemini-dj-backend.hf.space/user_data",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          "auth_token": sessionStorage.getItem("spotify_access_token")
        })
      });

      const data = await response.json();
      sessionStorage.setItem("user_spotify_id", data.id);

      setUser({
        display_img: data.display_img,
        display_name: data.display_name,
        profile_uri: data.uri
      })

    } catch (Error) {
      console.error("Failed to get user data.");
      alert("Failed to get user data")
    }
  }

  const handleLogin = async () => {
    try {
      // ask backend for spotify login url
      const response = await fetch("https://jsenkcc-gemini-dj-backend.hf.space/auth_url", {
        method: "POST", // or GET
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          redirect_uri: "http://127.0.0.1:5173"
        })
      });
      console.log("Login URL request made.");
      const data = await response.json();

      //redirect user to login url
      window.location.href = data.auth_url;

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
          <img src={isLoggedIn && user?.display_img != undefined ? user?.display_img : "/spotify-logo.png"} className="w-15 rounded-full"/>
          <a className={` ${isLoggedIn? "cursor-pointer": "pointer-events-none"}`} onClick={handleLogin}>
            {isLoggedIn && user?.display_name != undefined?
              user?.display_name:
              "Log In"
            }
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
