import { createContext, useState } from "react";

type Episode = {
    title: string,
    members: string,
    thumbnail: string,
    duration: number,
    url: string
}

type PlayerContextData = {
    episodeList: Episode[],
    currentEpisodeIndex: number,
    isPlaying: boolean, 
    isLooping: boolean,
    isShuffled: boolean,
    hasNext: boolean, 
    hasPrevious: boolean,
    play: (episode) => void,
    playList: (list, index) => void,
    playNext: () => void,
    playPrevious: () => void,
    togglePlay: () => void,
    toggleLoop: () => void,
    toggleShuffle: () => void,
    setPlayingState: (state: boolean) => void,
    clearPlayerState: () => void,
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({children}){
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffled, setIsShuffled] = useState(false);

    function play(episode: Episode){
        setIsPlaying(true);
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
    }

    function playList(list: Episode[], index: number){
        setIsPlaying(true);
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
    }

    function togglePlay(){
        setIsPlaying(!isPlaying);
    }

    function toggleLoop(){
        setIsLooping(!isLooping)
    }

    function toggleShuffle(){
        setIsShuffled(!isShuffled)
    }

    function setPlayingState(state:boolean){
        setIsPlaying(state)
    }

    function clearPlayerState(){
        setEpisodeList([]);
        setCurrentEpisodeIndex(0)
    }

    const hasNext = isShuffled || (currentEpisodeIndex + 1) < episodeList.length;
    const hasPrevious = currentEpisodeIndex > 0;

    function playNext(){
        if(isShuffled){
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        } else if(hasNext){
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }
    }

    function playPrevious(){
        if(hasPrevious){
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }

    return(
        <PlayerContext.Provider
        value={{
            episodeList,
            currentEpisodeIndex,
            isPlaying,
            isLooping,
            isShuffled,
            hasNext,
            hasPrevious,

            play,
            playList,
            playNext,
            playPrevious,
            togglePlay,
            toggleLoop,
            toggleShuffle,
            setPlayingState,
            clearPlayerState
        }}
        >
            {children}
        </PlayerContext.Provider>
    )
}