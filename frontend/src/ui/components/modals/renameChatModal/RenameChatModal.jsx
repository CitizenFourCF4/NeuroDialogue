import React, {useState} from 'react';

import axios from 'axios';
import { upgradeChatRoute } from 'src/utils/APIRoutes';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';


const RenameChatModal = (props) => {

  const [inputTitle, setInputTitle] = useState('')

  const titleUpdateHandler = () => {
    axios.put(upgradeChatRoute, {
       'new_title': inputTitle, 
       'chat_id': props.selectedChatId 
      })
    .then(function (response) {
      props.onHide()
      props.getUserChats()
    })
    .catch(function (error) {
      console.log(error)
    })
  }

  return(
    <Modal {...props} backdrop="static" data-bs-theme="dark" centered>
      <Modal.Header closeButton data-bs-theme={"dark"}>
        <Modal.Title>Введите новое название чата</Modal.Title>
      </Modal.Header>
      <Modal.Body data-bs-theme="dark">
        <Form data-bs-theme="dark">
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" data-bs-theme="dark">
            <Form.Label data-bs-theme="dark">Новое название</Form.Label>
            <Form.Control
              type="text"
              onChange={e => setInputTitle(e.target.value)}
              onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
              placeholder="Type here..."
              autoFocus
              data-bs-theme="dark"
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={titleUpdateHandler}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RenameChatModal