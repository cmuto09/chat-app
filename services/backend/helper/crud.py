from app import db
from helper.models import Message
from sqlalchemy import asc
from datetime import date

def get_all_messages():
    """get all messages in the db"""

    messages = Message.query.order_by(asc(Message.date)).all()
    return messages

def add_message(text):
    "add a message to the db"

    if text.strip() == "":
        return {"status":"error","message":"text is empty"}

    message = Message(text=text)
    db.session.add(message)
    db.session.commit()
    message_json = {"status":"ok",
                    "message":{"id":message.id,
                                "text":message.text,
                                "date": message.date.isoformat()
                              }
                    }
    
    return message_json