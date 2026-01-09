import {useState} from 'react'
import type { Track } from "../types";

interface PromptProps{
    setPlaylist: (playlist: Track[]) => void // a function that accepts a playlist. a list comprised of tracks
    setIsGenerating: (isGenerating: boolean) => void // a function that accepts a isLoading bool, and changes the value
}

const Prompt = ({setPlaylist, setIsGenerating}: PromptProps) => {
    const [prompt, setPrompt] = useState("");
    const [localIsGenerating, setLocalIsGenerating] = useState(false)

    // makes API request to backend/chat endpoint
    const handleSubmit = async () => {
        if (!prompt || localIsGenerating) return;
        setLocalIsGenerating(true);
        setIsGenerating(true);

        const sessionID = sessionStorage.getItem("sessionID");
        console.log(`Session id: ${sessionID}`);
        
        // insert loading component
        try{
            const response = await fetch('https://jsenkcc-gemini-dj-backend.hf.space/chat', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json" 
                },
                body : JSON.stringify({
                    message: prompt,
                    session_id: sessionID
                })
            });

            if (!response.ok){
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            console.log("Data Received: ", data)
            
            if (data.playlist){
                const formattedPlaylist = data.playlist.map((item: any[]) => ({
                    title: item[0],
                    artist: item[1],
                    uri: item[2],
                    img_url: item[3]
                }))
                setPlaylist(formattedPlaylist);
            }

        } catch (error) {
            console.error("Failed to generate a playlist: ", error);
            alert("Something went wrong generating the playlist.");
        } finally {
            setLocalIsGenerating(false);
            setIsGenerating(false);
        }

    }

    return (
        <div className="flex justify-between gap-7 flex-col items-center border-gray-200 bg-[#fffed] rounded-lg p-3 shadow-lg mx-20 py-8 mb-10">
            <h1 className="font-semibold text-3xl">
                Prompt
            </h1>
            <textarea 
                className="w-[70%] min-h-50 py-4 px-4 border-gray-500 border-2 rounded-lg resize-none" 
                placeholder="Describe the playlist you want to hear right now..."
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
            <button className="border-gray-500 border-2 rounded-lg p-2 min-w-[50%] flex justify-center gap-5 vertical-align cursor-pointer" onClick={handleSubmit}>
                Generate Playlist
            </button>
        </div>
    );
}

export default Prompt