import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client'
import 'bootstrap/dist/css/bootstrap.min.css'

const socket = io.connect('http://localhost:5000')

const Modal = () => {

  return (
    <>
      <div className="position-absolute w-100 vh-100 d-flex align-items-center">
        <div className="container h-100">
          <div className="card">
            ADASDASD
          </div>
        </div>
      </div>
    </>
  )
}

const  App = () => {
  const [user, setUser] = useState('')
  const [currentMessage, setCurrentMessage] = useState('')
  const [messages, setMessages] = useState([])
  
  useEffect(() => {
    
    socket.on('previousMessages', data => setMessages(data))
    socket.on('receivedMessage', (message) => {
      console.log('received?', message)
      setMessages(prevMessages => [...prevMessages, message])
    })
  }, [])

  const writeMessage = (e) => {
    setCurrentMessage(e.target.value)
  }

  const sendMessage = (e) => {
    e.preventDefault()
    const message = {
      user: 'Gustavo',
      message: currentMessage
    }
    socket.emit('sendMessage', message)
    setCurrentMessage('')
    setMessages(prevMessages => [...prevMessages, message])
  }

  return (
    <>
      <Modal/>
      <div className="w-100 vh-100" style={{ background: '#d9e4dd'}}>
        <div className="container d-flex align-items-center h-100 justify-content-center">
          <div className="card h-75 w-75" style={{ background: '#fbf7f0', borderRadius: '15px' }}>
            <div className="card-body">
              <div id="chat-body" className="bg-light w-100 h-100 border rounded p-5">
                {
                  messages.map(message => {
                    return(
                      <p className="p-3 rounded border w-50 shadow-sm">{message.message}</p>
                    )
                  })
                }
              </div>
            </div>
            <div className="card-footer">
              <form onSubmit={(e) => sendMessage(e)} >
                <input 
                  type="text" 
                  className="rounded border-0 p-2 w-100" 
                  placeholder="Digite uma mensagem..." 
                  value={currentMessage} onChange={(e) => writeMessage(e)} />
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;