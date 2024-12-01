import React from 'react'
import { FaRobot, FaUser } from "react-icons/fa";
import styles from './styles.module.css'
import Avatar from '@mui/material/Avatar';
import { useKeycloak } from '@react-keycloak/web';

const AvatarComponent = ({author}) => {

  const { keycloak } = useKeycloak();
  const username = keycloak.tokenParsed.preferred_username
  return (
    <Avatar sx={{bgcolor:'inherit'}} author={author} className={styles.avatar}>
        { author === 'chatbot'
      ? <img src="/logo.jpeg" alt="" className={styles.logo}/>
      : <div className={styles.user_avatar}>{username[0]}</div>
      }
    </Avatar>
  )
}

export default AvatarComponent