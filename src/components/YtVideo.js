import React from "react";
import ReactPlayer from 'react-player/youtube'
import { useHotkeys } from 'react-hotkeys-hook';

function YtVideo(props, ref) {
  const domRef = React.useRef();
  const [videoUrl, setVideoUrl] = React.useState("");
  const [status, setStatus] = React.useState({
    isPlaying: false,
    played: 0,
    seeking: false,
    playedSeconds: 0,
    duration: 0
  })
  useHotkeys(
    'alt+q',
    () => setStatus({ ...status, isPlaying: !status.isPlaying }),
    { filterPreventDefault: true, enableOnTags: ['INPUT'] }
  );

  React.useImperativeHandle(ref, () => ({
    seconds: status.playedSeconds,
  }));

  const handleVideoId = () => {
    let url = document.getElementById("idinputbox").value
    console.log("Can play? : ", ReactPlayer.canPlay(url), " ", url)
    if (ReactPlayer.canPlay(url)) {
      setVideoUrl(url)
    }
  }
  const handleProgress = state => {
    setStatus({ ...status, played: state.played, playedSeconds: state.playedSeconds })
  }
  const handleDuration = duration => {
    setStatus({ ...status, duration: duration })
  }
  const handleSeekMouseDown = () => {
    setStatus({ ...status, isPlaying: false })
    setStatus({ ...status, seeking: true })
  }
  const handleSeekChange = e => {
    setStatus({
      ...status,
      isPlaying: false,
      played: parseFloat(e.target.value),
      playedSeconds: status.duration * parseFloat(e.target.value)
    })
  }
  const handleSeekMouseUp = e => {
    setStatus({ ...status, isPlaying: true, seeking: false })
    domRef.current.seekTo(parseFloat(e.target.value))
  }

  return (
    <>
      <input id="idinputbox" defaultValue={videoUrl} />
      <button id="urlConfirmBtn" onClick={handleVideoId}>Confirm</button>
      <div className="player-wrapper">
        <ReactPlayer
          ref={domRef}
          url={videoUrl}
          loop={true}
          width='100%'
          height='100%'
          controls={false}
          playing={status.isPlaying}
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
