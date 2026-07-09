from sqlmodel import Session, select
from typing import List, Type, TypeVar, Optional

T = TypeVar('T')

class BaseRepository:
    def __init__(self, session: Session):
        self.session = session

    def save(self, obj):
        self.session.add(obj)
        self.session.commit()
        self.session.refresh(obj)
        return obj

    def delete(self, obj):
        self.session.delete(obj)
        self.session.commit()

    def get_by_id(self, model: Type[T], obj_id: int) -> Optional[T]:
        return self.session.get(model, obj_id)

    def get_all(self, model: Type[T]) -> List[T]:
        return self.session.exec(select(model)).all()