"""
AI Model Integration Module.

This module provides functions for interacting with AI models, including
sending requests, receiving responses, and processing data. It used for 
various tasks such as Extract PDF text, TTS 
AI-based applications.
"""

import os
from pathlib import Path
import random
import re
import subprocess
import string
from typing import Union

from nltk.tokenize import WordPunctTokenizer
from num2words import num2words
from vosk_tts import Model, Synth
from backend.logger_config import logger


def process_pdf_2_file(path_to_pdf:Union[str, Path], output_dir:Union[str, Path], model:str='0.1.0-base')->subprocess.CompletedProcess:
    """Extracts text from a pdf file and saves it in markdown

    Args:
        path_to_pdf (Union[str, Path]): Absolute or relative path to the pdf file
        output_dir (str): Path to the directory where you want to save the result
        model (str, optional): type of model used. Defaults to '0.1.0-base'.

    Returns:
        subprocess.CompletedProcess: Script execution/non-execution report
    """
    logger.info(f"Starting PDF processing: {path_to_pdf} with model: {model}")
    try:
        result = subprocess.run(['nougat', path_to_pdf, '-o', output_dir, '-m', model], capture_output=True, text=True)

        if result.returncode == 0:
            logger.info(f"Successfully processed PDF: {path_to_pdf}")
            markdown_path = path_to_pdf.removesuffix('.pdf') + '.mmd'
            logger.info(f"Started postprocess markdown file: {markdown_path}")
            try:
                postprocess_markdown_output(markdown_path)
                logger.info(f"Successfully postprocessed MArkdown: {markdown_path}")
            except Exception as e:
                logger.exception(f"An exception occurred while postprocessing Markdown: {markdown_path}. Exception: {e}")
        else:
            logger.error(f"Error processing PDF: {path_to_pdf}. Return code: {result.returncode}. Output: {result.stdout}. Error: {result.stderr}")
    except Exception as e:
        logger.exception(f"An exception occurred while processing PDF: {path_to_pdf}. Exception: {e}")
        raise

def postprocess_markdown_output(path_to_markdown:Union[str, Path])->None:
    strline = []
    with open(path_to_markdown, 'r+') as f:
        for line in f:
            line = re.sub(r'(?:[$]{1})|(?:\\\([\(\\\]\[\)]+\\\))', ' ', line)
            line = re.sub(r'(?:(\\\())|(?:(\\\)))|(?:(\\\[))|(?:(\\\]))', ' $ ', line)
            line = re.sub(r'\\tag\{(\d+)\}', r'(\1)', line)
            strline.append(f'{line}')
        f.seek(0)
        f.writelines(strline)


def generate_random_sequence(length=10)->str:
    """Generates a sequence of a given length

    Args:
        length (int, optional): Sequence length. Defaults to 10.

    Returns:
        str: Generated sequence
    """
    characters = string.ascii_letters + string.digits
    random_sequence = ''.join(random.choice(characters) for _ in range(length))
    return random_sequence


def process_text_to_speech(text:str, path_prefix:str, filename:str='', speaker_id:int=3, model_name:str="vosk-model-tts-ru-0.7-multi")->str:
    """Converts text to speech

    Args:
        text (str): Input text
        path_prefix (str): prefix that will be append to filename
        filename (str, optional): output filename. Defaults to ''.
        speaker_id (int, optional): id of the desired speaker voice. Defaults to 3. [0-3]
        model_name (str, optional): type of model used. Defaults to "vosk-model-tts-ru-0.7-multi".

    Returns:
        str: filename
    """
    logger.info("Starting text-to-speech conversion.")
    if not filename:
        filename = generate_random_sequence(10) + '.wav'
        logger.info(f"Generated random filename: {filename}")

    logger.info(f"Using model: {model_name} and speaker ID: {speaker_id}")
    try:
        model = Model(model_name=model_name)
        synth = Synth(model)

        tokenizer = WordPunctTokenizer()
        tokens = tokenizer.tokenize(text)

        logger.debug(f"Tokenized text: {tokens}")

        for i in range(len(tokens)):
            if tokens[i].isdigit():
                tokens[i] = num2words(tokens[i], to='cardinal', lang='ru')

        text=' '.join(tokens)
        logger.debug(f"Processed text: {text}")

        output_path = os.path.join(path_prefix, filename)
        logger.info(f"Output path: {output_path}")
        synth.synth(text, output_path, speaker_id=speaker_id, speech_rate=.8)
        logger.info(f"Successfully synthesized speech to {output_path}")
        return filename
    except Exception as e:
        logger.exception(f"An error occurred during text-to-speech conversion: {e}")
        raise