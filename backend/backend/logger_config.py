from loguru import logger

logger.add("logs/dialogue_logging.log", format="{time:YYYY-MM-DD at HH:mm:ss} | {level} | {message}", compression="zip", rotation="5 mb")

__all__ = ["logger"]