import React, {useState, useEffect, useRef} from 'react'
import { useKeycloak } from "@react-keycloak/web";
import AttachFileModal from 'src/entities/modals/attachFileModal/AttachFileModal';
import { AiOutlinePaperClip } from "react-icons/ai"
import ChatMessages from 'src/entities/chatMessages/ChatMessages';
import TextInputForm from 'src/shared/textInputForm/TextInputForm';
import { useSelector, useDispatch } from 'react-redux';
import { selectChatId, selectChatMode, selectColorMode, getChatData } from 'src/app/store/slices/chatSlice';

import styles from './styles.module.css'

const ChatContainer = () => {
  const dispatch = useDispatch()

  const selectedChatId = useSelector(selectChatId)
  const colormode = useSelector(selectColorMode)
  const chatMode = useSelector(selectChatMode)

  const { keycloak } = useKeycloak();
  const username = keycloak.tokenParsed.preferred_username

  const [isShowAttachFileModal, setIsShowAttachFileModal] = useState(false);
  const handleAttachFileModalClose = () => setIsShowAttachFileModal(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileAttach = (event) => {
    const file = event.target.files[0];
    const filename = file.name
    if (file) {
      if ((chatMode === 'Extract PDF text') && !filename.endsWith(".pdf")) {
        alert('Выберите .pdf файл')
      }
      else if ((chatMode === 'Image to Video') && (!filename.endsWith('.jpeg') || !filename.endsWith('.jpg') || !filename.endsWith('.png'))){
        alert('Выберите [.jpg, .jpeg, .png] файл')
      }
      else{
        setSelectedFile(file)
        setIsShowAttachFileModal(true)
      }
    }
  };
  
  const handleClipClick = () => {
    // Открываем диалог выбора файла
    fileInputRef.current.click();
  };

  useEffect(()=> {
    dispatch(getChatData(selectedChatId))
  }, [selectedChatId])

  return (
    <section className={styles.chatbox} colormode={colormode}>
      <div className={styles.chat_messages_holder}>
        <div style={{width: '25%', textAlign:'left'}}>
          <h4 style={{marginBottom:"30px", marginLeft:'20px'}}>
            {chatMode && chatMode}
          </h4>
        </div>
        <ChatMessages colormode={colormode}/>
      </div>
      <div className={styles.chat_input_holder}>
        {chatMode && chatMode!='Text to speech' && 
        <div>
          <input type="file" name="" id="" ref={fileInputRef} onChange={handleFileAttach} style={{ display: 'none' }} />
          <div className={styles.clip_wrapper}>
            <AiOutlinePaperClip style={{marginRight: '10px', color:'grey'}} size={40} onClick={handleClipClick} /> 
          </div>
        </div>
        }
        <TextInputForm colormode={colormode} username={username}/>
      </div>
      <AttachFileModal show={isShowAttachFileModal} onHide={handleAttachFileModalClose} selectedFile={selectedFile} username={username}/>
    </section>
  )
}

export default ChatContainer