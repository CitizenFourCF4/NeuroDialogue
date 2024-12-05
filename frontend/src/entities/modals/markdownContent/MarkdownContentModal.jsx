import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math'
import remarkGfm from "remark-gfm";
import { BsDownload } from "react-icons/bs";
import { MathJaxContext, MathJax } from "better-react-mathjax";
import 'src/app/static/katex.min.css'

const MarkdownContentModal = (props) => {

  const [markdownContent, setMarkdownContent] = useState('')

  useEffect(() => {
    axios.get(props.link)
    .then(function (response) {
      setMarkdownContent(response.data);
    })
  }, []) 

  const config = {
    loader: { load: ["[tex]/html"] },
    tex: {
      packages: { "[+]": ["html"] },
      inlineMath: [["$", "$"]],
      displayMath: [["$$", "$$"]],
    },
  };

  return (
    <Modal
      {...props}
      size="lg"
      backdrop='static'
      aria-labelledby="contained-modal-title-vcenter"
      centered
      scrollable={true}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Markdown Content
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <MathJaxContext config={config}>
        <MathJax dynamic hideUntilTypeset="every">
          <ReactMarkdown remarkPlugins={[remarkGfm]} className={styles.markdown_wrapper} >{markdownContent}</ReactMarkdown>
        </MathJax>
      </MathJaxContext>
      </Modal.Body>
      <Modal.Footer>
        <a href={props.link} className={styles.link}>
          <BsDownload size={25}/>
        </a>
        
      </Modal.Footer>
    </Modal>
  )
}

export default MarkdownContentModal