import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { upgradeChatRoute } from '../../utils/APIRoutes';
import axios from 'axios';
import { useKeycloak } from "@react-keycloak/web";
import styles from './modals.module.css'
import ColorCircle from 'src/shared/fileview/circle/Circle';
import { HiOutlineChatAlt2 } from "react-icons/hi";


const NewChatCreationModal = (props) => {

  const [chatMode, setChatMode] = useState(undefined)

  const { keycloak } = useKeycloak();

  const [title, setTitle] = useState('New Chat')
  
  const chatModes = [
    {
      title_: 'Extract PDF text',
      description: 'Extract text from PDF file and save it in markdown',
      color: '#4ddb97'
    },
    {
      title_: 'Text to speech',
      description: 'Convert text to audio file',
      color: '#ff92e1'
    },
    {
      title_: 'Image to video',
      description: 'Convert Image to Video file',
      color: '#ff975d '
    },
  ]

  const createChatHandler = () => {
    if (!chatMode) {
      alert("Выберите chat mode")
    }
    else{
      const data = {
        'chat_title': title, 
        'username': keycloak.tokenParsed.preferred_username,
        'chat_mode': chatMode
      }
    
      axios.post(upgradeChatRoute, data)
      .then(function() {
        props.getUserChats()
        props.onHide()
      })
      .catch(function (error) {
        console.log(error)
      })
    }
    
  }

  return (
    <Modal
      {...props}
      size="lg"
      backdrop='static'
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <HiOutlineChatAlt2 /> Выберите модель чата
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{'display':'flex', justifyContent:'center'}}>
        <div className={styles.chat_creation_wrapper}>
          <input type="text" onChange={e => setTitle(e.target.value)}  placeholder="Enter chat title ..." className={styles.chat_title_input}/>
          <ul style={{justifyContent: 'center', 'listStyle': 'none'}}>
            {chatModes.map((mode, idx) => (
              <li className={styles.model_header} id={idx} onClick={() => setChatMode(mode.title_)} active={(mode.title_===chatMode) ? 'active': ''}>
                <div className={styles.chat_title}> <ColorCircle color={mode.color} active={(mode.title_===chatMode) ? 'active': ''}/> {mode.title_}</div>
                <p className={styles.chat_description}>{mode.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={createChatHandler}>Create</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default NewChatCreationModal
  

