import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

// Component để format nội dung tin nhắn
const MessageContent = ({ content }) => {
  // Kiểm tra xem có phải là markdown không
  const hasMarkdown = content.includes('**') || content.includes('*');
  
  if (!hasMarkdown) {
    return <div className="text-base">{content}</div>;
  }

  // Tách các phần của tin nhắn
  const sections = content.split('\n\n').filter(Boolean);

  return (
    <div className="space-y-4">
      {sections.map((section, idx) => {
        // Xử lý tiêu đề (text được bọc trong **)
        if (section.startsWith('**') && section.endsWith('**')) {
          return (
            <h3 key={idx} className="font-bold text-lg mt-3 text-primary-content bg-primary/10 p-2 rounded-lg">
              {section.replace(/\*\*/g, '')}
            </h3>
          );
        }
        
        // Xử lý danh sách (bắt đầu bằng *)
        if (section.includes('* **')) {
          const items = section.split('* ').filter(Boolean);
          return (
            <div key={idx} className="bg-base-200 p-3 rounded-lg">
              <ul className="list-disc list-inside space-y-3">
                {items.map((item, itemIdx) => {
                  // Tách phần tiêu đề và nội dung
                  const parts = item.split(':');
                  if (parts.length > 1) {
                    return (
                      <li key={itemIdx} className="text-base">
                        <span className="font-semibold text-primary">
                          {parts[0].replace(/\*\*/g, '')}:
                        </span>
                        <span className="text-base-content">
                          {parts[1]}
                        </span>
                      </li>
                    );
                  }
                  return (
                    <li key={itemIdx} className="text-base text-base-content">
                      {item.replace(/\*\*/g, '')}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        }

        // Xử lý đoạn văn bản thường
        return (
          <p key={idx} className="text-base text-base-content bg-base-100 p-2 rounded-lg">
            {section.replace(/\*\*/g, '')}
          </p>
        );
      })}
    </div>
  );
};

const sampleQuestions = [
  "Chính sách đổi trả hàng hóa",
  "Tôi có thể thanh toán bằng những phương thức nào?",
  "Chính sách giao hàng của bạn là gì?",
  "Giờ mở cửa của cửa hàng",
  "Thanh toán VNPay bị lỗi thì phải làm sao?",
  "Làm sao để liên hệ hỗ trợ kỹ thuật?"
];

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const chatRef = useRef(null);
  const dragRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    // Lấy lịch sử chat từ localStorage khi component mount
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    // Lưu lịch sử chat vào localStorage khi có thay đổi
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const chat = chatRef.current;
      if (!chat) return;

      const newX = position.x + e.movementX;
      const newY = position.y + e.movementY;

      const maxX = window.innerWidth - chat.offsetWidth;
      const maxY = window.innerHeight - chat.offsetHeight;
      
      setPosition({
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY)
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = {
      type: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { data } = await axios.post('/query/', {
        question: message
      });
      
      const botMessage = {
        type: 'bot',
        content: data.response,
        timestamp: new Date().toLocaleTimeString()
      };

      setChatHistory(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        type: 'bot',
        content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
        timestamp: new Date().toLocaleTimeString(),
        isError: true
      };
      setChatHistory(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
    setMessage('');
  };

  const handleSampleQuestionClick = async (question) => {
    const userMessage = {
      type: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { data } = await axios.post('/query/', {
        question: question
      });
      
      const botMessage = {
        type: 'bot',
        content: data.response,
        timestamp: new Date().toLocaleTimeString()
      };

      setChatHistory(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        type: 'bot',
        content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
        timestamp: new Date().toLocaleTimeString(),
        isError: true
      };
      setChatHistory(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleMouseDown = (e) => {
    if (e.target === dragRef.current) {
      setIsDragging(true);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const clearHistory = () => {
    setChatHistory([]);
    localStorage.removeItem('chatHistory');
  };

  return (
    <div 
      className="fixed z-50 transition-all duration-300 ease-in-out"
      style={{
        bottom: isOpen ? '2rem' : '1rem',
        right: isOpen ? '2rem' : '1rem',
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      ref={chatRef}
    >
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="btn btn-circle btn-primary hover:scale-110 transition-transform duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      ) : (
        <div 
          className={`card bg-base-100 shadow-2xl transition-all duration-300 ${
            isExpanded ? 'w-[800px]' : 'w-96'
          }`}
        >
          <div 
            className="card-body p-4"
            style={{ height: isExpanded ? '80vh' : 'auto' }}
          >
            <div 
              className="flex justify-between items-center cursor-move mb-2 select-none"
              ref={dragRef}
              onMouseDown={handleMouseDown}
            >
              <h2 className="card-title text-lg font-bold">Chat Hỗ Trợ</h2>
              <div className="flex gap-2">
                {chatHistory.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="btn btn-square btn-sm btn-ghost hover:bg-base-200 text-error"
                    title="Xóa lịch sử"
                  >
                    🗑️
                  </button>
                )}
                <button 
                  onClick={toggleExpand}
                  className="btn btn-square btn-sm btn-ghost hover:bg-base-200"
                >
                  {isExpanded ? '⊙' : '⤢'}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="btn btn-square btn-sm btn-ghost hover:bg-base-200"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className={`overflow-y-auto mb-4 custom-scrollbar transition-all duration-300 ${
              isExpanded ? 'h-[calc(80vh-180px)]' : 'h-64'
            }`}>
              {chatHistory.map((msg, index) => (
                <div 
                  key={index} 
                  className={`chat ${msg.type === 'user' ? 'chat-end' : 'chat-start'} mb-4 animate-fadeIn`}
                >
                  <div className={`chat-header text-xs opacity-50 mb-1`}>
                    {msg.type === 'user' ? 'Bạn' : 'Bot'} • {msg.timestamp}
                  </div>
                  <div className={`chat-bubble shadow-lg ${
                    msg.type === 'user' 
                      ? 'bg-primary text-primary-content' 
                      : msg.isError 
                        ? 'bg-error text-error-content'
                        : 'bg-white dark:bg-gray-800'
                  }`}>
                    <MessageContent content={msg.content} />
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="overflow-x-auto flex gap-2 mb-4 pb-2 custom-scrollbar">
              <div className="flex gap-2">
                {sampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="btn btn-sm btn-outline min-w-max hover:scale-105 transition-transform duration-200"
                    onClick={() => handleSampleQuestionClick(question)}
                    disabled={isLoading}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập câu hỏi của bạn..."
                className="input input-bordered flex-1 focus:ring-2 focus:ring-primary transition-all duration-200"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button 
                type="submit" 
                className="btn btn-primary hover:scale-105 transition-transform duration-200" 
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
