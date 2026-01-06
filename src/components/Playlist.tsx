import type { Track } from "../types"

interface PlaylistProp{
    playlist: Track[]
}

const Playlist = (prop: PlaylistProp) => {

    return (


        <div className="flex flex-col justify-center items-center border-3">
            <h1 className="">
                Generated Playlist
            </h1>

            <div role="playlist-container" className="flex flex-col gap-3">
                {prop.playlist.map((track, index) => (
                    <div
                        key={track.uri || index}
                        className="flex items-center bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
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
        </div>
    )
}

export default Playlist