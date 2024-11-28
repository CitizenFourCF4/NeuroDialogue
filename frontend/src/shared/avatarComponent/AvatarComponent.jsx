import React from 'react'
import { FaRobot, FaUser } from "react-icons/fa";
import styles from './styles.module.css'
import Avatar from '@mui/material/Avatar';

const AvatarComponent = ({author}) => {
  return (
    <Avatar sx={{ bgcolor: "#106a62" }}>
        { author === 'chatbot'
      ? <FaRobot />
      : <FaUser/>
      }
    </Avatar>
  )
}

export default AvatarComponent