import { useState } from 'react';
import axios from 'axios';

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post('/query/', {
        question: message
      });
      setResponse(data.response);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.');
    }
    setIsLoading(false);
    setMessage('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="btn btn-circle btn-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      ) : (
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title">Chat</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="btn btn-square btn-sm"
              >
                ✕
              </button>
            </div>
            
            <div className="h-64 overflow-y-auto mb-4">
              {response && (
                <div className="chat chat-start">
                  <div className="chat-bubble">{response}</div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập câu hỏi của bạn..."
                className="input input-bordered flex-1"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isLoading || !message.trim()}
              >
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  'Gửi'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
