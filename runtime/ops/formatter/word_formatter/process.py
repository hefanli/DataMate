# # -- encoding: utf-8 --

#
# Description:
# Create: 2024/1/30 15:24
# """
from loguru import logger
import os
import subprocess
import time
from typing import Dict, Any

from datamate.common.utils import check_valid_path
from datamate.core.base_op import Mapper


class WordFormatter(Mapper):
    SEPERATOR = ' | '

    def __init__(self, *args, **kwargs):
        super(WordFormatter, self).__init__(*args, **kwargs)

    def execute(self, sample: Dict[str, Any]) -> Dict[str, Any]:
        start = time.time()
        file_name = sample[self.filename_key]
        file_path = sample[self.filepath_key]
        file_type = sample[self.filetype_key]
        txt_content = self.word2html(file_path, file_type)
        sample[self.text_key] = txt_content
        logger.info(f"fileName: {file_name}, method: WordFormatter costs {(time.time() - start):6f} s")
        return sample

    @staticmethod
    def word2html(file_path, file_type):
        check_valid_path(file_path)
        file_dir = file_path.rsplit('/', 1)[0]
        file_name = file_path.rsplit('/', 1)[1]
        html_file_path = os.path.join(file_dir, f"{file_name}.txt")

        current_file_path = os.path.dirname(os.path.abspath(__file__))
        try:
            process = subprocess.Popen(
                ['java', '-jar', f'{current_file_path}/../../../java_operator/WordFormatter-1.0.jar', file_path,
                 html_file_path, file_type], shell=False, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            stdout, stderr = process.communicate(timeout=24 * 60 * 60)
            if process.returncode == 0:
                logger.info(f"Convert {file_path} successfully to DOCX")
            else:
                logger.info(f"Convert {file_path} failed, error: {stderr.strip().decode('utf-8')}.")
                raise RuntimeError()
        except subprocess.CalledProcessError as e:
            logger.error(f"Convert failed: ｛e｝, return code: ｛e.returncode｝")
        except FileNotFoundError:
            logger.error("LibreOffice command not found, please make sure it is available in PATH")
        except Exception as e:
            logger.error(f"An unexpected error occurred, convert failed: ｛e｝", )

        try:
            with open(html_file_path, 'r', encoding='utf-8') as file:
                txt_content = file.read()
            os.remove(html_file_path)
            logger.info("Tmp docx file removed")
        except FileNotFoundError:
            logger.error(f"Tmp file ｛html_file_path｝ does not exist")
        except PermissionError:
            logger.error(f"You are not allowed to delete tmp file {html_file_path}")
        logger.info(f"Convert {html_file_path} to html success")
        return txt_content
