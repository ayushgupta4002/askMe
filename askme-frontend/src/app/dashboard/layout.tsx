'use client';

import { Sidebar } from '@/components/Sidebar';
import { getUserByUserId } from '@/helpers/users';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUserStore, useConversationsStore } from '../atom';
import Loader from '../_components/Loader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const setUser = useUserStore(state => state.setUser);
  const setConversations = useConversationsStore(state => state.setConversations);
  const [loading, setLoading] = useState(true);

  const [statusCall, setStatusCall] = useState<"loading" | "loaded">("loading");

  const router = useRouter();

  // Redirect if user is unauthenticated
  useEffect(() => {
    console.log("status", status)
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchUserData() {
      if (session?.user?.userId) {
        const user = await getUserByUserId(session.user.userId);
        if (user) {
          setUser({
            id: user.id,
            email: user.email,
            name: user.name,
          });
          setConversations(user.conversations);
        }
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchUserData();
    }
    console.log("status", status);
  }, [status, session]);

  useEffect(() => {
    if (status === 'loading' || loading) {
      setStatusCall("loading");
    } else {
      setStatusCall("loaded");
    }
  }, [status, loading]);

  if (statusCall === 'loading' || loading) {
    return <Loader />;
  }

  return (
    <div className="flex h-screen rounded-lg">
      <Sidebar user={session?.user} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
