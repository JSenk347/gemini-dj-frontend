import type { Track } from "../types"

interface PlaylistProp{
    playlist: Track[]
}

const Playlist = (prop: PlaylistProp) => {

    const savePlaylist = async () => {
        
    }

    return (
        <div className="flex flex-col justify-center items-center mb-10 mx-20 border-gray-200 bg-[#fffed] rounded-lg p-3 shadow-lg">
            <h1 className="my-7 font-semibold text-3xl">
                Generated Playlist
            </h1>

            <div role="playlist-container" className="grid grid-rows-10 grid-flow-col mb-10">
                {prop.playlist.map((track, index) => (
                    <div
                        key={track.uri || index}
                        className="flex items-center flex-wrap justify-center bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
                    >
                        {track.img_url && (
                            <img
                                src={track.img_url}
                                alt={track.title}
                                className="w-16 h-16 rounded object-cover mr-4"
                            />
                        )}
                        <div className="flex-1 text-center">
                            <p className="font-bold text-lg text-gray-800">
                                {track.title}
                            </p>
                            <p className="text-sm text-gray-500">
                                {track.artist}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <button role="save-playlist" className="rounded-lg border-gray-200 border-2 px-5 py-2 mb-7 cursor-pointer">
                Save to Spotify
            </button>

        </div>
    )
}

export default Playlist