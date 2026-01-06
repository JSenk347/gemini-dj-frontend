export interface Track{
    title: string,
    artist?: string,
    uri: string,
    img_url: string
}

export interface PlaylistProp{
    playlist: Track[]
}