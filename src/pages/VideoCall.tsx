import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Video, Mic, MicOff, VideoOff, PhoneOff } from "lucide-react";

interface AppointmentRow {
  id: string;
  meeting_url: string | null;
  start_time: string;
  end_time: string;
}

const VideoCall = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState<AppointmentRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!appointmentId) return;
        const { data, error } = await supabase
          .from("appointments")
          .select("id, meeting_url, start_time, end_time")
          .eq("id", appointmentId)
          .single();
        if (error) throw error;
        setAppointment(data as AppointmentRow);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [appointmentId]);

  useEffect(() => {
    const setupMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.error("Media error", err);
      }
    };
    setupMedia();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const toggleCamera = () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setCameraOn(track.enabled);
  };

  const toggleMic = () => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setMicOn(track.enabled);
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Video className="h-6 w-6 text-spotify-green" />
          Videoaula
        </h1>

        {error && (
          <Card className="p-4">
            <div className="text-sm text-destructive">{error}</div>
          </Card>
        )}

        <Card className="p-2">
          <div className="aspect-video bg-black rounded-md overflow-hidden flex items-center justify-center">
            <video ref={videoRef} className="w-full h-full object-cover" muted />
          </div>
          <div className="flex gap-2 p-3 justify-center">
            <Button variant={micOn ? "secondary" : "default"} onClick={toggleMic}>
              {micOn ? <Mic className="h-4 w-4 mr-2" /> : <MicOff className="h-4 w-4 mr-2" />} {micOn ? "Mutar" : "Ativar mic"}
            </Button>
            <Button variant={cameraOn ? "secondary" : "default"} onClick={toggleCamera}>
              {cameraOn ? <Video className="h-4 w-4 mr-2" /> : <VideoOff className="h-4 w-4 mr-2" />} {cameraOn ? "Desligar câmera" : "Ligar câmera"}
            </Button>
            <Button variant="destructive" onClick={() => navigate(-1)}>
              <PhoneOff className="h-4 w-4 mr-2" /> Sair
            </Button>
          </div>
        </Card>

        {appointment?.meeting_url && (
          <div className="text-xs text-muted-foreground text-center">
            Link externo da reunião: <a className="underline text-spotify-green" href={appointment.meeting_url} target="_blank" rel="noreferrer">abrir</a>
          </div>
        )}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default VideoCall;

