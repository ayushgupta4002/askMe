'use client';
import { useSession } from "next-auth/react";

import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
} from '@livekit/components-react';
import { Room, Track } from 'livekit-client';
import '@livekit/components-styles';
import { useEffect, useState } from 'react';
import SimpleVoiceAssistant from "../dashboard/chat/components/AudioComponent";

export default function AudioMode() {
  // TODO: get user input for room and name
  const { data: session } = useSession();
  const room = `${session?.user?.userId}-quickstart-room`;
  const name = `${session?.user?.name}'}`;
  const [token, setToken] = useState('');
  const [roomInstance] = useState(() => new Room({
    // Enable automatic audio/video quality optimization
    dynacast: true,
  }));

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await fetch(`/api/token?room=${room}&username=${name}`);
        const data = await resp.json();
        if (!mounted) return;
        if (data.token) {
          setToken(data.token);

          const livekitUrl = 'wss://pj1-60upvbjy.livekit.cloud';
          await roomInstance.connect(livekitUrl, data.token);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  
    return () => {
      mounted = false;
      roomInstance.disconnect();
    };
  }, [roomInstance]);
  
  if (token === '') {
    return <div>Getting token...</div>;
  }

  return (
    <RoomContext.Provider value={roomInstance}>
      <div data-lk-theme="default" style={{ height: '100dvh' }}>
        {/* Your custom component with basic video conferencing functionality. */}
        {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
        
        <RoomAudioRenderer />
        <SimpleVoiceAssistant />
        {/* Controls for the user to start/stop audio, video, and screen share tracks */}
      </div>
    </RoomContext.Provider>
  );
}

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}