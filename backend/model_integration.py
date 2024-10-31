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
import subprocess
import string
from typing import Union

from nltk.tokenize import WordPunctTokenizer
from num2words import num2words
from vosk_tts import Model, Synth


def process_pdf_2_file(path_to_pdf:Union[str, Path], output_dir:Union[str, Path], model:str='0.1.0-base')->subprocess.CompletedProcess:
    """Extracts text from a pdf file and saves it in markdown

    Args:
        path_to_pdf (Union[str, Path]): Absolute or relative path to the pdf file
        output_dir (str): Path to the directory where you want to save the result
        model (str, optional): type of model used. Defaults to '0.1.0-base'.

    Returns:
        subprocess.CompletedProcess: Script execution/non-execution report
    """
    result = subprocess.run(['nougat', path_to_pdf, '-o', output_dir, '-m', model], capture_output=True, text=True)
    return result

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
    if not filename:
        filename = generate_random_sequence(10) + '.wav'
    model = Model(model_name=model_name)
    synth = Synth(model)

    tokenizer = WordPunctTokenizer()
    tokens = tokenizer.tokenize(text)

    for i in range(len(tokens)):
        if tokens[i].isdigit():
            tokens[i] = num2words(tokens[i], to='cardinal', lang='ru')

    text=' '.join(tokens)

    output_path = os.path.join(path_prefix, filename)
    synth.synth(text, output_path, speaker_id=speaker_id)
    return filename