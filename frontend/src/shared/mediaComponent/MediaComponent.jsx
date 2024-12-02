import React, { useRef } from 'react'
import { useWavesurfer } from "@wavesurfer/react";
import { MdOutlinePlayCircleFilled, MdOutlinePauseCircleFilled } from "react-icons/md";
import styles from './styles.module.css'

const MediaComponent = ({audioUrl}) => {

  const containerRef = useRef(null)

  const formatTime = (seconds) => [seconds / 60, seconds / 60, seconds % 60].map((v) => `0${Math.floor(v)}`.slice(-2)).join(':')

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    width:250,
    height: 20,
    waveColor: '#334949',
    progressColor: '#168c16',
    url: audioUrl,
    dragToSeek: true,
    barHeight:2,
    barWidth:2
  })  

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause()
  }

  const audioDuration = wavesurfer && wavesurfer.getDuration()

  return (
    <>
    <div className={styles.audio_wrapper}>
      <button onClick={onPlayPause} className={styles.play_pause}>
        {isPlaying ? <MdOutlinePauseCircleFilled size={50} color='green'/> : <MdOutlinePlayCircleFilled size={50} color='green'/>}
      </button>
      <div className={styles.media_describer}>
        <div ref={containerRef} />
        <div className={styles.media_time}>{formatTime(currentTime)}/{formatTime(audioDuration)}</div>
      </div>
    </div>
    
    </>
  )
}

export default MediaComponent 