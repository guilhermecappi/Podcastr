import styles from './styles.module.scss';

import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player(){
    const audioRef = useRef<HTMLAudioElement>(null);

    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        isLooping,
        isShuffled,
        hasNext,
        hasPrevious,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        playNext,
        playPrevious,
        clearPlayerState
    } = useContext(PlayerContext)

    const episode = episodeList[currentEpisodeIndex]

    const [progress, setProgress] = useState(0);

    function setupProgressListener(){
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    function handleSeek(amount: number){
        audioRef.current.currentTime = amount;
        setProgress(amount)
    }

    function handleOnEndedEpisode(){
        if(hasNext){
            playNext()
        } else {
            clearPlayerState()
        }
    }

    useEffect(() => {
        if(!audioRef.current){
            return;
        }

        if(isPlaying){
            audioRef.current.play()
        } else if (!isPlaying){
            audioRef.current.pause()
        }
    }, [isPlaying])

    return(
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando Agora"/>
                <strong>Tocando agora</strong>
            </header>

            { episode ? (
                    <div className={styles.currentEpisode}>
                        <Image
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                        />
                        <strong>{episode.title}</strong>
                        <span>{episode.members}</span>
                    </div>
                ) : (
                    <div className={styles.emptyPlayer}>
                        <strong>Selecione um podcast para ouvir</strong>
                    </div>
                )}

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                            max={episode.duration}
                            value={progress}
                            onChange={handleSeek}
                            trackStyle={{backgroundColor: '#04d361'}}
                            railStyle={{backgroundColor: '#9f75ff'}}
                            handleStyle={{borderColor: '#04d361', borderWidth: 4}}
                            />
                        ): (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>
                
                { episode && (
                        <audio 
                        src={episode.url}
                        autoPlay
                        ref={audioRef}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onEnded={handleOnEndedEpisode}
                        loop={isLooping}
                        onLoadedMetadata={setupProgressListener}
                        >
                        </audio>
                    )}

                <div className={styles.buttons}>
                    <button className={ isShuffled ? styles.isActive : ''} type="button" disabled={!episode || episodeList.length === 1} onClick={toggleShuffle}>
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
                        <img src="/play-previous.svg" alt="Anterior"/>
                    </button>
                    <button className={styles.playButton} type="button" disabled={!episode} onClick={togglePlay}>
                        {isPlaying ? <img src="/pause.svg" alt="Pausar"/> : <img src="/play.svg" alt="Tocar"/>}
                    </button>
                    <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
                        <img src="/play-next.svg" alt="Próxima"/>
                    </button>
                    <button className={ isLooping ? styles.isActive : ''} type="button" disabled={!episode} onClick={toggleLoop}>
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    )
}