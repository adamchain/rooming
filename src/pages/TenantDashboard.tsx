// Update the message input form to use MessageThread component
// Find this section in the file:
```typescript
<div className="mb-8">
  <form onSubmit={handleSendMessage} className="flex gap-2">
    <input
      type="text"
      placeholder="Send a message to property manager..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      className="flex-1 px-4 py-2 bg-white dark:bg-[#252525] border border-gray-300 dark:border-[#3b3b3b] rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
    />
    <button
      type="submit"
      disabled={!message.trim()}
      className={`px-4 rounded-md ${message.trim()
        ? 'bg-[#0078d4] hover:bg-[#106ebe] text-white'
        : 'bg-gray-300 dark:bg-[#3b3b3b] text-gray-500 dark:text-gray-400 cursor-not-allowed'
        }`}
    >
      <Send className="h-5 w-5" />
    </button>
  </form>
</div>
```

// Replace with:
```typescript
<div className="mb-8">
  <MessageThread 
    receiverId={data.property.user_id} 
    receiverEmail="Property Manager"
  />
</div>
```