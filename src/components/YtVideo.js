import React from "react";
import ReactPlayer from 'react-player/youtube'
import { useHotkeys } from 'react-hotkeys-hook';

function YtVideo({ width, videoUrl}, ref) {
  const backForward = 5
  const domRef = React.useRef();
  const [stopTime, setStopTime] = React.useState(Number.POSITIVE_INFINITY)
  const [status, setStatus] = React.useState({
    playing: false,
    played: 0,
    playedSeconds: 0,
    duration: 0
  })
  React.useImperativeHandle(ref, () => ({
    seconds: status.playedSeconds,
    setStopTime: t => setStopTime(t),
    videoSeekTo: handleSeekTo,
  }));

  useHotkeys('enter',
    e => { e.preventDefault(); setStatus({ ...status, playing: !status.playing }) },
    { enableOnTags: ['INPUT'] }
  );
  useHotkeys('ctrl+f',
    e => { e.preventDefault(); handleSeekTo(status.playedSeconds - backForward, true) },
    { enableOnTags: ['INPUT'] }
  );
  useHotkeys('ctrl+j',
    e => { e.preventDefault(); handleSeekTo(status.playedSeconds + backForward, true) },
    { enableOnTags: ['INPUT'] }
  );

  /**
 * @param {String|Number} amount time
 * @param {Boolean} play play after seek
 * @param {String} type "second" | "fraction"
 * Note: Jumping to the end of less than a second will zero the video progress
 */
  const handleSeekTo = (amount, play, type = 'seconds') => {
    amount = parseFloat(amount)
    // Jumping to the end of less than a second will zero the video progress
    let nextSec = Math.max(0, Math.min(status.duration - 1.8, amount)).toFixed(3)
    domRef.current.seekTo(amount, type)
    setStatus({ ...status, playing: play })
    return nextSec
  }
  const handlePlay = () => {
    document.getElementsByTagName('iframe')[0].blur()
    setStatus({ ...status, playing: true })
  }
  const handlePause = () => {
    document.getElementsByTagName('iframe')[0].blur()
    setStatus({ ...status, playing: false })
  }
  const handleProgress = state => {
    setStatus({ ...status, played: state.played, playedSeconds: state.playedSeconds })
    if (state.playedSeconds >= stopTime) {
      setStatus({ ...status, playing: false })
      setStopTime(Number.POSITIVE_INFINITY)
    }
  }
  const handleDuration = duration => {
    setStatus({ ...status, duration: duration })
  }
  const handleSeekMouseDown = () => {
    setStatus({ ...status, playing: false })
  }
  const handleSeekChange = e => {
    setStatus({
      ...status,
      played: parseFloat(e.target.value),
      playedSeconds: status.duration * parseFloat(e.target.value)
    })
  }
  const handleSeekMouseUp = e => {
    handleSeekTo(parseFloat(e.target.value), true, 'fraction')
  }
  return (
    <>
      <div className="player-wrapper" style={{ width: width, height: width * 0.5625 }}>
        <ReactPlayer
          ref={domRef}
          url={videoUrl}
          width='100%'
          height='100%'
          controls={false}
          onPlay={handlePlay}
          onPause={handlePause}
          playing={status.playing}
          progressInterval={10}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onError={e => console.log('onError', e)}
        />
      </div>
      <input type="range"
        max={1} step="any"
        style={{ width: width }}
        value={status.played}
        onMouseDown={handleSeekMouseDown}
        onChange={handleSeekChange}
        onMouseUp={handleSeekMouseUp}
      />
      <div>
        <span>{status.playedSeconds.toFixed(3)}</span>{' '}
      </div>
    </>
  );
}

export default React.forwardRef(YtVideo);
