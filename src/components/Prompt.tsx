
const Prompt = () => {

    return (
        <div className="flex justify-between gap-7 flex-col items-center border-3 mx-20 py-8">
            <h1 className="p-0">
                Prompt
            </h1>
            <textarea className="w-[70%] min-h-50  px-4 border-3" placeholder="Describe the playlist you want to hear right now..."/>
            <button className="border-3 p-2 min-w-[50%] flex justify-center gap-5 vertical-align">
                
                 Curate Playlist
            </button>
        </div>
    );
}

export default Prompt