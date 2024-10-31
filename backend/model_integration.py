import subprocess
import string
import random
from vosk_tts import Model, Synth
from num2words import num2words
import os
from nltk.tokenize import WordPunctTokenizer

def process_pdf_2_file(path_to_pdf:str, output_dir:str, model:str='0.1.0-base'):
  result = subprocess.run(['nougat', path_to_pdf, '-o', output_dir, '-m', model], capture_output=True, text=True)
  print(f'{output_dir=}')
  return result

def generate_random_sequence(length=10):
    # Определяем набор символов: буквы (верхний и нижний регистр) и цифры
    characters = string.ascii_letters + string.digits
    # Генерируем случайную последовательность
    random_sequence = ''.join(random.choice(characters) for _ in range(length))
    return random_sequence


def process_text_to_speech(text:str, path_prefix, filename:str='', speaker_id:int=3, model_name:str="vosk-model-tts-ru-0.7-multi")->str:
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