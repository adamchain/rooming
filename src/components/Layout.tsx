// Add unread messages count to the notifications bell
// Find the notifications button in the header and update it:
```typescript
{/* Notifications */}
<button className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-200 dark:hover:bg-[#292929] transition-colors relative">
  <Bell size={20} />
  {unreadMessages > 0 && (
    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
      {unreadMessages}
    </span>
  )}
</button>
```

// Add this state at the top of the component:
```typescript
const [unreadMessages, setUnreadMessages] = useState(0);

useEffect(() => {
  const loadUnreadMessages = async () => {
    try {
      const { data } = await supabase
        .from('messages')
        .select('id')
        .eq('receiver_id', user?.id)
        .eq('read', false);
      
      setUnreadMessages(data?.length || 0);
    } catch (error) {
      console.error('Error loading unread messages:', error);
    }
  };

  if (user) {
    loadUnreadMessages();
    // Subscribe to new messages
    const subscription = supabase
      .channel('messages')
      .on('INSERT', (payload) => {
        if (payload.new.receiver_id === user.id) {
          setUnreadMessages(prev => prev + 1);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }
}, [user]);
```