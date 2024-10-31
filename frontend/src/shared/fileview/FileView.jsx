import styles from './fileView.module.css'
import React from 'react'
import { AiOutlineFile } from "react-icons/ai";

const FileView = (props) => {
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Б';

    const sizes = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return parseFloat((bytes / Math.pow(1024, i)).toFixed(1)) + ' ' + sizes[i];
  }
  return (
    <div className={styles.body_wrapper}>
      <div className={styles.circle}>
        <AiOutlineFile size={props.iconsize} color='white'/>
      </div>
      <div>
        <div>{props.filename}</div>
        <div>{(props.filesize==='Unknown') ? 'Неизвестно' : formatFileSize(props.filesize)}</div>
      </div>
    </div>
  )
}

export default FileView