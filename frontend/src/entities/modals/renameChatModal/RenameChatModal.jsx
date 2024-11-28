import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useSelector, useDispatch } from 'react-redux'
import { selectChatId, renameChat } from 'src/app/store/slices/chatSlice'
import { useKeycloak } from '@react-keycloak/web';


const RenameChatModal = (props) => {
  const { keycloak } = useKeycloak();
  const username = keycloak.tokenParsed.preferred_username

  const dispatch = useDispatch()
  const [inputTitle, setInputTitle] = useState('')

  const selectedChatId = useSelector(selectChatId)

  const titleUpdateHandler = () => {
    dispatch(renameChat({
      chat_id: selectedChatId, 
      new_title: inputTitle,
      username: username
    }))
    props.onHide()
  }

  return(
    <Modal {...props} backdrop="static" data-bs-theme="dark" centered>
      <Modal.Header closeButton data-bs-theme="dark">
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