import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

export interface Appointment {
  id: string;
  admin_id: string;
  user_id: string | null;
  start_time: string;
  end_time: string;
  status: "available" | "booked" | "cancelled";
  meeting_url?: string | null;
}

export function useAppointments() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState<Appointment[]>([]);
  const [mine, setMine] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const nowIso = new Date().toISOString();
      const { data: av, error: e1 } = await supabase
        .from("appointments")
        .select("*")
        .gte("start_time", nowIso)
        .in("status", ["available"])
        .order("start_time", { ascending: true });
      if (e1) throw e1;
      setAvailable(av as Appointment[]);

      if (user?.id) {
        const { data: my, error: e2 } = await supabase
          .from("appointments")
          .select("*")
          .or(`user_id.eq.${user.id},admin_id.eq.${user.id}`)
          .gte("start_time", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .order("start_time", { ascending: true });
        if (e2) throw e2;
        setMine(my as Appointment[]);
      } else {
        setMine([]);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const book = useCallback(async (appointmentId: string) => {
    if (!user?.id) return { error: "not_auth" };
    const { error } = await supabase
      .from("appointments")
      .update({ status: "booked" as const, user_id: user.id })
      .eq("id", appointmentId)
      .eq("status", "available");
    if (error) return { error: error.message };
    await load();
    return { error: null };
  }, [user?.id, load]);

  const cancel = useCallback(async (appointmentId: string) => {
    if (!user?.id) return { error: "not_auth" };
    const { error } = await supabase
      .from("appointments")
      .update({ status: "cancelled", user_id: null })
      .eq("id", appointmentId)
      .or(`user_id.eq.${user.id},admin_id.eq.${user.id}`);
    if (error) return { error: error.message };
    await load();
    return { error: null };
  }, [user?.id, load]);

  const createSlot = useCallback(async (start: Date, end: Date) => {
    if (!user?.id) return { error: "not_auth" };
    const { error } = await supabase.from("appointments").insert([
      { admin_id: user.id, start_time: start.toISOString(), end_time: end.toISOString(), status: "available" }
    ]);
    if (error) return { error: error.message };
    await load();
    return { error: null };
  }, [user?.id, load]);

  const approve = useCallback(async (appointmentId: string, meetingUrl: string) => {
    if (!user?.id) return { error: "not_auth" };
    const { error } = await supabase
      .from("appointments")
      .update({ meeting_url: meetingUrl })
      .eq("id", appointmentId);
    if (error) return { error: error.message };
    await load();
    return { error: null };
  }, [user?.id, load]);

  const propose = useCallback(async (start: Date, end: Date) => {
    if (!user?.id) return { error: "not_auth" };
    const { data: adminId, error: e1 } = await supabase.rpc('get_default_admin_id');
    if (e1) return { error: e1.message };
    if (!adminId) return { error: 'no_admin' };
    const { error } = await supabase.from('appointments').insert([
      { admin_id: adminId as string, user_id: user.id, start_time: start.toISOString(), end_time: end.toISOString(), status: 'booked' as const }
    ]);
    if (error) return { error: error.message };
    await load();
    return { error: null };
  }, [user?.id, load]);

  return { loading, error, available, mine, reload: load, book, cancel, createSlot, approve, propose };
}