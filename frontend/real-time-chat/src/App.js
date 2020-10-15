import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client'
import 'bootstrap/dist/css/bootstrap.min.css'

const socket = io.connect('http://localhost:5000')

const Modal = ({ setUser }) => {
  const [userName, setUserName] = useState('')
  return (
    <>
      <div className="position-absolute w-100 vh-100" style={{zIndex: 10, background: '#00000065'}}>
        <div className="container h-100 d-flex align-items-center justify-content-center">
          <div className="card w-50" style={{ background: '#cdc9c3' }}>
            <div className="card-header" style={{ background: '#fbf7f0'}}>
              <h4 className="text-muted mb-0">Bem vindo ao Bate Papo!</h4>
            </div>
            <div className="card-body">
              <form onSubmit={(e) => {
                e.preventDefault()
                console.log(userName)
                userName.length && setUser(userName)
              }}>
                <input 
                  type="text" 
                  className="rounded border-0 p-2 w-100" 
                  placeholder="Escolha um nome de usuário..." 
                  onChange={(e) => setUserName(e.target.value)} />
              </form>
            </div>
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
      user: user,
      message: currentMessage
    }
    socket.emit('sendMessage', message)
    setCurrentMessage('')
    setMessages(prevMessages => [...prevMessages, message])
  }

  return (
    <>
      {!user && <Modal setUser={setUser} /> }
      <div className="w-100 vh-100" style={{ background: '#d9e4dd'}}>
        <div className="container d-flex align-items-center h-100 justify-content-center">
          <div className="card h-75 w-75" style={{ background: '#fbf7f0', borderRadius: '15px' }}>
            <div className="card-body">
              <div id="chat-body" className="bg-light w-100 h-100 border rounded p-5">
                {
                  messages.map(message => {
                    return(
                      <div className="rounded border w-50 px-3 pb-2 pt-0 shadow-sm mb-3">
                        <span style={{ fontSize: '.8rem', fontWeight: 'bold', color: '#555555'}} >{message.user}</span>
                        <hr className="mt-0 mb-2" />
                        <p className="mb-0" style={{ color: '#555555' }}>{message.message}</p>
                      </div>
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