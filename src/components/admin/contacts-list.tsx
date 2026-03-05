'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Clock, CheckCircle, Trash2, Expand, Send, CornerDownRight } from 'lucide-react';
import { updateContactStatus, deleteContact, sendReply } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

type Contact = {
    id: number;
    name: string;
    email: string;
    message: string;
    status: string | null;
    createdAt: Date | null;
    adminReply: string | null;
};

export function AdminContactsView({ initialData }: { initialData: Contact[] }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { toast } = useToast();
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyText, setReplyText] = useState('');

    const handleStatusUpdate = (id: number, status: 'read' | 'unread' | 'resolved') => {
        startTransition(async () => {
            await updateContactStatus(id, status);
            router.refresh();
        });
    };

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this ticket?')) return;
        startTransition(async () => {
            await deleteContact(id);
            router.refresh();
        });
    };

    const handleSendReply = (id: number, email: string, name: string) => {
        if (!replyText.trim()) return;

        startTransition(async () => {
            const res = await sendReply(id, email, name, replyText);
            if (res.success) {
                toast({ title: 'Reply Sent', description: res.message });
                setReplyingTo(null);
                setReplyText('');
                await updateContactStatus(id, 'resolved');
                router.refresh();
            } else {
                toast({ title: 'Failed to send', description: res.message, variant: 'destructive' });
            }
        });
    };

    // Filter and sort tickets
    const unread = initialData.filter((c) => c.status === 'unread');
    const read = initialData.filter((c) => c.status === 'read');
    const resolved = initialData.filter((c) => c.status === 'resolved');

    const displayContacts = [...unread, ...read, ...resolved];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold font-headline text-primary tracking-tight">Contact Tickets</h2>
                <p className="text-muted-foreground text-lg">Manage incoming inquiries and responses.</p>
            </div>

            <div className="flex gap-4 mb-6">
                <Badge variant="destructive" className="px-4 py-1 text-sm bg-destructive/10 text-destructive border-transparent">
                    {unread.length} Unread
                </Badge>
                <Badge variant="secondary" className="px-4 py-1 text-sm">
                    {read.length} Read
                </Badge>
                <Badge variant="outline" className="px-4 py-1 text-sm border-primary/20 text-primary">
                    {resolved.length} Resolved
                </Badge>
            </div>

            {displayContacts.length === 0 ? (
                <div className="p-12 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground">
                    <Mail className="h-12 w-12 mb-4 text-muted" />
                    <p>No contact tickets found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {displayContacts.map((contact) => (
                        <Card key={contact.id} className={`transition-all ${contact.status === 'unread' ? 'border-l-4 border-l-destructive shadow-md bg-destructive/5' : 'bg-card opacity-90'}`}>
                            <CardHeader className="pb-3 flex flex-row items-start justify-between">
                                <div>
                                    <CardTitle className="text-xl flex items-center gap-3">
                                        {contact.name}
                                        {contact.status === 'unread' && <Badge variant="destructive" className="h-5 text-[10px] bg-destructive text-destructive-foreground">NEW</Badge>}
                                        {contact.status === 'resolved' && <Badge variant="outline" className="h-5 text-[10px] text-primary border-primary">RESOLVED</Badge>}
                                    </CardTitle>
                                    <CardDescription className="mt-1 flex items-center gap-2">
                                        <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors hover:underline">
                                            {contact.email}
                                        </a>
                                        •
                                        <span>{contact.createdAt ? new Date(contact.createdAt).toISOString().split('T')[0] : 'Unknown Date'}</span>
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                <div className="bg-background/50 p-4 rounded-lg border border-border/50 text-sm whitespace-pre-wrap flex-1 relative">
                                    <div className="absolute top-2 right-2 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">User</div>
                                    {contact.message}
                                </div>
                                {contact.adminReply && (
                                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 text-sm whitespace-pre-wrap flex-1 relative mt-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CornerDownRight className="w-4 h-4 text-primary" />
                                            <span className="text-[10px] text-primary uppercase font-bold tracking-wider">Your Reply</span>
                                        </div>
                                        <div className="text-foreground/90 pl-6 border-l-2 border-primary/30 ml-2">
                                            {contact.adminReply}
                                        </div>
                                    </div>
                                )}
                                {replyingTo === contact.id && (
                                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 space-y-3 mt-2 animate-in slide-in-from-top-2">
                                        <Textarea
                                            placeholder={`Write your reply to ${contact.name}...`}
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            className="min-h-[120px] bg-background border-primary/30 focus-visible:ring-primary/50"
                                            autoFocus
                                        />
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)} disabled={isPending}>
                                                Cancel
                                            </Button>
                                            <Button size="sm" onClick={() => handleSendReply(contact.id, contact.email, contact.name)} disabled={isPending || !replyText.trim()}>
                                                <Send className="w-4 h-4 mr-2" /> Send Reply
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="pt-0 flex justify-end gap-2">
                                {replyingTo !== contact.id && (
                                    <Button size="sm" variant="outline" className="text-primary border-primary/20 hover:bg-primary/10" onClick={() => setReplyingTo(contact.id)} disabled={isPending}>
                                        <CornerDownRight className="w-4 h-4 mr-2" /> Reply
                                    </Button>
                                )}
                                {contact.status === 'unread' && (
                                    <Button size="sm" variant="secondary" onClick={() => handleStatusUpdate(contact.id, 'read')} disabled={isPending}>
                                        <Clock className="w-4 h-4 mr-2" /> Mark as Read
                                    </Button>
                                )}
                                {contact.status === 'read' && (
                                    <>
                                        <Button size="sm" variant="secondary" onClick={() => handleStatusUpdate(contact.id, 'unread')} disabled={isPending}>
                                            Mark Unread
                                        </Button>
                                        <Button size="sm" className="bg-primary/20 text-primary hover:bg-primary/30" onClick={() => handleStatusUpdate(contact.id, 'resolved')} disabled={isPending}>
                                            <CheckCircle className="w-4 h-4 mr-2" /> Resolve
                                        </Button>
                                    </>
                                )}
                                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(contact.id)} disabled={isPending}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

