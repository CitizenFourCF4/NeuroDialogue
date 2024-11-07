import React from 'react';
import styles from './styles.module.css'

const ColorCircle = ({ color, active }) => {
    return (
      <div className={styles.circle} style={{borderColor:color}} active={active} color={color}></div>
    );
};

export default ColorCircle;