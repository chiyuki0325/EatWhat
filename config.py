from dataclasses import dataclass
from os import getenv
from dotenv import load_dotenv


@dataclass
class Config:
    api_id: str
    api_hash: str
    chat_id: int
    easter_eggs: list[str]


load_dotenv()
config = Config(
    api_id=getenv("API_ID"),
    api_hash=getenv("API_HASH"),
    chat_id=int(getenv("CHAT_ID")),
    easter_eggs=getenv("EASTER_EGGS").split(","),
)
