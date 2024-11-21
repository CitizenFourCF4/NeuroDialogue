import React from 'react'
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { MdLogout, MdBrightnessMedium } from "react-icons/md";
import { useKeycloak } from "@react-keycloak/web";
import styles from './styles.module.css'

import { useSelector, useDispatch } from 'react-redux'
import { selectColorMode, setColorMode } from 'src/app/store/slices/chatSlice'


const Settings = ({setIsShowSettings}) => {
  const { keycloak } = useKeycloak();
  const colormode = useSelector(selectColorMode)
  const dispatch = useDispatch();
  return (
    <Card id={styles.card} colormode={colormode}>
      <ListGroup className="list-group-flush" style={{textAlign: 'left'}}>
        <ListGroup.Item colormode={colormode} id={styles.listItem} 
        onClick={colormode==='dark' 
          ? () => {dispatch(setColorMode('light')); setIsShowSettings(false)} 
          : () => {dispatch(setColorMode('dark')); setIsShowSettings(false)}}>
            <MdBrightnessMedium/> Change color theme
        </ListGroup.Item>
        <ListGroup.Item colormode={colormode} id={styles.listItem} onClick={keycloak.logout}>
          <MdLogout />Log out
        </ListGroup.Item>
      </ListGroup>
    </Card>
  )
}

export default Settings