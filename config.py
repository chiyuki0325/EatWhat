from dataclasses import dataclass
from os import getenv
from dotenv import load_dotenv


@dataclass
class Config:
    api_id: str
    api_hash: str
    chat_id: int | str
    easter_eggs: list[str]


load_dotenv()
chat_id = getenv("CHAT_ID")
config = Config(
    api_id=getenv("API_ID"),
    api_hash=getenv("API_HASH"),
    chat_id=int(chat_id) if chat_id.isdigit() else chat_id,
    easter_eggs=getenv("EASTER_EGGS").split(","),
)
