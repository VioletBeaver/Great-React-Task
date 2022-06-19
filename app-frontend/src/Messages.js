import { Fragment, useEffect, useState } from 'react';
import axios from 'axios';


function Messages() {
  const [messages, setMessages] = useState(null);
  const [chats, setChats] = useState(null);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const responses = await Promise.all([
        axios.get('http://localhost:8000/api/messages'),
        axios.get('http://localhost:8000/api/chats'),
        axios.get('http://localhost:8000/api/users'),
      ]);
      setMessages(responses[0].data);
      setChats(responses[1].data);
      setUsers(responses[2].data);
    };
    fetchData();
  }, []);

  if (!messages || !chats || !users) {
    return 'Loading...';
  }

  return (
    <ul>
      {chats.map(chat => (
        <Fragment key={`chat-${chat.id}`}>
          <li>
            {chat.name}
          </li>
          <ul style={{ marginLeft: 4 }}>
            {messages.filter(msg => msg.chatId === chat.id).map(msg => (
              <li key={`msg-${msg.id}`}>
                <p>Author: {users.find(u => u.id === msg.authorId)?.username}</p>
                <p>Topic: {msg.topic}</p>
                <p>{msg.text}</p>
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </ul>
  );
}

export default Messages;
