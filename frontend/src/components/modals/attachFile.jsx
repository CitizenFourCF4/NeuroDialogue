import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import {addMessageRoute} from 'src/utils/APIRoutes'
import axios from 'axios';
import { useKeycloak } from "@react-keycloak/web";
import FileView from 'src/shared/fileview/FileView';


const AttachFileModal = (props) => {

  const { keycloak } = useKeycloak();
  const selectedFile = props.selectedFile

  const handleSendButton = () => {
    props.onHide()
    const formData = new FormData();
    formData.append('chat_id', props.selectedChat)
    formData.append('username', keycloak.tokenParsed.preferred_username)
    formData.append('message', props.selectedFile);
    formData.append('message_type', "file");
    axios.post(addMessageRoute, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(function() {
      props.getChatData()
    })
    
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
          Отправить как файл
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedFile && <FileView filename={selectedFile.name} filesize={selectedFile.size} iconsize={30}/>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleSendButton}>Отправить</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AttachFileModal
