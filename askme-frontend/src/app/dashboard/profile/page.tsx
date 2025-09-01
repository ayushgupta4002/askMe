'use client';

// import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useUserStore } from '@/app/atom';
import { deleteUserbyId, updateUser } from '@/helpers/users';
import { generateAPIToken } from '@/helpers/generateAPItoken';
// import { Eye, EyeOff, Copy, RefreshCcw } from 'lucide-react';

// export default function ProfilePage() {
//   const { data: session } = useSession();
//   const user = useRecoilValue(userAtom);
//   const [apiKey, setApiKey] = useState(user?.apiKey || '');
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isCopied, setIsCopied] = useState(false);
//   const [showKey, setShowKey] = useState(false);

//   const handleLogout = () => {
//     signOut();
//   };

//   const handleDeleteAccount = async () => {
//     if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
//       // Call your delete account API here
//       console.log('Delete account functionality to be implemented');
//       await deleteUserbyId(user.id);
//       signOut();
//     }
//   };

//   const handleGenerateNewKey = async () => {
//     setIsGenerating(true);
//     const newKey = generateAPIToken();
//     setApiKey(newKey);
//     // Update the user's API key in the database
//     if (user) {
//       await updateUser({
//         ...user,
//         apiKey: newKey,
//         isGuest: user.isGuest || false,
//         credits: user.credits || 0,
//         onboardingCompleted: false,
//         createdAt: new Date(),
//         avatar: user.avatar || null,
//       });
//     }
//     setIsGenerating(false);
//   };

//   const handleCopyKey = () => {
//     navigator.clipboard.writeText(apiKey);
//     setIsCopied(true);
//     setTimeout(() => setIsCopied(false), 2000);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-[#18181B] text-balck px-4">
//       <div className="flex flex-col md:flex-row items-center bg-[#23232A] rounded-2xl shadow-lg p-8 gap-8 w-full max-w-2xl mt-12">
//         {/* Avatar */}
//         <div className="flex-shrink-0">
//           <img
//             src={user?.avatar || '/avatar-placeholder.png'}
//             alt="User Avatar"
//             className="w-32 h-32 rounded-full border-4 border-[#2D2D2D] object-cover bg-[#18181B]"
//           />
//         </div>
//         {/* Info and API Key */}
//         <div className="flex-1 w-full">
//           <div className="mb-2">
//             <h1 className="text-3xl font-bold mb-1">{user?.name || 'N/A'}</h1>
//             <p className="text-gray-400 text-lg">{user?.email || 'N/A'}</p>
//           </div>
//           <div className="mt-6 mb-4">
//             <div className="flex items-center gap-2 mb-2">
//               <span className="text-gray-400">
//                 <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 17v.01M12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 8C6.477 21 2 16.523 2 11.5S6.477 2 12 2s10 4.477 10 9.5S17.523 21 12 21Z"/></svg>
//               </span>
//               <div className="relative flex-1 flex items-center bg-[#18181B] rounded-lg border border-[#333] px-4 py-2">
//                 <input
//                   type={showKey ? 'text' : 'password'}
//                   value={apiKey}
//                   readOnly
//                   className="flex-1 bg-transparent text-gray-200 tracking-widest outline-none border-none pr-10"
//                   style={{ letterSpacing: '0.2em' }}
//                 />
//                 <button
//                   onClick={() => setShowKey((v) => !v)}
//                   className="absolute right-10 text-gray-400 hover:text-white"
//                   title={showKey ? 'Hide API Key' : 'Show API Key'}
//                 >
//                   {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//                 <button
//                   onClick={handleCopyKey}
//                   className="absolute right-2 text-gray-400 hover:text-white"
//                   title="Copy API Key"
//                 >
//                   <Copy size={20} />
//                 </button>
//               </div>
//             </div>
//             <div className="flex items-center gap-4 mt-4">
//               <button
//                 onClick={handleGenerateNewKey}
//                 disabled={isGenerating}
//                 className="flex items-center gap-2 bg-[#23232A] border border-[#333] px-5 py-2 rounded-lg text-white font-medium hover:bg-[#292933] transition-colors disabled:opacity-50"
//               >
//                 <RefreshCcw size={18} />
//                 {isGenerating ? 'Generating...' : 'Generate New API Key'}
//               </button>
//               <a
//                 href="#"
//                 className="text-sm text-blue-400 underline hover:text-blue-300"
//               >
//                 How to use this key?
//               </a>
//               {isCopied && (
//                 <span className="text-green-400 text-sm ml-2">Copied!</span>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Optional: Logout and Delete Account buttons at the bottom */}
//       <div className="flex gap-4 mt-8">
//         <button
//           onClick={handleLogout}
//           className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
//         >
//           Logout
//         </button>
//         <button
//           onClick={handleDeleteAccount}
//           className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
//         >
//           Delete Account
//         </button>
//       </div>
//     </div>
//   );
// }




import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, LogOut } from "lucide-react";
import Link from 'next/link';

export default function AccountPage() {
  const user = useUserStore(state => state.user);
  const [apiKey, setApiKey] = useState(user?.apiKey || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleLogout = () => {
    signOut();
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Call your delete account API here
      console.log('Delete account functionality to be implemented');
      await deleteUserbyId(user.id);
      signOut();
    }
  };

  const handleGenerateNewKey = async () => {
    setIsGenerating(true);
    const newKey = generateAPIToken();
    setApiKey(newKey);
    // Update the user's API key in the database
    if (user) {
      await updateUser({
        ...user,
        apiKey: newKey,
        isGuest: user.isGuest || false,
        credits: user.credits || 0,
        onboardingCompleted: false,
        createdAt: new Date(),
        avatar: user.avatar || null,
      });
    }
    setIsGenerating(false);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };


  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>
        
        <Separator className="mb-8" />
        
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <div className="relative">
            <Avatar className="h-24 w-24 border-2 border-border">
              <AvatarImage src={user?.avatar || '/avatar-placeholder.png'} alt={user?.name || 'User'} />
              <AvatarFallback className="text-2xl">
                {user?.name ? user.name.charAt(0) : '?'}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1">
            <div className="mb-2">
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
            
            {/* <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">Change avatar</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Avatar</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Label htmlFor="avatar">Upload new image</Label>
                  <Input id="avatar" type="file" accept="image/*" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAvatarDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsAvatarDialogOpen(false)}>Save</Button>
                </div>
              </DialogContent>
            </Dialog> */}
          </div>
        </div>
        
        {/* Personal Information */}
        <div className="space-y-6 mb-12">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
              <p className="text-foreground">{user?.name}</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Credits Remaining</h3>
              <p className="text-foreground">{user?.credits}</p>
            </div>
              <Button variant="outline" size="sm">Upgrade</Button>

           
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p className="text-foreground">{user?.email}</p>
            </div>
          </div>
        </div>
        
        {/* API Key Section */}
        <Card className="mb-12 overflow-hidden border-card-foreground/20">
          <div className="p-6 flex flex-col gap-2">
            <h3 className="text-lg font-semibold mb-2">API Key</h3>
            <div className="relative flex items-center bg-[#18181B] rounded-lg border border-[#333] px-4 py-2">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                readOnly
                className="flex-1 bg-transparent text-gray-200 tracking-widest outline-none border-none pr-10"
                style={{ letterSpacing: '0.2em' }}
              />
              <button
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-10 text-gray-400 hover:text-white"
                title={showKey ? 'Hide API Key' : 'Show API Key'}
                type="button"
              >
                {showKey ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M6.343 6.343A7.963 7.963 0 004 9c0 4.418 3.582 8 8 8 1.657 0 3.22-.403 4.575-1.125M17.657 17.657A7.963 7.963 0 0020 15c0-4.418-3.582-8-8-8-1.657 0-3.22.403-4.575 1.125" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.832-.64 1.624-1.09 2.357" /></svg>
                )}
              </button>
              <button
                onClick={handleCopyKey}
                className="absolute right-2 text-gray-400 hover:text-white"
                title="Copy API Key"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" /><rect x="3" y="3" width="13" height="13" rx="2" /></svg>
              </button>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <Button
                onClick={handleGenerateNewKey}
                disabled={isGenerating}
                className="flex items-center gap-2 bg-[#23232A] border border-[#333] px-5 py-2 rounded-lg text-white font-medium hover:bg-[#292933] transition-colors disabled:opacity-50"
                type="button"
              >
                {isGenerating ? (
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582M20 20v-5h-.581M5.635 5.635A9.969 9.969 0 012 12c0 5.523 4.477 10 10 10a9.969 9.969 0 006.365-2.365M18.364 18.364A9.969 9.969 0 0022 12c0-5.523-4.477-10-10-10a9.969 9.969 0 00-6.364 2.364" /></svg>
                )}
                {isGenerating ? 'Generating...' : 'Regenerate Key'}
              </Button>
              {isCopied && (
                <span className="text-green-400 text-sm ml-2">Copied!</span>
              )}
              <span className="text-xs text-gray-400 ml-auto">Keep your API key secret. <a href="#" className="underline hover:text-blue-300">How to use this key?</a></span>
            </div>
          </div>
        </Card>
        
        {/* Pro Membership Banner */}
        {/* <Card className="mb-12 overflow-hidden border-card-foreground/20">
          <div className="flex flex-col md:flex-row">
            <div className="p-6 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-lg">perplexity</span>
                <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded font-medium">PRO</span>
              </div>
              
              <h3 className="text-xl font-medium mb-2">Unlock the most powerful search experience with Perplexity Pro</h3>
              <p className="text-muted-foreground text-sm mb-4">Get the most out of Perplexity with Pro.</p>
              
              <Button
                variant="outline"
                className="gap-2 transition-all hover:gap-3"
                onClick={() => {}}
              >
                Learn more <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="md:w-[40%] relative h-48 md:h-auto overflow-hidden bg-gradient-to-r from-blue-600/20 to-purple-600/20">
              <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg')] bg-cover bg-center opacity-60 mix-blend-overlay"></div>
            </div>
          </div>
        </Card> */}
        
        {/* System Section */}
        <h2 className="text-xl font-bold mb-6">System</h2>
        <Separator className="mb-6" />
        
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <span>Support</span>
            </div>
            <Link  href="https://x.com/Ayush3241"> <Button variant="outline" size="sm">Contact</Button> </Link>
          </div>
          
          {/* <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <span>Billing</span>
            </div>
            <Button variant="outline" size="sm">Manage</Button>
          </div> */}
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-muted-foreground" />
              <span>You are signed in as {user?.name}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>Sign out</Button>
          </div>
        </div>
        
        {/* Session Management */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Delete your account</h3>
            <Button variant="outline" size="sm" onClick={handleDeleteAccount}>Delete Account</Button>
          </div>
          <p className="text-sm text-muted-foreground">Devices or browsers where you are signed in</p>
        </div>
      </main>
    </div>
  );
}