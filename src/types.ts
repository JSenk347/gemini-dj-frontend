export interface Track{
    title: string,
    artist?: string,
    uri: string,
    img_url: string
}

export interface PlaylistProp{
    playlist: Track[]
}

export interface User{
    display_name?: string,
    display_img?: string,
    profile_uri?: string
}