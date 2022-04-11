import React from "react";
import ReactPlayer from 'react-player/youtube'
import { useHotkeys } from 'react-hotkeys-hook';

function YtVideo({ }, ref) {
  const domRef = React.useRef();
  const [videoUrl, setVideoUrl] = React.useState("");
  const [status, setStatus] = React.useState({
    playing: false,
    seeking: false,
    played: 0,
    playedSeconds: 0,
    duration: 0
  })
  React.useImperativeHandle(ref, () => ({
    seconds: status.playedSeconds,
    seekTobySeconds: handleSeekToFromTable,
  }));

  useHotkeys('ctrl+k',
    e => { e.preventDefault(); setStatus({ ...status, playing: !status.playing }) },
    { enableOnTags: ['INPUT'] }
  );
  useHotkeys('ctrl+f',
    e => {
      e.preventDefault()
      setStatus({ ...status, playing: true })
      domRef.current.seekTo((status.playedSeconds - 10) / status.duration)
    },
    { enableOnTags: ['INPUT'] }
  );
  useHotkeys('ctrl+j',
    e => {
      e.preventDefault()
      setStatus({ ...status, playing: true })
      domRef.current.seekTo((status.playedSeconds + 10) / status.duration)
    },
    { enableOnTags: ['INPUT'] }
  );

  const handleVideoId = e => {
    e.preventDefault()
    setVideoUrl(e.target.videoURL.value)
  }
  const handleSeekToFromTable = second => {
    domRef.current.seekTo(second / status.duration)
    setStatus({ ...status, playing: true })
  }
  const handleProgress = state => {
    setStatus({ ...status, played: state.played, playedSeconds: state.playedSeconds })
  }
  const handleDuration = duration => {
    setStatus({ ...status, duration: duration })
  }
  const handleSeekMouseDown = () => {
    setStatus({ ...status, playing: false, seeking: true })
  }
  const handleSeekChange = e => {
    setStatus({
      ...status,
      played: parseFloat(e.target.value),
      playedSeconds: status.duration * parseFloat(e.target.value)
    })
  }
  const handleSeekMouseUp = e => {
    setStatus({ ...status, playing: true, seeking: false })
    domRef.current.seekTo(parseFloat(e.target.value))
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
