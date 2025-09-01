import {
  useVoiceAssistant,
  BarVisualizer,
  VoiceAssistantControlBar,
  DisconnectButton,
} from "@livekit/components-react";

const SimpleVoiceAssistant = ({ onLeave }: { onLeave: () => void }) => {
  const { state, audioTrack } = useVoiceAssistant();

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto p-5 h-full">
      <div className="w-full max-w-4xl h-80 mx-auto">
        <BarVisualizer state={state} barCount={7} trackRef={audioTrack} />
      </div>
      <div className="w-full max-w-4xl mt-5">
        <VoiceAssistantControlBar controls={{ leave: false }} />
        <DisconnectButton onClick={() => {
            console.log("Leave button clicked");
            onLeave();
        }}> Leave </DisconnectButton>
      </div>
    </div>
  );
};

export default SimpleVoiceAssistant;