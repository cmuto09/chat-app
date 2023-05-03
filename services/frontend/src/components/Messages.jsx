import { formatDistance, parseISO, min } from 'date-fns';

export default function Messages({ messages }) {
  return (
    <>
      {messages.map((message) => (
        <div className="list-message" id={message.id} key={message.id}>
          <span className="date-sent">{formatDistance(min([parseISO(`${message.date}Z`), new Date()]), new Date(), {addSuffix: true})}</span>
          <p className="message">{message.text}</p>
        </div>
      ))}
    </>
  );
}
