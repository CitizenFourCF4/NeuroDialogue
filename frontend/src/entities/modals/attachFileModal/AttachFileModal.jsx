import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import FileView from 'src/shared/fileView/FileView';


const AttachFileModal = (props) => {
  const handleSendButton = () => {
    props.onSendData({
      message_type: 'file',
      message: props.selectedFile,
    })
    props.onHide()    
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
        {props.selectedFile && <FileView filename={props.selectedFile.name} filesize={props.selectedFile.size} iconsize={30}/>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleSendButton}>Отправить</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AttachFileModal