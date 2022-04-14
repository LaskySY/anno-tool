import React from "react";
import ReactPlayer from 'react-player/youtube'
import { useHotkeys } from 'react-hotkeys-hook';

function YtVideo({ }, ref) {
  const backForward = 5
  const domRef = React.useRef();
  const [videoUrl, setVideoUrl] = React.useState("");
  const [status, setStatus] = React.useState({
    playing: false,
    played: 0,
    playedSeconds: 0,
    duration: 0
  })
  React.useImperativeHandle(ref, () => ({
    videoStatus: status,
    videoSeekTo: handleSeekTo,
  }));

  useHotkeys('ctrl+k',
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

  const handleVideoId = e => {
    e.preventDefault()
    setVideoUrl(e.target.videoURL.value)
  }
  /**
 * @param {String|Number} amount time
 * @param {Boolean} play play after seek
 * @param {String} type "second" | "fraction"
 * Note: Jumping to the end of less than a second will zero the video progress
 */
  const handleSeekTo = (amount, play, type='seconds') => {
    amount = parseFloat(amount)
    // Jumping to the end of less than a second will zero the video progress
    let nextSec = Math.max(0, Math.min(status.duration-1.8, amount)).toFixed(3)
    domRef.current.seekTo(amount, type)
    setStatus({ ...status, playing: play })
    return nextSec
  }
  const handleProgress = state => {
    setStatus({ ...status, played: state.played, playedSeconds: state.playedSeconds })
  }
  const handleDuration = duration => {
    setStatus({ ...status, duration: duration })
  }
  const handleSeekMouseDown = () => {
    setStatus({ ...status, playing: false})
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
      <form onSubmit={handleVideoId}>
        <input id="idinputbox" name="videoURL" />
        <input type="submit" value="Submit" />
      </form>
      <div className="player-wrapper">
        <ReactPlayer
          ref={domRef}
          url={videoUrl}
          loop={true}
          width='100%'
          height='100%'
          controls={false}
          playing={status.playing}
          progressInterval={10}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onError={e => console.log('onError', e)}
          config={{ youtube: { playerVars: { showinfo: 1 } } }}
        />
      </div>
      <input id="progressbar"
        type="range" max={1} step="any"
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
